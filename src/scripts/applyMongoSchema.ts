import { MongoClient } from 'mongodb'
import { getConfig } from './getConfig'

export const applyMongoSchema = async (schema: {
    properties: Record<string, unknown>
}) => {
    const { mongoUri } = getConfig()
    const client = new MongoClient(mongoUri)
    try {
        await client.connect()
        const database = client.db()
        await Promise.all(
            Object.keys(schema.properties).map(async (collectionName) => {
                try {
                    await database.command({
                        collMod: collectionName,
                        validator: {
                            $jsonSchema: schema.properties[collectionName],
                        },
                        validationLevel:
                            process.env.VALIDATION_LEVEL || 'strict',
                        validationAction:
                            process.env.VALIDATION_ACTION || 'error',
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
