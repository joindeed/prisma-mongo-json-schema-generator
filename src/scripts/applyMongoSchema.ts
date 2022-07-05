import { MongoClient } from 'mongodb'

export const applyMongoSchema = async (schema: {
    properties: Record<string, unknown>
}) => {
    const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/'
    const client = new MongoClient(uri)
    try {
        await client.connect()
        const database = client.db(process.env.MONGO_DB)
        await Promise.all(
            Object.keys(schema.properties).map(async (collectionName) => {
                try {
                    await database.command({
                        collMod: collectionName,
                        validator: {
                            $jsonSchema: schema.properties[collectionName],
                        },
                    })
                    console.info(
                        `✅ Applied $jsonSchema to collection ${collectionName}`,
                    )
                } catch (e) {
                    console.info(
                        `❌ Failed to apply $jsonSchema to collection ${collectionName}`,
                    )
                }
            }),
        )
    } finally {
        await client.close()
    }
}
