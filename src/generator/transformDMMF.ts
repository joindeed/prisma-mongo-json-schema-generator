import type { DMMF } from '@prisma/generator-helper'
import type { JSONSchema4 } from 'json-schema'
import { toCamelCase } from './helpers'

import { getInitialJSON } from './jsonSchema'
import { getJSONSchemaModel } from './model'

const isObject = (obj: unknown): boolean =>
    Boolean(obj && typeof obj === 'object' && !Array.isArray(obj))

// @TODO-DP: not time for proper typing of this now, sorry
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
const expandRefs = (
    definitions: Record<string, JSONSchema4>,
    obj: any,
): void => {
    if (!isObject(obj)) {
        return
    }
    Object.keys(obj).forEach((key) => {
        if (Array.isArray(obj[key])) {
            obj[key].forEach((item: any, index: number) => {
                if (isObject(item) && item.$ref) {
                    obj[key][index] = definitions[item.$ref]
                } else {
                    expandRefs(definitions, item)
                }
            })
        } else if (isObject(obj[key])) {
            const ref = obj[key].$ref
            if (ref) {
                obj[key] = definitions[ref]
            } else {
                expandRefs(definitions, obj[key])
            }
        }
    })
}
/* eslint-enable @typescript-eslint/no-unsafe-assignment */
/* eslint-enable @typescript-eslint/no-unsafe-argument */
/* eslint-enable @typescript-eslint/no-unsafe-member-access */
/* eslint-enable @typescript-eslint/no-unsafe-call */

function getPropertyDefinition({
    definitions,
}: {
    definitions: Record<string, JSONSchema4>
}) {
    return (model: DMMF.Model): [name: string, reference: JSONSchema4] => {
        return [toCamelCase(model.name), definitions?.[model.name]]
    }
}

export function transformDMMF(dmmf: DMMF.Document): JSONSchema4 {
    // TODO: Remove default values as soon as prisma version < 3.10.0 doesn't have to be supported anymore
    const { models = [], enums = [], types = [] } = dmmf.datamodel
    const initialJSON = getInitialJSON()

    const modelDefinitionsMap = models.map(getJSONSchemaModel({ enums }))

    const typeDefinitionsMap = types.map(getJSONSchemaModel({ enums }))
    const definitions = Object.fromEntries([
        ...modelDefinitionsMap,
        ...typeDefinitionsMap,
    ])
    expandRefs(definitions, definitions)

    const modelPropertyDefinitionsMap = models.map(
        getPropertyDefinition({ definitions }),
    )

    const properties = Object.fromEntries(modelPropertyDefinitionsMap)

    return {
        ...initialJSON,
        properties,
    }
}
