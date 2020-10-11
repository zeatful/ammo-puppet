import {DefaultCrudRepository} from '@loopback/repository';
import {Ammo, AmmoRelations} from '../models';
import {DbDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class AmmoRepository extends DefaultCrudRepository<
  Ammo,
  typeof Ammo.prototype.id,
  AmmoRelations
> {
  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
  ) {
    super(Ammo, dataSource);
  }
}
