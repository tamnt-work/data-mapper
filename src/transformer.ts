/**
 * Tranform entity object to model object
 *
 * @param sourceObj
 * @param transformation
 * @returns
 */
export function transformObject<TSource, TResult>(
  sourceObj: TSource,
  transformation: Record<string, string>,
): TResult {
  const result: any = {}

  for (const [outputKey, inputKey] of Object.entries(transformation)) {
    let value: any = sourceObj
    const keys: string[] = inputKey.split('.')

    for (const key of keys) {
      value = value[key]
      if (value === undefined) break // Break if any intermediate key is undefined
    }

    // Split output key into nested keys if necessary
    const nestedKeys: string[] = outputKey.split('.')
    let target: any = result

    for (let i = 0; i < nestedKeys.length - 1; i++) {
      const nestedKey: string = nestedKeys[i]

      if (!target[nestedKey]) target[nestedKey] = {}
      target = target[nestedKey]
    }

    // Assign value to the last nested key or directly to output key
    const lastKey: string = nestedKeys[nestedKeys.length - 1]

    target[lastKey] = value !== undefined ? value : ''
  }

  return result as TResult
}

/**
 * Transform entity array to model array
 *
 * @param sourceArray
 * @param transformation
 * @returns
 */
export function transformArray<TSource, TResult>(
  sourceArray: TSource[],
  transformation: Record<string, string>,
): TResult[] {
  return sourceArray.map((sourceObj) =>
    transformObject<TSource, TResult>(sourceObj, transformation),
  )
}

/**
 * Inverse transformation
 *
 * @param transformation
 * @returns
 */
export function inverseTransformation(
  transformationMap: Record<string, string>,
): Record<string, string> {
  const inverseMap: Record<string, string> = {}

  for (const [key, value] of Object.entries(transformationMap)) {
    inverseMap[value] = key
  }

  return inverseMap
}

export const Transformer = {
  transformObject,
  transformArray,
  inverseTransformation,
}
