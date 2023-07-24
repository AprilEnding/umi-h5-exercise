import React, { useMemo, useCallback } from 'react'
import { Selector, SelectorProps, Input } from 'antd-mobile'
import './index.less'

export type OptionsValue = [number, number]
export type Value = {
  selectorValue: OptionsValue[],
  inputValue: OptionsValue,
}

export type Option = {
  value: OptionsValue,
  label: string,
}

export type IRangeSelectorProps = {
  options: Option[]
  value?: Value
  defaultValue?: Value[]
  onChange?: (v: Value[], extend: Option) => void
} & SelectorProps<any>

const clsPrefix = 'range-selector'

export default function RangeSelector(props: IRangeSelectorProps) {

  const {
    options: propsOptions,
    onChange: propsOnChange,
    defaultValue,
    value: propsValue,
    ...reProps
  } = props

  const options = useMemo(() => {
    return propsOptions && propsOptions.map(({ value, label }) => {
      return { label, value: value.join(',') }
    })
  }, [propsOptions])

  const value = useMemo(() => {
    return propsValue?.selectorValue?.map((item) => item.join(','))
  }, [propsValue])

  const handleChange = useCallback((v: string[], extend) => {
    const realV = v && v.map(item => item.split(',').map(strV => Number(strV)))
    propsOnChange?.(realV, extend)
  }, [propsOnChange])

  return (
    <div className={clsPrefix}>
      <Selector 
        {...reProps} 
        options={options} 
        onChange={handleChange} 
        value={value} 
      />
      <div className={`${clsPrefix}-input`}>
        <div>
          <Input type="number"></Input>
        </div>
        <div className="gap">-</div>
        <div>
          <Input type="number"></Input>
        </div>
        <div className="suffix">
          元
        </div>
      </div>
    </div>
  )
}