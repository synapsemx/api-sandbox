import Model from 'ember-data/model';
import type Store from 'ember-data/store';
import ApplicationSerializer, {
  type GeneralAPIResponse,
} from 'ui/serializers/application';

interface SerializeResourceSignature {
  store: Store;
  modelName: string;
  payload: GeneralAPIResponse;
  isList?: boolean;
}

export const getSerializerForModel = (
  store: Store,
  modelName: string,
): ApplicationSerializer => {
  const serializer = store.serializerFor(modelName);

  if (!(serializer instanceof ApplicationSerializer)) {
    throw new Error('Serializer must be an instance of AplpicationSerializer.');
  }

  return serializer;
};

const serializeResource = ({
  store,
  modelName,
  payload,
  isList = false,
}: SerializeResourceSignature) => {
  const type = isList ? 'query' : 'findRecord';
  const serializer = getSerializerForModel(store, modelName);
  const model = store.modelFor(modelName);

  return serializer.normalizeResponse(
    store,
    model as unknown as Model,
    payload,
    '',
    type,
  );
};

export default serializeResource;
