import React, { useState, useEffect } from 'react'
import { useParams, history } from 'umi'
import { Tabs, Selector, SideBar, CascaderView } from 'antd-mobile'
import FiltersDropdown from '@/components/filters-dropdown'
import { CascaderViewOptions, options, reangeOptions } from './mock'
import RangeSelector from '@/components/range-selector'
import { useThrottleFn } from 'ahooks'
import './index.less'

enum PageType {
  SELL = 'sell',
  RENT = 'rent',
}

const sideList = [
  {
    key: 'key1',
    title: '选项一',
  },
  {
    key: 'key2',
    title: '选项二',
  },
  {
    key: 'key3',
    title: '选项三',
  },
  {
    key: 'key4',
    title: '选项四',
  },
]

export default function List() {
  const { type: pageType } = useParams() as { type: PageType }
  const isSellPage = pageType === PageType.SELL
  const [show, setShow] = useState(true)
  const [count, setCount] = useState(1)
  const [sideKey, setSideKey] = useState('key1')
  const [sideMainDom, setSideMainDom] = useState<HTMLDivElement | null>(null)

  const handleChangePage = (key: string) => {
    history.replace('/list/' + key)
  }

  const { run: handleScroll } = useThrottleFn(
    () => {
      let currentKey = sideList[0].key
      for (const item of sideList) {
        const element = document.getElementById(`anchor-${item.key}`)
        if (!element) continue
        const rect = element.getBoundingClientRect()
        console.log('rect', rect)
        /**
         * 计算item 到 filter bar tabs 的高度
         */
        if (rect.top <= 0) {
          currentKey = item.key
        } else {
          break
        }
      }
      setSideKey(currentKey)
    },
    {
      leading: true,
      trailing: true,
      wait: 100,
    }
  )

  useEffect(() => { 
    if (!sideMainDom) return
    sideMainDom.addEventListener('scroll', handleScroll)
    return () => {
      sideMainDom.removeEventListener('scroll', handleScroll)
    }
  }, [sideMainDom])


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
        <FiltersDropdown.Item key="price" title="价格">
          <RangeSelector
            options={reangeOptions}
            columns={3}
            multiple
            onChange={(v, extend) => {
              console.log(v, extend);

            }}
            inputSuffix="元"
          />
        </FiltersDropdown.Item>
        <FiltersDropdown.Item key="more" title="更多" contentClassName="list-filter-more">
          <div className="list-filter-more-container">
            <div className="list-filter-more-side">
              <SideBar
                activeKey={sideKey}
                onChange={(key) => {
                  setSideKey(key)
                  document.getElementById(`anchor-${key}`)?.scrollIntoView()
                }}
              >
                {
                  sideList.map(item => (
                    <SideBar.Item
                      key={item.key}
                      title={item.title}
                    />
                  ))
                }
              </SideBar>
            </div>
            <div className="list-filter-more-main" ref={(ref) => setSideMainDom(ref)}>
              {
                sideList.map(item => (
                  <div id={`anchor-${item.key}`} className="list-filter-more-item">
                    <div style={{ height: 200 }}>{item.title}</div>
                  </div>
                ))
              }
            </div>
          </div>
        </FiltersDropdown.Item>
      </FiltersDropdown>
      <button onClick={() => setShow(!show)}>show</button>
      <h2 onClick={() => setCount(count + 1)}>{count}</h2>
    </div>
  )
}