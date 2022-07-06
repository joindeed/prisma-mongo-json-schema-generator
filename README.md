# Prisma Mongo JSON Schema Generator

This package contains two things:

- A generator, which takes a Prisma 2 `schema.prisma` and generates a JSON Schema in flavor which MongoDB accepts (https://www.mongodb.com/docs/manual/reference/operator/query/jsonSchema/#std-label-jsonSchema-extension).
- A script to apply the generated schema to MongoDB collections
- A script to validate database contents accorging to the schema

## Why?

Prisma has been originally designed to work with relational databases that have rigid schema structure.
Now when Prisma is matched with MongoDB, which is originally a schema-free database, we encounter an impedence mismatch: Prisma expects data inside the DB to be exactly matching the schema and throws when trying to touch (even read!) the data that is at least slightly off, but we have no way to assert the data validity on the database level.

So if you have some legacy data, or some of the admins edit the data directly, or if you have some legacy system directly modifying the data via e.g. Mongoose, you are in big trouble, any slight deviation of data would cause Prisma to throw!

Or you may be testing a feature in development environment, everything going smooth, until it explodes in production with P1012 error because you forgot to migrate some database values.

So that's where this package comes in. It allows you to **generate a JSON schema from your Prisma schema file and apply it automatically to all collections in your database**.
After that, it would be impossible to insert invalid data into the collection: neither via direct modification in e.g. Compass, nor via accessing it via Mongoose etc.

It would make sense to apply the new schema to collections automatically via a CI script on merge to the right branch.
Also probably you would want to run the validation script e.g. daily in CI.

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

The package is configurable via environment variables:

| Env name | Default value |
|--|--|
| MONGO_URI | required |
| PRISMA_SCHEMA_FILE | `prisma/prisma.schema` |
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
PRISMA_SCHEMA_FILE=prisma/prisma.schema MONGO_URI=mongodb://localhost:27017/your-database yarn prisma-mongo-json-schema-generator-validate
```
