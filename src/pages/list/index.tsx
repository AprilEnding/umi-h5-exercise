import React, { useState, useRef, useEffect } from 'react';
import {
  useParams,
  history,
  KeepAlive,
  // useAccess,
} from 'umi';
import {
  Tabs,
  Selector,
  InfiniteScroll,
  CascaderView,
  Image,
} from 'antd-mobile';
import FiltersDropdown, {
  FiltersDropdownRef,
} from '@/components/filters-dropdown';
import RangeSelector from '@/components/range-selector';
import FilterMore from './components/filter-more';
import {
  List as VirtualizedList,
  AutoSizer,
  WindowScroller,
} from 'react-virtualized';
import useFiltersOptions from './hooks/useFiltersOptions';
import { useRequest } from 'ahooks';
import { getList } from '@/api';
import './index.less';

enum PageType {
  SELL = 'sell',
  RENT = 'rent',
}

function List() {
  const { type: pageType } = useParams() as { type: PageType };
  const isSellPage = pageType === PageType.SELL;
  const [hasMore, setHasMore] = useState(true);
  const [pageInfo, setPageInfo] = useState({ pageSize: 20, pageNum: 1 });
  const [pageList, setPageList] = useState([] as any);
  const [filterValue, setFilterValue] = useState({});
  // const access = useAccess()
  const filtersDropdownRef = useRef<FiltersDropdownRef>(null);
  const { runAsync: fetchList } = useRequest(getList, { manual: true });

  const handleChangePage = (key: string) => {
    history.replace('/list/' + key);
  };

  useEffect(() => {
    filtersDropdownRef.current?.resetValue();
    setPageList([]);
    setHasMore(true);
    setPageInfo({ pageSize: 20, pageNum: 1 });
  }, [pageType]);

  const {
    areaOptions,
    vegetableOptions,
    priceRangeOptions,
    areaRangeOptions,
    ballOptions,
  } = useFiltersOptions();

  const loadMore = async () => {
    const { pageNum, pageSize } = pageInfo;
    console.log('filterValue', filterValue);
    const res = await fetchList({
      data: {
        pageSize,
        pageNum,
        type: pageType,
      },
    });
    if (!!res?.data?.items?.length) {
      setPageList((prev: any) => {
        if (!!prev?.length) {
          return [...prev, ...res.data.items];
        } else {
          return res.data.items;
        }
      });
      setPageInfo((prev) => ({ ...prev, pageNum: pageNum + 1 }));
    }
    setHasMore(!(pageNum * pageSize >= res?.data?.count));
  };

  const toDetail = (id: string) => {
    history.push('/detail/' + id);
  };

  const rowRenderer = ({
    index,
    style,
  }: {
    index: number;
    style: React.CSSProperties;
  }) => {
    const item = pageList[index];
    if (!item) return null;
    return (
      <div
        className="list-item"
        onClick={() => toDetail(item.id)}
        key={item.id}
        style={style}
      >
        <div className="list-img">
          <Image lazy src={item.imageUrl} />
        </div>
        <div className="content">
          <div className="title">{item.title}</div>
          <div className="desc">{item.description}</div>
        </div>
      </div>
    );
  };

  return (
    <div className="list-wrapper">
      <div className="list-header">
        <Tabs activeKey={pageType} onChange={handleChangePage}>
          <Tabs.Tab title="出售" key={PageType.SELL} />
          <Tabs.Tab title="出租" key={PageType.RENT} />
        </Tabs>
        <FiltersDropdown
          onChange={(val) => {
            console.log('value', val);
            setFilterValue(val);
            setPageInfo({ pageNum: 1, pageSize: 20 });
            setPageList([]);
            setHasMore(true);
          }}
          ref={filtersDropdownRef}
        >
          <FiltersDropdown.Item key="area" title="区域">
            <CascaderView options={areaOptions} />
          </FiltersDropdown.Item>
          <FiltersDropdown.Item key="vegetable" title="蔬菜">
            <Selector columns={3} options={vegetableOptions} />
          </FiltersDropdown.Item>
          <FiltersDropdown.Item key="price" title="价格">
            <RangeSelector
              options={priceRangeOptions}
              columns={3}
              multiple
              onChange={(v, extend) => {
                console.log(v, extend);
              }}
              inputSuffix="元"
            />
          </FiltersDropdown.Item>
          <FiltersDropdown.Item
            key="more"
            title="更多"
            contentClassName="list-filter-more"
          >
            <FilterMore
              areaRangeOptions={areaRangeOptions}
              ballOptions={ballOptions}
            ></FilterMore>
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
    </div>
  );
}

// 缓存页面

export default function KeepAliveList() {
  return (
    <KeepAlive name="/list">
      <List />
    </KeepAlive>
  );
}
