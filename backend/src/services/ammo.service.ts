
import {bind, BindingScope, inject} from '@loopback/core';
import {repository} from '@loopback/repository';

import {Ammo} from '../models';
import {AmmoRepository} from '../repositories';
import { NotificationService } from './notification.service';

@bind({scope: BindingScope.TRANSIENT})
export class AmmoService {
  constructor(/* Add @inject to inject parameters */
    @repository(AmmoRepository)
    public ammoRepository: AmmoRepository,
    @inject('services.NotificationService')
    protected notificationService: NotificationService,
  ) {}

  async add(ammo: Ammo): Promise<Ammo> {
    // check if entry already exists
    let exists = await this.ammoRepository.exists(ammo.id);

    // if it exists, get original
    if(exists) {
      console.log(ammo.id + ' => exists');
      let entry = await this.ammoRepository.findById(ammo.id);

      // if price or availability changed
      if ((entry.price !== ammo.price) || (entry.availability !== ammo.availability)) {
        // check if it just became available
        let nowAvailable = (!entry.availability && ammo.availability);
        if(nowAvailable) {
          this.notificationService.notifyAmmo(ammo);          
        }
      }

      // update entry
      this.ammoRepository.updateById(ammo.id, ammo);
      return ammo;
    } else {
      // create new entry
      let result =  await this.ammoRepository.create(ammo);
      
      if(result.availability) {
        this.notificationService.notifyAmmo(result);
      }
      
      return result;      
    }
  }
}