import { exec as execCallback } from 'child_process'

import { promisify } from 'util'

import { promises as fs } from 'fs'

import { applyMongoSchema } from './applyMongoSchema'
import { getConfig } from './getConfig'
import { processSchema } from './processSchema'
import { verifyMongoSchema } from './verifyMongoSchema'

const exec = promisify(execCallback)

export const getJsonSchema = async (): Promise<{
    properties: Record<string, unknown>
}> => {
    const { jsonSchemaPath } = getConfig()
    const data = String(await fs.readFile(jsonSchemaPath))
    return JSON.parse(data) as { properties: Record<string, unknown> }
}

export async function run(command: 'apply' | 'verify'): Promise<void> {
    const { processedPrismaSchemaPath, jsonSchemaPath } = getConfig()

    // 1. pre-process the schema
    await processSchema()

    // 2. execute yarn generate
    const { stderr } = await exec(
        `yarn prisma generate --schema ${processedPrismaSchemaPath}`,
    )
    if (stderr) {
        console.error('Prisma schema generation failed!', stderr)
    } else {
        console.info('Prisma schema generated')
    }

    // 3. run the actuall command
    const schema = await getJsonSchema()
    if (command === 'apply') {
        await applyMongoSchema(schema)
    }
    if (command === 'verify') {
        await verifyMongoSchema(schema)
    }

    // 4. remove generated artifacts
    await fs.rm(processedPrismaSchemaPath)
    await fs.rm(jsonSchemaPath)
}
