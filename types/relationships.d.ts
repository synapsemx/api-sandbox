export const relationshipTypes = {
  belongsTo: 'belongsTo',
  hasMany: 'hasMany',
  manyToMany: 'manyToMany',
  morphMany: 'morphMany',
  morphTo: 'morphTo'
} as const

type RelationshipType = (typeof relationshipTypes)[keyof typeof relationshipTypes]

type BaseRelationship = {
  type: RelationshipType
  service: string
  required?: boolean
  key?: string
}

type BelongsToRelationship = BaseRelationship & {
  type: typeof relationshipTypes.belongsTo
  foreignKey: string
}

type HasManyRelationship = BaseRelationship & {
  type: typeof relationshipTypes.hasMany
  foreignKey: string
}

type ManyToManyRelationship = BaseRelationship & {
  type: typeof relationshipTypes.manyToMany
  primaryKey: string
  relatedKey: string
  pivotService: string
}

type MorphManyRelationship = BaseRelationship & {
  type: typeof relationshipTypes.morphMany
  morphKey: string
  morphType: string
}

type MorphToRelationship = BaseRelationship & {
  type: typeof relationshipTypes.morphTo
  morphKey: string
  morphType: string
}

type RelationshipDefinition =
  | BelongsToRelationship
  | HasManyRelationship
  | ManyToManyRelationship
  | MorphManyRelationship
  | MorphToRelationship

type RelationshipsMap = Record<string, RelationshipDefinition>
