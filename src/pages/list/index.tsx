import React, { useState, useRef } from 'react'
import { useParams, history, KeepAlive } from 'umi'
import { Tabs, Selector, InfiniteScroll, CascaderView, Image } from 'antd-mobile'
import FiltersDropdown, { FiltersDropdownRef } from '@/components/filters-dropdown'
import { CascaderViewOptions, options, reangeOptions, pageData } from './mock'
import RangeSelector from '@/components/range-selector'
import FilterMore from './components/filter-more'
import {
  List as VirtualizedList,
  AutoSizer,
  WindowScroller,
} from 'react-virtualized'
import './index.less'

enum PageType {
  SELL = 'sell',
  RENT = 'rent',
}

const delay = (time: number) => {
  return new Promise((res) => {
    setTimeout(() => {
      res(1)
    }, time)
  })
}


function List() {
  const { type: pageType } = useParams() as { type: PageType }
  const isSellPage = pageType === PageType.SELL
  const [hasMore, setHasMore] = useState(true)
  const [pageInfo, setPageInfo] = useState({
    pageSize: 20,
    pageNum: 1,
  })
  const [pageList, setPageList] = useState([] as any)
  const [filterValue, setFilterValue] = useState({})

  const filtersDropdownRef = useRef<FiltersDropdownRef>(null)

  const handleChangePage = (key: string) => {
    filtersDropdownRef.current?.resetValue()
    history.replace('/list/' + key)
  }

  const loadMore = async () => {
    console.log('load more fitler', filterValue)
    console.log('pageInfo', pageInfo)
    await delay(1500)
    const { pageNum, pageSize } = pageInfo
    const startIdx = (pageNum - 1) * pageSize
    const endIdx = startIdx + pageSize
    setPageList((prev: any) => {
      if (!!prev?.length) {
        return [...prev, ...pageData.slice(startIdx, endIdx)]
      } else {
        return pageData.slice(startIdx, endIdx)
      }
    })
    setPageInfo(prev => ({ ...prev, pageNum: pageNum + 1 }))
    if (pageNum * pageSize >= pageData.length) {
      setHasMore(false)
    }
  }

  const toDetail = (id: string) => {
    history.push('/detail/' + id)
  }

  const rowRenderer = ({
    index,
    // key,
    style,
  }: {
    index: number
    // key: string
    style: React.CSSProperties
  }) => {
    const item = pageList[index]
    if (!item) return null
    return (
      <div className="list-item" onClick={() => toDetail(item.id)} key={item.id} style={style}>
        <div className="list-img">
          <Image lazy src={item.imgUrl} />
          {/* <img src={item.imgUrl} alt="封面" /> */}
        </div>
        <div className="content">
          <div className="title">{item.title}</div>
          <div className="desc">{item.desc}</div>
        </div>
      </div>
    )
  }

  return (
    <div className="list-wrapper">
      <div className="list-header">
        <Tabs activeKey={pageType} onChange={handleChangePage}>
          <Tabs.Tab title='出售' key={PageType.SELL} />
          <Tabs.Tab title='出租' key={PageType.RENT} />
        </Tabs>
        <FiltersDropdown
          onChange={(val) => {
            console.log('value', val)
            setFilterValue(val)
            setPageInfo({ pageNum: 1, pageSize: 20 })
            setPageList([])
            setHasMore(true)
          }}
          ref={filtersDropdownRef}
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
            <FilterMore></FilterMore>
          </FiltersDropdown.Item>
        </FiltersDropdown>

      </div>
      <div className="list-main">
        {!!pageList.length && (
          <WindowScroller>
            {({ height, scrollTop, isScrolling }) => (
              <AutoSizer disableHeight>
                {({ width }) => (
                  <VirtualizedList
                    autoHeight
                    rowCount={pageList.length}
                    rowRenderer={rowRenderer}
                    width={width}
                    height={height}
                    rowHeight={90}
                    overscanRowCount={10}
                    isScrolling={isScrolling}
                    scrollTop={scrollTop}
                  />
                )}
              </AutoSizer>
            )}
          </WindowScroller>
        )}
      </div>
      <InfiniteScroll loadMore={loadMore} hasMore={hasMore} />
    </div >
  )
}

// 缓存页面

export default function KeepAliveList() {
  return (
    <KeepAlive name="/list">
      <List />
    </KeepAlive>
  )
}