import type Store from '@ember-data/store';
import type { CreateRecordProperties } from '@ember-data/store/-private';
import Controller from '@ember/controller';
import { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import type { TypeFromInstance } from '@warp-drive/core-types/record';
import { task } from 'ember-concurrency';
import type Model from 'ember-data/model';

export default abstract class ResourceController<
  T extends Model,
> extends Controller {
  @service declare store: Store;

  @tracked resources: T[] = [];
  @tracked newResource: T | null = null;

  abstract modelType: TypeFromInstance<T>;

  relationshipToInclude: string[] = [];

  findResources = task({ drop: true }, async (): Promise<void> => {
    const resources = await this.store.query<T>(this.modelType, {
      $include: this.relationshipToInclude,
    });

    this.resources = [...resources];

    this.initializeResource();
  });

  createResource = task({ drop: true }, async (): Promise<void> => {
    if (!this.newResource) {
      return;
    }

    await this.newResource.save();

    this.findResources.perform();
  });

  initializeResource(): void {
    this.newResource = this.store.createRecord<T>(
      this.modelType,
      {} as CreateRecordProperties<T>,
    );
  }
}
