import { inject } from '@loopback/core';

import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';

import {
  post,
  param,
  get,
  getModelSchemaRef,
  patch,
  put,
  del,
  requestBody,
} from '@loopback/rest';

import { Ammo } from '../models';
import { AmmoRepository } from '../repositories';
import { AmmoService } from '../services';

export class AmmoController {
  constructor(
    @repository(AmmoRepository)
    public ammoRepository : AmmoRepository,
    @inject('services.AmmoService')
    protected ammoService: AmmoService,
  ) {}

  @post('/ammo/add', {
    responses: {
      '200': {
        description: 'Ammo model instance',
        content: {'application/json': {schema: getModelSchemaRef(Ammo)}},
      },
    },
  })
  async add(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Ammo, {
            title: 'NewAmmo',
            
          }),
        },
      },
    })
    ammo: Ammo,
  ): Promise<Ammo> {
    return this.ammoService.add(ammo);
  }

  @post('/ammo', {
    responses: {
      '200': {
        description: 'Ammo model instance',
        content: {'application/json': {schema: getModelSchemaRef(Ammo)}},
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Ammo, {
            title: 'NewAmmo',
            
          }),
        },
      },
    })
    ammo: Ammo,
  ): Promise<Ammo> {
    return this.ammoRepository.create(ammo);
  }

  @get('/ammo/count', {
    responses: {
      '200': {
        description: 'Ammo model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.where(Ammo) where?: Where<Ammo>,
  ): Promise<Count> {
    return this.ammoRepository.count(where);
  }

  @get('/ammo', {
    responses: {
      '200': {
        description: 'Array of Ammo model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(Ammo, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  async find(
    @param.filter(Ammo) filter?: Filter<Ammo>,
  ): Promise<Ammo[]> {
    return this.ammoRepository.find(filter);
  }

  @patch('/ammo', {
    responses: {
      '200': {
        description: 'Ammo PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Ammo, {partial: true}),
        },
      },
    })
    ammo: Ammo,
    @param.where(Ammo) where?: Where<Ammo>,
  ): Promise<Count> {
    return this.ammoRepository.updateAll(ammo, where);
  }

  @get('/ammo/{id}', {
    responses: {
      '200': {
        description: 'Ammo model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Ammo, {includeRelations: true}),
          },
        },
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Ammo, {exclude: 'where'}) filter?: FilterExcludingWhere<Ammo>
  ): Promise<Ammo> {
    return this.ammoRepository.findById(id, filter);
  }

  @patch('/ammo/{id}', {
    responses: {
      '204': {
        description: 'Ammo PATCH success',
      },
    },
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Ammo, {partial: true}),
        },
      },
    })
    ammo: Ammo,
  ): Promise<void> {
    await this.ammoRepository.updateById(id, ammo);
  }

  @put('/ammo/{id}', {
    responses: {
      '204': {
        description: 'Ammo PUT success',
      },
    },
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() ammo: Ammo,
  ): Promise<void> {
    await this.ammoRepository.replaceById(id, ammo);
  }

  @del('/ammo/{id}', {
    responses: {
      '204': {
        description: 'Ammo DELETE success',
      },
    },
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.ammoRepository.deleteById(id);
  }
}
