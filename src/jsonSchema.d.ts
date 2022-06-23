// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { JSONSchema4 } from 'json-schema'

export type BsonTypeName =
    | 'double'
    | 'string'
    | 'object'
    | 'array'
    | 'binData'
    | 'undefined'
    | 'objectId'
    | 'bool'
    | 'date'
    | 'null'
    | 'regex'
    | 'javascript'
    | 'symbol'
    | 'javascriptWithScope'
    | 'int'
    | 'timestamp'
    | 'long'
    | 'decimal'
    | 'minKey'
    | 'maxKey'

declare module 'json-schema' {
    interface JSONSchema4 {
        bsonType?: BsonTypeName | BsonTypeName[] | undefined
    }
}
