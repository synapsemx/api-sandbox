import { HookContext } from "@feathersjs/feathers"
import { RelationshipDefinition } from "./relationships"

type RelationshipHandler = (
    context: HookContext,
    resources: Record<string, unknown>[],
    currentRelations: Record<string, unknown[]>,
    relationName: string,
    relationDefinition: RelationshipDefinition,
    relationKey: string
) => Promise<{
    updatedResources: Record<string, unknown>[]
    updatedRelations: Record<string, unknown[]>
}>