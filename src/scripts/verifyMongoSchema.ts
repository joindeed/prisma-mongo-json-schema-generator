import { MongoClient } from 'mongodb'

export const verifyMongoSchema = async (schema: {
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
