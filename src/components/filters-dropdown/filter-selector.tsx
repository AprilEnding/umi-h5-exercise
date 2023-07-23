import React, { useEffect, cloneElement, useState, useCallback } from 'react'
import { Button, Space } from 'antd-mobile'
import { usePropsValue } from './utils'
import './filter-selector.less'


/**
 * todo
 * 校验字节点 唯一
 */

const clsPrefix = 'filter-selector'

interface IFilterSelectorProps {
  children: React.ReactElement
  name: string
  title?: React.ReactNode
  trigger?: string
  value?: any
  defaultValue?: any
  onSelect?: (v: any, name?: string) => void
  onConfirm?: (v: any, name?: string) => void
  active?: boolean
  onReset?: () => void
  // 是否在页面显示 变化时会同步外部value 和 内部选中value
}

export default function FilterSelector({
  name,
  children,
  trigger = 'onChange',
  value: propsValue,
  defaultValue,
  onSelect,
  onConfirm,
  onReset,
  active
}: IFilterSelectorProps) {

  // 如果用这个 value 从 真值 改为 假值 无法 同步
  // const [value, setValue] = usePropsValue({
  //   value: propsValue,
  //   defaultValue: defaultValue,
  //   onChange: val => {
  //     onConfirm?.(val, name)
  //   },
  // })

  const [value, setValue] = useState()

  useEffect(() => {
    if (propsValue !== value) {
      setValue(propsValue)
    }
  }, [propsValue])

  const [innerValue, setInnerValue] = useState(value)
  const [childKeyMark, setChildKeyMark] = useState(0)

  // 解决input 组件 value 是 undefined的时候 无法取消临时选择的选项问题
  const updateChildKeyMark = useCallback(() => {
    setChildKeyMark((pre) => pre + 1)
  }, [setChildKeyMark])

  useEffect(() => {
    if (!active) {
      setInnerValue(value)
      if (value === undefined) {
        updateChildKeyMark()
      }
    }
  }, [value])

  useEffect(() => {
    if (innerValue !== value) {
      setInnerValue(value)
      if (value === undefined) {
        updateChildKeyMark()
      }
    }
  }, [active])

  const handleConfirm = () => {
    setValue(innerValue)
    onConfirm?.(innerValue)
  }

  const handleReset = () => {
    onReset?.()
  }

  return (
    <div className={clsPrefix}>
      <div className={`${clsPrefix}-main`}>
        {cloneElement(children, {
          ...children.props,
          value: innerValue,
          key: name + childKeyMark,
          [trigger]: (...arg: any[]) => {
            setInnerValue(arg[0])
            onSelect?.(arg[0], name)
            children.props[trigger]?.(...arg)
          }
        })}
      </div>
      <div className={`${clsPrefix}-footer`}>
        <Space justify="between" block>
          <Button color="primary"fill="outline" onClick={handleReset}>
            重置
          </Button>
          <Button color="primary" fill="solid" onClick={handleConfirm}>
            确认
          </Button>
        </Space>
      </div>
    </div>
  )
}