
import {bind, BindingScope, inject} from '@loopback/core'
import {repository} from '@loopback/repository'

import {Primer} from '../models'
import {PrimerRepository} from '../repositories'
import { NotificationService } from './notification.service'

@bind({scope: BindingScope.TRANSIENT})
export class PrimerService {
  constructor(/* Add @inject to inject parameters */
    @repository(PrimerRepository)
    public primerRepository: PrimerRepository,
    @inject('services.NotificationService')
    protected notificationService: NotificationService,
  ) {}

  async add(primer: Primer): Promise<Primer> {
    // check if entry already exists
    let exists = await this.primerRepository.exists(primer.id)

    // if it exists, get original
    if(exists) {
      console.log(primer.id + ' => exists');
      let entry = await this.primerRepository.findById(primer.id)

      // if price or availability changed
      if ((entry.price !== primer.price) || (entry.availability !== primer.availability)) {
        // check if it just became available
        let nowAvailable = (!entry.availability && primer.availability);
        if(nowAvailable) {
          this.notificationService.notifyPrimer(primer)
        }
      }

      // update entry
      this.primerRepository.updateById(primer.id, primer)
      return primer
    } else {
      // create new entry
      let result =  await this.primerRepository.create(primer)
      
      if(result.availability) {
        this.notificationService.notifyPrimer(result)
      }
      
      return result
    }
  }
}