import React from 'react'
import { Dropdown, DropdownItemProps } from 'antd-mobile'
import './filter-item.less'

interface IFilterItemProps extends DropdownItemProps {

}

export default function FilterItem(props: IFilterItemProps) {
  const {children, ...reProps} = props
  return (
    <Dropdown.Item {...reProps} />
  )
}