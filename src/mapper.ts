import {
  transformArray,
  transformObject,
  inverseTransformation,
} from './transformer'

export class Mapper<E, M> {
  transformationMap: Record<string, string> = {}

  constructor(transformationMap: Record<string, string>) {
    this.transformationMap = transformationMap
  }

  /**
   * Transform entity to model
   *
   * @param entity
   * @returns
   */
  toModel(entity: E): M {
    return transformObject<E, M>(entity, this.transformationMap)
  }

  /**
   * Transform entity array to model array
   *
   * @param entities
   * @returns
   */
  toArrayModel(entities: E[]): M[] {
    return transformArray<E, M>(entities, this.transformationMap)
  }

  /**
   * Transform entity to model
   *
   * @param model
   * @returns
   */
  toEntity(model: M): E {
    return transformObject<M, E>(
      model,
      inverseTransformation(this.transformationMap),
    )
  }

  /**
   * Transform entity array to model array
   * @param models
   * @returns
   */
  toEntityArray(models: M[]): E[] {
    return transformArray<M, E>(
      models,
      inverseTransformation(this.transformationMap),
    )
  }
}

type FlattenKeys<T> = {
  [K in keyof T]-?: T[K] extends object
    ? `${K & string}.${FlattenKeys<T[K]>}`
    : K & string
}[keyof T]

export type TransformationMap<S, D> = {
  [K in FlattenKeys<S>]: FlattenKeys<D>
}
