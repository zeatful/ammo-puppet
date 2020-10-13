import {DefaultCrudRepository} from '@loopback/repository'
import {Primer, PrimerRelations} from '../models'
import {DbDataSource} from '../datasources'
import {inject} from '@loopback/core'

export class PrimerRepository extends DefaultCrudRepository<
  Primer,
  typeof Primer.prototype.id,
  PrimerRelations
> {
  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
  ) {
    super(Primer, dataSource)
  }
}
