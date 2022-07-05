# Prisma Mongo JSON Schema Generator

This package contains two things:

- A generator, which takes a Prisma 2 `schema.prisma` and generates a JSON Schema in flavor which MongoDB accepts (https://www.mongodb.com/docs/manual/reference/operator/query/jsonSchema/#std-label-jsonSchema-extension).
- A set of scripts to apply the generated schema to MongoDB collections and to validate the data accordingly

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
PRISMA_SCHEMA_FILE=prisma/prisma.schema MONGO_URI=mongodb://localhost:27017/your-database yarn prisma-mongo-json-schema-generator-apply
```

Env variables:

| Env name | Default value |
|--|--|
| MONGO_URI | required |
| PRISMA_SCHEMA_FILE | `prisma/prisma.schema` |
| VALIDATION_LEVEL | `strict` |
| VALIDATION_ACTION | `error` |

**3. Validate collections according to the schema**

```shell
PRISMA_SCHEMA_FILE=prisma/prisma.schema MONGO_URI=mongodb://localhost:27017/your-database yarn prisma-mongo-json-schema-generator-validate
```
