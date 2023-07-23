import { useState, useEffect } from 'react'
import { usePropsValue } from './../utils'

type Options = {
  value: any
  defaultValue: any
  onChange?: (v: any) => void
}

export default function useFiltersValue({
  value: propsValue, 
  defaultValue, 
  onChange,
}: Options) {
  const [value, setValue] = usePropsValue<{[key: string]: any}>({
    value: propsValue,
    defaultValue: defaultValue,
    onChange: (val) => onChange?.(val),
  })
  const [activeKey, setActiveKey] = useState<string | null>('')

  const setValueByKey = (key: string, value: any) => {
    console.log(key, value)
    setValue(preVal => ({...(preVal || {}), [key]: value}))
  }

  const subscripValuesByKeys = (keys: string[]) => {
    const newValue: {[key: string]: any} = {}
    const newInnerValue: {[key: string]: any} = {}
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
  }
}