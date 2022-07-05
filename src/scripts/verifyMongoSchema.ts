import { MongoClient } from 'mongodb'
import { getConfig } from './getConfig'

export const verifyMongoSchema = async (schema: {
    properties: Record<string, unknown>
}) => {
    const { mongoUri, mongoDb } = getConfig()
    const client = new MongoClient(mongoUri)
    try {
        await client.connect()
        const database = client.db(mongoDb)
        await Promise.all(
            Object.keys(schema.properties).map(async (collectionName) => {
                try {
                    const firstFailedDocument = await database
                        .collection(collectionName)
                        .findOne({
                            $nor: [
                                {
                                    $jsonSchema:
                                        schema.properties[collectionName],
                                },
                            ],
                        })
                    if (firstFailedDocument) {
                        console.info(
                            `❌ Collection ${collectionName} failed validation, first failed document is: `,
                            firstFailedDocument,
                        )
                    } else {
                        console.info(
                            `✅ Collection ${collectionName} passed validation`,
                        )
                    }
                } catch (e) {
                    console.error(e, collectionName)
                }
            }),
        )
    } finally {
        await client.close()
    }
}
