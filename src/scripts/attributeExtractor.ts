export const attributeExtractor = (schema: string): string => {
    const lines = schema.split('\n')
    return lines
        .flatMap((line) => {
            const attributes = []
            if (line.includes('@map(')) {
                const result = line.match(/@map\("(\w+)"\)/)
                if (result?.[1]) {
                    attributes.push(`@map("${result[1]}")`)
                }
            }
            if (line.includes('@db.ObjectId')) {
                attributes.push('@db.ObjectId')
            }
            if (attributes.length) {
                const indentation = line.match(/^(\s*)/)?.[1] || ''
                return [`${indentation}/// ${attributes.join(' ')}`, line]
            }
            return line
        })
        .join('\n')
}
