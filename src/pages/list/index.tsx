import React, { useState, useEffect } from 'react'
import { useParams, history } from 'umi'
import { Tabs, Selector } from 'antd-mobile'
import FiltersDropdown from '@/components/filters-dropdown'

export const options = [
  {
    label: '选项一',
    value: '1',
  },
  {
    label: '选项二',
    value: '2',
  },
  {
    label: '选项三',
    value: '3',
  },
  {
    label: '选项四',
    value: '4',
  },
  {
    label: '选项五',
    value: '5',
  },
  {
    label: '选项六',
    value: '6',
  },
]

enum PageType {
  SELL = 'sell',
  RENT = 'rent',
}

export default function List() {
  const { type: pageType } = useParams() as { type: PageType }
  const isSellPage = pageType === PageType.SELL
  const [show, setShow] = useState(true)
  const [count, setCount] = useState(1)

  const handleChangePage = (key: string) => {
    history.replace('/list/' + key)
  }

  return (
    <div>
      <Tabs activeKey={pageType} onChange={handleChangePage}>
        <Tabs.Tab title='出售' key={PageType.SELL} />
        <Tabs.Tab title='出租' key={PageType.RENT} />
      </Tabs>
      <FiltersDropdown
        onChange={(val) => {
          console.log('value', val)
        }}
      >
        <FiltersDropdown.Item key="11" name="1" title="测试1">
          <Selector
            columns={3}
            options={options}
            multiple={true}
          />
        </FiltersDropdown.Item>
        <FiltersDropdown.Item key="22" name="2" title="测试2">
          <Selector
            columns={3}
            options={options}
          />
        </FiltersDropdown.Item>
        <FiltersDropdown.Item key="33" name="3" title="测试3">
          <div>
            测试3
          </div>
        </FiltersDropdown.Item>
        {show ? (
          <FiltersDropdown.Item key="44" name="4" title="测试4" highlight>
            <div>
              测试4
            </div>
          </FiltersDropdown.Item>
        ) : null}
      </FiltersDropdown>
      <button onClick={() => setShow(!show)}>show</button>
      <h2 onClick={() => setCount(count + 1)}>{count}</h2>
    </div>
  )
}