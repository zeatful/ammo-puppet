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

import { Primer } from '../models';
import { PrimerRepository } from '../repositories';
import { PrimerService } from '../services';

export class PrimerController {
  constructor(
    @repository(PrimerRepository)
    public primerRepository : PrimerRepository,
    @inject('services.PrimerService')
    protected primerService: PrimerService,
  ) {}

  @post('/primer/add', {
    responses: {
      '200': {
        description: 'Primer model instance',
        content: {'application/json': {schema: getModelSchemaRef(Primer)}},
      },
    },
  })
  async add(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Primer, {
            title: 'NewPrimer',
            
          }),
        },
      },
    })
    primer: Primer,
  ): Promise<Primer> {
    return this.primerService.add(primer);
  }

  @post('/primer', {
    responses: {
      '200': {
        description: 'Primer model instance',
        content: {'application/json': {schema: getModelSchemaRef(Primer)}},
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Primer, {
            title: 'NewPrimer',
            
          }),
        },
      },
    })
    primer: Primer,
  ): Promise<Primer> {
    return this.primerRepository.create(primer);
  }

  @get('/primer/count', {
    responses: {
      '200': {
        description: 'Primer model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.where(Primer) where?: Where<Primer>,
  ): Promise<Count> {
    return this.primerRepository.count(where);
  }

  @get('/primer', {
    responses: {
      '200': {
        description: 'Array of Primer model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(Primer, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  async find(
    @param.filter(Primer) filter?: Filter<Primer>,
  ): Promise<Primer[]> {
    return this.primerRepository.find(filter);
  }

  @patch('/primer', {
    responses: {
      '200': {
        description: 'Primer PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Primer, {partial: true}),
        },
      },
    })
    primer: Primer,
    @param.where(Primer) where?: Where<Primer>,
  ): Promise<Count> {
    return this.primerRepository.updateAll(primer, where);
  }

  @get('/primer/{id}', {
    responses: {
      '200': {
        description: 'Primer model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Primer, {includeRelations: true}),
          },
        },
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Primer, {exclude: 'where'}) filter?: FilterExcludingWhere<Primer>
  ): Promise<Primer> {
    return this.primerRepository.findById(id, filter);
  }

  @patch('/primer/{id}', {
    responses: {
      '204': {
        description: 'Primer PATCH success',
      },
    },
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Primer, {partial: true}),
        },
      },
    })
    primer: Primer,
  ): Promise<void> {
    await this.primerRepository.updateById(id, primer);
  }

  @put('/primer/{id}', {
    responses: {
      '204': {
        description: 'Primer PUT success',
      },
    },
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() primer: Primer,
  ): Promise<void> {
    await this.primerRepository.replaceById(id, primer);
  }

  @del('/primer/{id}', {
    responses: {
      '204': {
        description: 'Primer DELETE success',
      },
    },
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.primerRepository.deleteById(id);
  }
}
