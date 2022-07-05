import path from 'path'

export const getConfig = () => {
    const prismaSchemaPath = process.argv[2] || 'prisma'
    const prismaSchemaPathResolved =
        prismaSchemaPath.charAt(0) === '/'
            ? prismaSchemaPath
            : path.join(process.cwd(), prismaSchemaPath)
    const originalPrismaSchemaPath = path.join(
        prismaSchemaPathResolved,
        'schema.prisma',
    )
    const processedPrismaSchemaPath = path.join(
        prismaSchemaPathResolved,
        'processed-schema.prisma',
    )
    const jsonSchemaPath = path.join(
        prismaSchemaPathResolved,
        'json-schema.json',
    )
    return {
        originalPrismaSchemaPath,
        processedPrismaSchemaPath,
        jsonSchemaPath,
    }
}
