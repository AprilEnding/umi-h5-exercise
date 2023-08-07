import React, {
  isValidElement,
  cloneElement,
  ComponentProps,
  createElement,
  useRef,
  forwardRef,
  ReactElement,
  ReactNode,
  useImperativeHandle,
} from 'react'
import { Dropdown, DropdownProps, DropdownRef } from 'antd-mobile'
import FilterItem from './filter-item'
import FilterSelector from './filter-selector'
import { FiltersValueContext } from './context'
import useFiltersValue from './hooks/useFiltersValue'
import classnames from 'classnames'

interface IFiltersDropdownProps extends DropdownProps {
  children: React.ReactNode
  value?: any
  defaultValue?: any
  onChange?: (v: any) => void
  // 指定item高亮 需要配合autoHighLight: false 使用
  // 如果优先级低于item的highlight
  highlightKeys?: string[]
  // 是否自动处理item高亮 默认自动处理
  autoHighLight?: boolean
}

export type FiltersDropdownRef = {
  resetValue: (keys?: string[]) => void
} & DropdownRef

const ForwardRefFiltersDropdown = forwardRef<
  FiltersDropdownRef,
  IFiltersDropdownProps
>(
  (props, ref) => {
    const {
      value: propsValue,
      onChange,
      defaultValue,
      autoHighLight = true,
      highlightKeys: propsHighlightKeys,
    } = props

    const itemNamesRef = useRef<string[]>([])
    const dropdownRef = useRef<DropdownRef>(null)

    const filterValue = useFiltersValue({
      value: propsValue,
      onChange,
      defaultValue,
      autoHighLight,
      propsHighlightKeys
    })

    const {
      setActiveKey,
      value,
      setValueByKey,
      // subscripValuesByKeys,
      activeKey,
      highlightKeys,
      resetValue,
    } = filterValue


    useImperativeHandle(ref, () => {
      return {
        close: () => {
          dropdownRef.current?.close()
        },
        resetValue: resetValue
      }
    }, [dropdownRef])

    const getItems = () => {
      const itemNames: string[] = []
      const result: (ReactElement | ReactNode)[] = []
      // map 会向key添加前缀 .$
      React.Children.forEach(props.children, (child) => {
        if (isValidElement<ComponentProps<typeof FilterItem>>(child)) {
          const name = child.key as string
          const highlight = highlightKeys?.includes(child.key + '') || child.key === activeKey
          itemNames.push(name)

          const childProps = {
            highlight: highlight,
            ...child.props,
            children: createElement(
              'div',
              {
                className: classnames('filter-dropdown-content', child.props.contentClassName),
                children: createElement(
                  FilterSelector,
                  {
                    children: child.props.children as React.ReactElement,
                    name: name,
                    title: child.props.title,
                    value: value && value[name],
                    active: activeKey === child.key,
                    onConfirm: (value) => {
                      setValueByKey(name, value)
                      dropdownRef.current?.close()
                    },
                    onReset: () => {
                      resetValue([name])
                      dropdownRef.current?.close()
                    }
                  }
                )
              }
            )
          }
          result.push(cloneElement(child, childProps))
        } else {
          result.push(child)
        }
      })
      itemNamesRef.current = itemNames
      return result
    }

    // 不去订阅 会频繁触发修改state 执行onChange
    // useEffect(() => {
    //   subscripValuesByKeys(itemNamesRef.current)
    // }, [props.children])

    return (
      <FiltersValueContext.Provider value={filterValue}>
        <Dropdown
          onChange={setActiveKey}
          ref={dropdownRef}
        >
          {getItems()}
        </Dropdown>
      </FiltersValueContext.Provider>
    )
  }
)

const FiltersDropdown = ForwardRefFiltersDropdown as (typeof ForwardRefFiltersDropdown & {Item: typeof FilterItem})
FiltersDropdown.Item = FilterItem

export default FiltersDropdown