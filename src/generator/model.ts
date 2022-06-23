import { DMMF } from '@prisma/generator-helper'
import { JSONSchema4 } from 'json-schema'
import { getJSONSchemaProperty } from './properties'
import { DefinitionMap, ModelMetaData } from './types'

function getRelationFields(model: DMMF.Model): string[] {
    return model.fields
        .map((field) => (field.relationName ? field.name : ''))
        .filter(Boolean)
}
function getRequiredFields(model: DMMF.Model): string[] {
    return model.fields
        .map((field) =>
            !field.relationName && field.isRequired ? field.name : '',
        )
        .filter(Boolean)
        .filter((field) => field !== 'id')
}

export function getJSONSchemaModel(modelMetaData: ModelMetaData) {
    return (model: DMMF.Model): DefinitionMap => {
        const definitionPropsMap = model.fields.map(
            getJSONSchemaProperty(modelMetaData),
        )

        const propertiesMap = definitionPropsMap.map(
            ([name, definition]) => [name, definition] as DefinitionMap,
        )
        const relationFields = getRelationFields(model)
        const requiredFields = getRequiredFields(model)
        const propertiesWithoutRelations = propertiesMap
            .filter(
                (prop) =>
                    relationFields.findIndex((field) => field === prop[0]) ===
                    -1,
            )
            .filter((prop) => prop[0] !== 'id')

        const properties = Object.fromEntries(propertiesWithoutRelations)

        const definition: JSONSchema4 = {
            bsonType: 'object',
            properties,
            ...(requiredFields.length
                ? {
                      required: requiredFields,
                  }
                : {}),
        }

        return [model.name, definition]
    }
}
