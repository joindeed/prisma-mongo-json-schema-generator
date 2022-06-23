import { DMMF } from '@prisma/generator-helper'
import { JSONSchema4 } from 'json-schema'

export interface PropertyMetaData {
    required: boolean
}

export interface ModelMetaData {
    enums: DMMF.DatamodelEnum[]
    definitions?: Record<string, JSONSchema4>
}

export type DefinitionMap = [name: string, definition: JSONSchema4]
export type PropertyMap = [...DefinitionMap, PropertyMetaData]
