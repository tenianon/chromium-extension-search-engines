import { useState } from 'react'

type SetStateAction<T> = T | ((prevState: T) => T)
type SetValueCallback<T> = (
  newValue: SetStateAction<T>,
  callback?: (value: T) => void,
) => Promise<T>

/**
 * Callback or Then
 * @param initialValue 
 * @returns 
 */
export const useStateCallback = <T>(
  initialValue: T | (() => T),
): [T, SetValueCallback<T>] => {
  const [value, setValue] = useState<T>(initialValue)

  const setValueCallback: SetValueCallback<T> = async (newValue, callback) => {
    const result = await new Promise<T>((resolve) => {
      setValue((prev) => {
        const updatedValue =
          typeof newValue === 'function'
            ? (newValue as (prevState: T) => T)(prev)
            : newValue
        resolve(updatedValue)
        return updatedValue
      })
    })

    callback?.(result)
    return result
  }

  return [value, setValueCallback]
}
