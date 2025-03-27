import type { MixtBuildURLMixin } from '@ember-data/adapter/-private/build-url-mixin';
import RESTAdapter from '@ember-data/adapter/rest';
import type { AdapterPayload } from '@ember-data/legacy-compat/legacy-network-handler/minimum-adapter-interface';
import {
  dasherize,
  pluralize,
  underscore,
} from '@ember-data/request-utils/string';
import type { Store } from '@ember-data/store/-private/store-service';
import type { ModelSchema } from '@ember-data/store/-types/q/ds-model';

const propertiesToNotCamelize = ['$joinRelation', '$whereRelation'];

export default class ApplicationAdapter extends RESTAdapter {
  pathForType(this: MixtBuildURLMixin, modelName: string): string {
    return dasherize(pluralize(modelName));
  }

  private transformQueryParams(
    query: Record<string, unknown>,
  ): Record<string, unknown> {
    const result: Record<string, unknown> = {};

    for (const [key, value] of Object.entries(query)) {
      const isExcluded = propertiesToNotCamelize.includes(key);
      const transformedKey = isExcluded ? key : underscore(key);

      const isObject = typeof value === 'object' && value !== null;
      const isNotArray = !Array.isArray(value);
      const isPlainObject = isObject && isNotArray;

      if (!isPlainObject) {
        result[transformedKey] = value;

        continue;
      }

      result[transformedKey] = this.transformQueryParams(
        value as Record<string, unknown>,
      );
    }

    return result;
  }

  query(
    store: Store,
    type: ModelSchema,
    query: Record<string, unknown>,
  ): Promise<AdapterPayload> {
    const transformedQuery = this.transformQueryParams(query);

    return super.query(store, type, transformedQuery);
  }

  queryRecord(
    store: Store,
    type: ModelSchema,
    query: Record<string, unknown>,
    adapterOptions: Record<string, unknown>,
  ): Promise<AdapterPayload> {
    const transformedQuery = this.transformQueryParams(query);

    return super.queryRecord(store, type, transformedQuery, adapterOptions);
  }
}
