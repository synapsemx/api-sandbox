import type { Snapshot } from '@ember-data/legacy-compat/-private';
import {
  camelize,
  pluralize,
  singularize,
  underscore,
} from '@ember-data/request-utils/string';
import RESTSerializer from '@ember-data/serializer/rest';
import { isEmpty } from '@ember/utils';
import type { ExistingResourceObject } from '@warp-drive/core-types/spec/json-api-raw';
import type Model from 'ember-data/model';
import type Store from 'ember-data/store';
import serializeResource from 'ui/utils/store/serialize-resource';

export interface GeneralAPIResponse {
  data: Record<string, unknown>[];
  skip: number;
  limit: number;
  total: number;
  relations?: Record<string, unknown>;
}

export interface SerializeResourceResponse {
  data: ExistingResourceObject[];
}

export default class ApplicationSerializer extends RESTSerializer {
  keyForAttribute(key: string): string {
    return underscore(key);
  }

  keyForRelationship(key: string, typeClass: string): string {
    if (typeClass === 'belongsTo') {
      return underscore(key) + '_id';
    }

    return underscore(key);
  }

  serializeIntoHash(
    hash: Record<string, unknown>,
    typeClass: Model,
    snapshot: Snapshot,
    options: Object,
  ): void {
    const data = this.serialize(snapshot, options);

    for (const key in data) {
      hash[key] = data[key as keyof typeof data];
    }
  }

  normalizeResponse(
    store: Store,
    primaryModelClass: Model,
    payload: GeneralAPIResponse,
    id: string | number,
    requestType: string,
    ...args: unknown[]
  ): SerializeResourceResponse {
    if (!('modelName' in primaryModelClass)) {
      throw new Error('Primary model class must have a modelName.');
    }

    const requestTypesThatReturnLists = ['query', 'findAll', 'findHasMany'];
    const singularModelName = primaryModelClass.modelName;
    const pluralizedModelName = pluralize(singularModelName as string);
    const shouldNormalizeAsList =
      requestTypesThatReturnLists.includes(requestType) && payload.data;

    const normalizedPayload = shouldNormalizeAsList
      ? this.normalizePayloadAsListPayload(pluralizedModelName, payload)
      : this.normalizePayloadAsIndividualPayload(pluralizedModelName, payload);

    if (payload.relations) {
      this.pushRelationships(store, payload.relations);

      delete payload.relations;
    }

    return super.normalizeResponse(
      store,
      primaryModelClass,
      normalizedPayload,
      id,
      requestType,
    ) as SerializeResourceResponse;
  }

  private normalizePayloadAsListPayload(
    modelName: string,
    payload: GeneralAPIResponse,
  ) {
    return {
      [modelName]: payload.data.map((resource) =>
        this.normalizeResource(resource),
      ),
      meta: this.transformOffsetBasedPaginationToPageBased(payload),
    };
  }

  private normalizePayloadAsIndividualPayload(
    modelName: string,
    payload: GeneralAPIResponse,
  ) {
    return {
      [modelName]: this.normalizeResource(
        payload as unknown as Record<string, unknown>,
      ),
    };
  }

  private normalizeResource(resource: Record<string, unknown>) {
    return this.camelizeRelationshipLinks(resource);
  }

  private camelizeRelationshipLinks(resource: Record<string, unknown>) {
    if (!resource['links']) return resource;

    resource['link'] = this.camelizeObjectKeys(
      resource['links'] as Record<string, unknown>,
    );

    return resource;
  }

  private camelizeObjectKeys(object: Record<string, unknown>) {
    return Object.entries(object).reduce(
      (normalized, [key, value]) => ({
        ...normalized,
        [camelize(key)]: value,
      }),
      {},
    );
  }

  private transformOffsetBasedPaginationToPageBased(
    payload: GeneralAPIResponse,
  ) {
    if (
      isEmpty(payload.skip) ||
      isEmpty(payload.limit) ||
      isEmpty(payload.total)
    ) {
      throw new Error('Payload must include skip, limit, and total.');
    }

    const { skip, limit, total } = payload;

    return { skip, limit, count: total };
  }

  private pushRelationships(store: Store, relations: Record<string, unknown>) {
    for (const [relationKey, data] of Object.entries(relations)) {
      const modelName = singularize(relationKey).replaceAll('_', '-');
      const serialized = serializeResource({
        store,
        modelName,
        payload: data as GeneralAPIResponse,
        isList: true,
      });

      store.push({ data: serialized.data });
    }
  }
}
