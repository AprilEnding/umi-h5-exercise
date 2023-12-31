import {
  SetStateAction,
  useRef,
} from 'react'
import { useMemoizedFn, useUpdate } from 'ahooks'

type Options<T> = {
  value?: T
  defaultValue: T
  onChange?: (v: T) => void
}

export function usePropsValue<T>(options: Options<T>) {
  const { value, defaultValue, onChange } = options

  const update = useUpdate()

  const stateRef = useRef<T>(value !== undefined ? value : defaultValue)
  if (value !== undefined) {
    // 初始化 更新 即使setstate 给了一个新值 如果value 没变 返回的还是value
    // 如果 props value 更新为undefined 返回的还是上一个值
    stateRef.current = value
  }

  const setState = useMemoizedFn(
    (v: SetStateAction<T>, forceTrigger: boolean = false) => {
      // `forceTrigger` means trigger `onChange` even if `v` is the same as `stateRef.current`
      const nextValue =
        typeof v === 'function'
          ? (v as (prevState: T) => T)(stateRef.current)
          : v
      if (!forceTrigger && nextValue === stateRef.current) return
      // 设置新值
      stateRef.current = nextValue
      // 触发更新
      update()
      return onChange?.(nextValue)
    }
  )
  return [stateRef.current, setState] as const
}

export function getValueType(val: any) {
  return toString.call(val).replace(/(^\[object )|(\]$)/g, '')
}


/**
 * todo
 * 支持更多类型？？,使用toValue???
 */

export function isEmpty(val: any): boolean {
  // undefined null
  // number string boolear function object
  switch (typeof val) {
    case 'undefined': {
      return true
    }
    case 'number': {
      // NaN
      return Number.isNaN(val)
    }
    case 'string': {
      return !val
    }
    case 'object': {
      const objType = getValueType(val)
      if (objType === 'Array') {
        if (val.length <= 0) {
          return true
        } else {
          return val.findIndex((item: any) => !isEmpty(item)) < 0
        }
      }
      if (objType === 'Object') {
        const keys = Object.keys(val)
        if (keys.length > 0) {
          return keys.findIndex((item: string) => !isEmpty(val[item])) < 0
        }
        return true
      }
      if (objType === 'Null') {
        return true
      }
      return false
    }
    case 'boolean':
    case 'function':
    case 'symbol':
    case 'bigint': {
      return false
    }
  }
}
