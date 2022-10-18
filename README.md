# Prisma Mongo JSON Schema Generator

This package contains two things:

- A generator, which takes a Prisma 2 `schema.prisma` and generates a JSON Schema in flavor which MongoDB accepts (https://www.mongodb.com/docs/manual/reference/operator/query/jsonSchema/#std-label-jsonSchema-extension).
- A script to apply the generated schema to MongoDB collections
- A script to validate database contents accorging to the schema

## Why?

Because Prisma would blow up at the very wrong moment if the underlying data is invalid. Read this thread to understand the problem better:

[<img width="450" alt="image" src="https://user-images.githubusercontent.com/837032/177534260-79b588e1-7dac-47be-96cc-3478fa9943d4.png">](https://twitter.com/dimaip/status/1544632203052589056)

## Credit

This package is a fork of [prisma-json-schema-generator](https://github.com/valentinpalkovic/prisma-json-schema-generator), an amazing work by [Valentin Palkovic](https://github.com/valentinpalkovic)!

## Getting Started

**1. Install**

npm:

```shell
npm install prisma-mongo-json-schema-generator --save-dev
```

yarn:

```shell
yarn add -D prisma-mongo-json-schema-generator
```

**2. Apply the schema to database**

```shell
PRISMA_SCHEMA_FILE=prisma/schema.prisma MONGO_URI=mongodb://localhost:27017/your-database yarn prisma-mongo-json-schema-generator-apply
```

If you are getting `AuthenticationFailed` errors, make sure that you are specifying the correct auth database in the connection URI by using the `authSource` query parameter (ex: `authSource=admin`).

The package is configurable via environment variables:

| Env name | Default value |
|--|--|
| MONGO_URI | required |
| PRISMA_SCHEMA_FILE | `prisma/schema.prisma` |
| VALIDATION_LEVEL | `strict` |
| VALIDATION_ACTION | `error` |

If you want to omit some property from being included in the schema, add `@MongoSchema.omit` to its documentation in the Prisma schema:

```
model SomeModel {
  /// @MongoSchema.omit
  someProperty String
}
```

**3. Validate collections according to the schema**

```shell
PRISMA_SCHEMA_FILE=prisma/schema.prisma MONGO_URI=mongodb://localhost:27017/your-databse yarn prisma-mongo-json-schema-generator-verify
```
