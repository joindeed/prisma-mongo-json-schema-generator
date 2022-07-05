import { attributeExtractor } from './attributeExtractor'
import { prependGenerator } from './prependGenerator'

import { promises as fs } from 'fs'

import { getConfig } from './getConfig'

const getSchema = async (): Promise<string> => {
    const { originalPrismaSchemaPath } = getConfig()
    return String(await fs.readFile(originalPrismaSchemaPath))
}
const writeSchema = async (schema: string): Promise<void> => {
    const { processedPrismaSchemaPath } = getConfig()
    await fs.writeFile(processedPrismaSchemaPath, schema)
}

export const processSchema = async () =>
    writeSchema(prependGenerator(attributeExtractor(await getSchema())))
