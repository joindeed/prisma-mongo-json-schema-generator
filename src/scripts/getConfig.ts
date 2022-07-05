import path from 'path'

export const getConfig = () => {
    const prismaSchemaFile =
        process.env.PRISMA_SCHEMA_FILE || 'prisma/schema.prisma'
    const prismaSchemaPath = path.dirname(prismaSchemaFile)
    const prismaSchemaFilename = path.basename(prismaSchemaFile)
    const prismaSchemaPathResolved =
        prismaSchemaPath.charAt(0) === '/'
            ? prismaSchemaPath
            : path.join(process.cwd(), prismaSchemaPath)
    const originalPrismaSchemaPath = path.join(
        prismaSchemaPathResolved,
        prismaSchemaFilename,
    )
    const processedPrismaSchemaPath = path.join(
        prismaSchemaPathResolved,
        'processed-schema.prisma',
    )
    const jsonSchemaPath = path.join(
        prismaSchemaPathResolved,
        'json-schema.json',
    )
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/'
    const mongoDb = process.env.MONGO_DB
    if (!mongoDb) {
        throw new Error('MONGO_DB env var must be set!')
    }
    return {
        originalPrismaSchemaPath,
        processedPrismaSchemaPath,
        jsonSchemaPath,
        mongoUri,
        mongoDb,
    }
}
