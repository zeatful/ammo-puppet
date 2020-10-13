import {Entity, model, property} from '@loopback/repository';

@model()
export class Primer extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: false,
    required: true,
  })
  id: string

  @property({
    type: 'boolean',
    required: true,
  })
  availability: boolean

  @property({
    type: 'string',
    required: true,
  })
  count: string

  @property({
    type: 'string',
    required: true,
  })
  price: string

  @property({
    type: 'string',
    required: true,
  })
  url: string

  @property({
    type: 'string',
    required: true,
  })
  found: string

  @property({
    type: 'string',
    required: true,
  })
  model: string

  @property({
    type: 'string',
    required: true,
  })
  size: string

  @property({
    type: 'string',
    required: true,
  })
  description: string

  constructor(data?: Partial<Primer>) {
    super(data)
  }
}

export interface PrimerRelations {
  // describe navigational properties here
}

export type PrimerWithRelations = Primer & PrimerRelations