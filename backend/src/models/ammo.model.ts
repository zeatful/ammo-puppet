import {Entity, model, property} from '@loopback/repository';

@model()
export class Ammo extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: false,
    required: true,
  })
  id: string;

  @property({
    type: 'string',
    required: true,
  })
  caliber: string;

  @property({
    type: 'string',
    required: true,
  })
  grain: string;

  @property({
    type: 'boolean',
    required: true,
  })
  availability: boolean;

  @property({
    type: 'string',
    required: true,
  })
  count: string;

  @property({
    type: 'string',
    required: true,
  })
  price: string;

  @property({
    type: 'string',
    required: true,
  })
  url: string;

  @property({
    type: 'string',
    required: true,
  })
  model: string;

  @property({
    type: 'string',
    required: true,
  })
  found: string;

  constructor(data?: Partial<Ammo>) {
    super(data);
  }
}

export interface AmmoRelations {
  // describe navigational properties here
}

export type AmmoWithRelations = Ammo & AmmoRelations;
