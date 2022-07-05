import { DMMF } from '@prisma/generator-helper'
import {
    assertNever,
    isEnumType,
    isDefined,
    isScalarType,
    PrismaPrimitive,
} from './helpers'
import { ModelMetaData, PropertyMap, PropertyMetaData } from './types'

import type { JSONSchema4 } from 'json-schema'
import { assertFieldTypeIsString } from './assertions'
import { BsonTypeName } from 'jsonSchema'

function getJSONSchemaScalar(
    fieldType: PrismaPrimitive,
): BsonTypeName | Array<BsonTypeName> {
    switch (fieldType) {
        case 'Int':
            return 'int'
        case 'BigInt':
            return 'long'
        case 'DateTime':
            return 'date'
        case 'Bytes':
        case 'String':
            return 'string'
        case 'Float':
        case 'Decimal':
            return 'int'
        case 'Json':
            return ['int', 'string', 'bool', 'object', 'array', 'null']
        case 'Boolean':
            return 'bool'
        default:
            assertNever(fieldType)
    }
}

function getJSONSchemaType(field: DMMF.Field): JSONSchema4['bsonType'] {
    const { isList } = field
    const isObjectId = field.documentation?.includes('@db.ObjectId')
    const scalarFieldType =
        isScalarType(field) && !isList
            ? isObjectId
                ? 'objectId'
                : getJSONSchemaScalar(field.type)
            : field.isList
            ? 'array'
            : isEnumType(field)
            ? isObjectId
                ? 'objectId'
                : 'string'
            : 'object'

    return scalarFieldType
}

function getJSONSchemaForPropertyReference(field: DMMF.Field): JSONSchema4 {
    const notNullable = field.isRequired || field.isList

    assertFieldTypeIsString(field.type)

    const ref = { $ref: field.type }
    return notNullable ? ref : { anyOf: [ref, { type: 'null' }] }
}

function getItemsByDMMFType(field: DMMF.Field): JSONSchema4['items'] {
    const isObjectId = field.documentation?.includes('@db.ObjectId')
    return (isScalarType(field) && !field.isList) || isEnumType(field)
        ? undefined
        : isScalarType(field) && field.isList
        ? {
              bsonType: isObjectId
                  ? 'objectId'
                  : getJSONSchemaScalar(field.type),
          }
        : getJSONSchemaForPropertyReference(field)
}

function isSingleReference(field: DMMF.Field) {
    return !isScalarType(field) && !field.isList && !isEnumType(field)
}

function getEnumListByDMMFType(modelMetaData: ModelMetaData) {
    return (field: DMMF.Field): string[] | undefined => {
        const enumItem = modelMetaData.enums.find(
            ({ name }) => name === field.type,
        )

        if (!enumItem) return undefined
        return enumItem.values.map((item) => item.name)
    }
}

function getDescription(field: DMMF.Field) {
    return field.documentation
}

function getPropertyDefinition(
    modelMetaData: ModelMetaData,
    field: DMMF.Field,
) {
    const bsonType = getJSONSchemaType(field)
    const items = getItemsByDMMFType(field)
    const enumList = getEnumListByDMMFType(modelMetaData)(field)
    const description = getDescription(field)

    const definition: JSONSchema4 = {
        bsonType,
        ...(isDefined(items) && { items }),
        ...(isDefined(enumList) && { enum: enumList }),
        ...(isDefined(description) && { description }),
    }

    return definition
}

export function getJSONSchemaProperty(modelMetaData: ModelMetaData) {
    return (field: DMMF.Field): PropertyMap => {
        const propertyMetaData: PropertyMetaData = {
            required: field.isRequired,
        }

        const property = isSingleReference(field)
            ? getJSONSchemaForPropertyReference(field)
            : getPropertyDefinition(modelMetaData, field)

        const fieldName = field.documentation?.includes('@map(')
            ? field.documentation.match(/@map\("(.+)"\)/)?.[1] || field.name
            : field.name
        return [fieldName, property, propertyMetaData]
    }
}
