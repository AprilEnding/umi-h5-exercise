import React, { useState, useEffect } from 'react'
import { useParams, history } from 'umi'
import { Tabs, Selector, Checkbox, Space, CascaderView } from 'antd-mobile'
import FiltersDropdown from '@/components/filters-dropdown'
import { CascaderViewOptions, options, reangeOptions } from './mock'
import RangeSelector from '@/components/range-selector'

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
        <FiltersDropdown.Item key="area" title="区域">
          <CascaderView
            options={CascaderViewOptions}
            onChange={(val, extend) => {
              console.log('onChange', val, extend)
            }}
          />
        </FiltersDropdown.Item>
        <FiltersDropdown.Item key="vegetable" title="蔬菜">
          <Selector
            columns={3}
            options={options}
          />
        </FiltersDropdown.Item>
        <FiltersDropdown.Item key="33" title="测试3">
          <RangeSelector 
            options={reangeOptions}
            columns={3}
            multiple
            onChange={(v, extend) => {
              console.log(v, extend);
              
            }}
          />
        </FiltersDropdown.Item>
        {show ? (
          <FiltersDropdown.Item key="44" title="测试4">
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