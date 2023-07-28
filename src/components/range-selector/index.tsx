import React, { useMemo, useCallback, useRef } from 'react'
import { Selector, SelectorProps, Input, SelectorOption } from 'antd-mobile'
import { usePropsValue } from 'antd-mobile/es/utils/use-props-value'
import './index.less'

export type OptionsValue = [number, number]
export type Value = {
  selectorValue?: OptionsValue[],
  inputValue?: OptionsValue,
}

export type Option = {
  value: OptionsValue,
  label: string,
}

export type Extend = { items: SelectorOption<any>[] }

export type IRangeSelectorProps = {
  options: Option[]
  value?: Value
  defaultValue?: Value
  onChange?: (v: Value, extend: Extend) => void
  inputSuffix?: string
} & SelectorProps<any>

const clsPrefix = 'range-selector'

// todo: input number 一些浏览器不支持

export default function RangeSelector(props: IRangeSelectorProps) {

  const {
    options: propsOptions,
    onChange: propsOnChange,
    defaultValue,
    value: propsValue,
    inputSuffix,
    ...reProps
  } = props

  const extendRef = useRef({} as Extend)

  const options = useMemo(() => {
    return propsOptions && propsOptions.map(({ value, label }) => {
      return { label, value: value.join(',') }
    })
  }, [propsOptions])

  const [value, setValue] = usePropsValue({
    value: propsValue,
    defaultValue: defaultValue,
    onChange: (v) => {
      propsOnChange?.(v as any, extendRef.current)
    }
  })

  const selectorTransformValue = useMemo(() => {
    return value?.selectorValue ? value.selectorValue?.map(item => item.join(',')) : []
  }, [value?.selectorValue])

  const inputTransformValue = useMemo(() => {
    return value?.inputValue
      ? value.inputValue?.map(
        (item) => {
          if (typeof item !== 'number' || item === Infinity || item === -Infinity) {
            return ''
          } else {
            return String(item)
          }
        }
      )
      : ['', '']
  }, [value?.inputValue])

  const handleSelectorChange = useCallback((v: string[], extend) => {
    const realV = v && v.map(item => item.split(',').map(strV => Number(strV))) as OptionsValue[]
    propsOnChange?.(realV, extend)
    extendRef.current = extend
    setValue((prev: any) => {
      if (prev) {
        return {
          ...prev,
          selectorValue: realV
        }
      } else {
        return {
          selectorValue: realV
        }
      }
    })
  }, [propsOnChange])

  const handleInputChange = useCallback((v, type: 'min' | 'max') => {
    const str2num = type === 'min' ?
      (v ? Number(v) : -Infinity) :
      (v ? Number(v) : Infinity)
    setValue((prev: any) => {
      let prevInputVal = prev?.inputValue ? [...prev.inputValue] : [-Infinity, Infinity]
      type === 'min' ? (prevInputVal[0] = str2num) : (prevInputVal[1] = str2num)
      let rePrevInputVal = prevInputVal[0] === -Infinity && prevInputVal[1] === Infinity ? undefined : prevInputVal
      if (prev) {
        return {
          ...prev,
          inputValue: rePrevInputVal
        }
      } else {
        return {
          inputValue: rePrevInputVal
        }
      }
    })
  }, [propsOnChange])

  return (
    <div className={clsPrefix}>
      <Selector
        {...reProps}
        options={options}
        onChange={handleSelectorChange}
        value={selectorTransformValue}
      />
      <div className={`${clsPrefix}-input`}>
        <div>
          <Input type="number" value={inputTransformValue[0]} onChange={(v) => handleInputChange(v, 'min')} />
        </div>
        <div className="gap">-</div>
        <div>
          <Input type="number" value={inputTransformValue[1]} onChange={(v) => handleInputChange(v, 'max')} />
        </div>
        <div className="suffix">
          {inputSuffix}
        </div>
      </div>
    </div>
  )
}