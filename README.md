# Prisma Mongo JSON Schema Generator

A generator, which takes a Prisma 2 `schema.prisma` and generates a JSON Schema in flavor which MongoDB accepts (https://www.mongodb.com/docs/manual/reference/operator/query/jsonSchema/#std-label-jsonSchema-extension).

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

**2. Add the generator to the schema**

```prisma
generator jsonSchema {
  provider = "prisma-mongo-json-schema-generator"
}
```

With a custom output path (default=./json-schema)

```prisma
generator jsonSchema {
  provider = "prisma-mongo-json-schema-generator"
  output = "custom-output-path"
}
```                                                                                                                      |

**3. Run generation**

prisma:

```shell
prisma generate
```

nexus with prisma plugin:

```shell
nexus build
```

## Supported Node Versions

|         Node Version | Support            |
| -------------------: | :----------------- |
| (Maintenance LTS) 14 | :heavy_check_mark: |
|          (Active) 16 | :heavy_check_mark: |
|         (Current) 17 | :heavy_check_mark: |
