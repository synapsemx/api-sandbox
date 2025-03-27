declare module '@ember-data/serializer/rest' {
  import Model from '@ember-data/model';
  import JSONSerializer, { Transform } from '@ember-data/serializer';
  import Snapshot from '@ember-data/serializer/-private/snapshot';
  import Store from '@ember-data/store';
  import type { RelationshipSchema } from '@ember-data/store/-private';
  import { EmbeddedRecordsMixin } from './-private/embedded-records-mixin';

  export class RESTSerializer extends JSONSerializer {
    static primaryKey: string;
    static mergedProperties: Object;

    applyTransforms(typeClass: Model, data: Object): Object;
    normalizeResponse(
      store: Store,
      primaryModelClass: Model,
      payload: Object,
      id: string | number,
      requestType: string,
      ...args: any[]
    ): Object;

    normalizeFindRecordResponse(
      store: Store,
      primaryModelClass: Model,
      payload: Object,
      id: string | number,
      requestType: string,
      ...args: any[]
    ): Object;

    normalizeQueryRecordResponse(
      store: Store,
      primaryModelClass: Model,
      payload: Object,
      id: string | number,
      requestType: string,
      ...args: any[]
    ): Object;

    normalizeFindAllResponse(
      store: Store,
      primaryModelClass: Model,
      payload: Object,
      id: string | number,
      requestType: string,
      ...args: any[]
    ): Object;

    normalizeFindBelongsToResponse(
      store: Store,
      primaryModelClass: Model,
      payload: Object,
      id: string | number,
      requestType: string,
      ...args: any[]
    ): Object;

    normalizeFindHasManyResponse(
      store: Store,
      primaryModelClass: Model,
      payload: Object,
      id: string | number,
      requestType: string,
      ...args: any[]
    ): Object;

    normalizeFindManyResponse(
      store: Store,
      primaryModelClass: Model,
      payload: Object,
      id: string | number,
      requestType: string,
      ...args: any[]
    ): Object;

    normalizeQueryResponse(
      store: Store,
      primaryModelClass: Model,
      payload: Object,
      id: string | number,
      requestType: string,
      ...args: any[]
    ): Object;

    normalizeCreateRecordResponse(
      store: Store,
      primaryModelClass: Model,
      payload: Object,
      id: string | number,
      requestType: string,
      ...args: any[]
    ): Object;

    normalizeDeleteRecordResponse(
      store: Store,
      primaryModelClass: Model,
      payload: Object,
      id: string | number,
      requestType: string,
      ...args: any[]
    ): Object;

    normalizeUpdateRecordResponse(
      store: Store,
      primaryModelClass: Model,
      payload: Object,
      id: string | number,
      requestType: string,
      ...args: any[]
    ): Object;

    normalizeSaveResponse(
      store: Store,
      primaryModelClass: Model,
      payload: Object,
      id: string | number,
      requestType: string,
      ...args: any[]
    ): Object;

    normalizeSingleResponse(
      store: Store,
      primaryModelClass: Model,
      payload: Object,
      id: string | number,
      requestType: string,
    ): Object;

    normalizeArrayResponse(
      store: Store,
      primaryModelClass: Model,
      payload: Object,
      id: string | number,
      requestType: string,
    ): Object;

    _normalizeResponse(
      store: Store,
      primaryModelClass: Model,
      payload: Object,
      id: string | number,
      requestType: string,
      isSingle: boolean,
    ): Object;

    normalize(modelClass: any, resourceHash: any, prop: string): Object;

    extractId(modelClass: Object, resourceHash: Object): string;
    extractAttributes(modelClass: Object, resourceHash: Object): Object;
    extractRelationship(
      relationshipModelName: Object,
      relationshipHash: Object,
    ): Object;
    extractPolymorphicRelationship(
      relationshipModelName: Object,
      relationshipHash: Object,
      relationshipOptions: Object,
      ...args: any[]
    ): Object;

    extractRelationships(modelClass: Object, resourceHash: Object): Object;
    normalizeRelationships(typeClass: any, hash: any): void;
    normalizeUsingDeclaredMapping(modelClass: any, hash: any): void;

    _getMappedKey(key: string, modelClass: any): string;
    _canSerialize(key: string): boolean;
    _mustSerialize(key: string): boolean;

    shouldSerializeHasMany(
      snapshot: Snapshot,
      key: string,
      relationship: RelationshipSchema,
    ): boolean;

    serialize(snapshot: Snapshot, options: Object, ...args: any[]): Object;
    serializeIntoHash(
      hash: Object,
      typeClass: Model,
      snapshot: Snapshot,
      options: Object,
    ): void;
    serializeAttribute(
      snapshot: Snapshot,
      json: Object,
      key: string,
      attribute: Object,
    ): void;
    serializeBelongsTo(
      snapshot: Snapshot,
      json: Object,
      relationship: Object,
    ): void;
    serializeHasMany(
      snapshot: Snapshot,
      json: Object,
      relationship: Object,
    ): void;
    serializePolymorphicType(
      snapshot: Snapshot,
      json: Object,
      relationship: Object,
    ): void;

    extractMeta(store: Store, modelClass: Model, payload: Object): any;
    extractErrors(
      store: Store,
      typeClass: Model,
      payload: Object,
      id: string | number,
    ): Object;

    keyForAttribute(key: string, method: string): string;
    keyForRelationship(key: string, typeClass: string, method: string): string;
    keyForLink(key: string, kind: string): string;
    keyForPolymorphicType(
      key: string,
      typeClass: string,
      method: string,
    ): string;

    transformFor(attributeType: string, skipAssertion: boolean): Transform;

    _normalizeArray(
      store: Store,
      modelName: string,
      arrayHash: Object,
      prop: string,
    ): Object;
    _normalizePolymorphicRecord(
      store: any,
      hash: any,
      prop: any,
      primaryModelClass: any,
      primarySerializer: any,
    ): any;

    isPrimaryType(store: any, modelName: any, primaryModelClass: any): boolean;

    pushPayload(store: Store, payload: Object): void;

    modelNameFromPayloadKey(key: string): string;
    payloadKeyFromModelName(modelName: string): string;
  }

  export { EmbeddedRecordsMixin };
  export default RESTSerializer;
}
