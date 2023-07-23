import { useState, SetStateAction, useRef, useEffect, useCallback } from 'react'
import { usePropsValue, isEmpty } from './../utils'
import { useUpdate, useMemoizedFn } from 'ahooks'

type Options = {
  value: any
  defaultValue: any
  onChange?: (v: any) => void
  autoHighLight: boolean
  propsHighlightKeys?: string[]
}

function useHighLighttKeys({
  autoHighLight,
  propsHighlightKeys,
  value,
}: {
  autoHighLight: boolean
  propsHighlightKeys?: string[]
  value: { [key: string]: any }
}) {
  const stateRef = useRef<string[] | undefined>([])
  const update = useUpdate()

  if (!autoHighLight) {
    stateRef.current = propsHighlightKeys
  }

  const setState = useMemoizedFn(
    (v: SetStateAction<string[] | undefined>) => {
      const nextValue =
        typeof v === 'function'
          ? (v as (prevState: string[] | undefined) => string[])(stateRef.current)
          : v
      if (stateRef.current === nextValue) return
      stateRef.current = nextValue
      update()
    }
  )

  useEffect(() => {
    let highlightKeys: string[] = []
    if (!!value) {
      highlightKeys = []
      Object.keys(value).forEach(key => {
        if (!isEmpty(value[key])) {
          highlightKeys.push(key)
        }
      })
    }
    setState(highlightKeys)
  }, [value])

  return [stateRef.current, setState] as const
}

export default function useFiltersValue({
  value: propsValue,
  defaultValue,
  onChange,
  autoHighLight,
  propsHighlightKeys,
}: Options) {
  const [value, setValue] = usePropsValue<{ [key: string]: any }>({
    value: propsValue,
    defaultValue: defaultValue,
    onChange: (val) => onChange?.(val),
  })
  const [activeKey, setActiveKey] = useState<string | null>('')
  const [highlightKeys] = useHighLighttKeys({
    autoHighLight,
    propsHighlightKeys,
    value,
  })

  const setValueByKey = (key: string, value: any) => {
    setValue(preVal => ({ ...(preVal || {}), [key]: value }))
  }

  const resetValue = useCallback(
    (keys?: string[]) => {
      if (Array.isArray(keys)) {
        if (!!keys.length) {
          const reDefaultValues: {[key: string]: any} = {}
          keys.forEach(key => {
            reDefaultValues[key] = defaultValue ? defaultValue[key] : undefined
          })
          setValue((prev) => ({...prev, ...reDefaultValues}))
        }
      } else {
        setValue(defaultValue)
      }
    },
    [setValue, defaultValue]
  )

  const subscripValuesByKeys = (keys: string[]) => {
    const newValue: { [key: string]: any } = {}
    const newInnerValue: { [key: string]: any } = {}
    keys?.forEach(key => {
      newValue[key] = value ? value[key] : undefined
      newInnerValue[key] = value ? value[key] : undefined
    })
    setValue(newValue)
  }

  return {
    value,
    setValueByKey,
    setActiveKey,
    activeKey,
    subscripValuesByKeys,
    highlightKeys,
    resetValue,
  }
}