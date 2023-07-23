import React, {
  isValidElement,
  cloneElement,
  ComponentProps,
  createElement,
  useRef,
  useEffect,
  ReactElement,
  ReactNode,
} from 'react'
import { Dropdown, DropdownProps } from 'antd-mobile'
import FilterItem from './filter-item'
import FilterSelector from './filter-selector'
import { FiltersValueContext } from './context'
import useFiltersValue from './hooks/useFiltersValue'

interface IFiltersDropdownProps extends DropdownProps {
  children: React.ReactNode
  value?: any
  defaultValue?: any
  onChange?: (v: any) => void
}

export default function FiltersDropdown(props: IFiltersDropdownProps) {
  const {value: propsValue, onChange, defaultValue} = props
  const filterValue = useFiltersValue({
    value: propsValue,
    onChange,
    defaultValue,
  })

  const { 
    setActiveKey, 
    value, 
    setValueByKey, 
    subscripValuesByKeys,
    activeKey,
  } = filterValue
  const itemNamesRef = useRef<string[]>([])

  console.log('value', value)
  const getItems = () => {
    const itemNames: string[] = []
    const result: (ReactElement | ReactNode)[] = []
    // map 会向key添加前缀 .$
    React.Children.forEach(props.children, (child) => {
      if (isValidElement<ComponentProps<typeof FilterItem>>(child)) {
        const name = child.props.name
        itemNames.push(name)
        const childProps = {
          ...child.props,
          key: child.key as any,
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
              },
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
  
  useEffect(() => {
    subscripValuesByKeys(itemNamesRef.current)
  }, [props.children])

  return (
    <FiltersValueContext.Provider value={filterValue}>
      <Dropdown 
        onChange={setActiveKey}
      >
        {getItems()}
      </Dropdown>
    </FiltersValueContext.Provider>
  )
}

FiltersDropdown.Item = FilterItem
