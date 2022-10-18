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
                        try {
                            // In order to provide some better debug information, we try to update the first failed document in hopes of getting `schemaRulesNotSatisfied` information
                            await database.collection(collectionName).updateOne(
                                { _id: firstFailedDocument._id },
                                {
                                    $set: {
                                        ___schmaValidator: Math.random(),
                                    },
                                },
                            )
                            // We shouldn't have gotten to this point, the previous update should have thrown due to failed $jsonSchema constraints.
                            // If it didn't, it probably means that we forgot to `apply` the schema or that the validation action is not "error"
                            console.warn(
                                'Not able to provide the full debug info, make sure that you have applied the schema with `VALIDATION_LEVEL=strict VALIDATION_ACTION=error`',
                            )
                            console.info(
                                `❌ Collection ${collectionName} failed validation, first failed document is: `,
                                firstFailedDocument,
                            )
                            // Cleanup
                            await database.collection(collectionName).updateOne(
                                { _id: firstFailedDocument._id },
                                {
                                    $unset: {
                                        ___schmaValidator: '',
                                    },
                                },
                            )
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        } catch (e: any) {
                            console.info(
                                `❌ Collection ${collectionName} failed validation, first failed document is: `,
                                firstFailedDocument,
                            )
                            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                            if (e?.errInfo?.details?.schemaRulesNotSatisfied) {
                                console.log('Reason for failure:')
                                console.dir(
                                    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                                    e.errInfo.details.schemaRulesNotSatisfied,
                                    { depth: null },
                                )
                            }
                        }
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
