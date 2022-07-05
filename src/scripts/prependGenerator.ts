export const prependGenerator = (schema: string): string => `
generator schema {
    provider = "prisma-mongo-json-schema-generator"
    output   = "."
}
${schema}
`
