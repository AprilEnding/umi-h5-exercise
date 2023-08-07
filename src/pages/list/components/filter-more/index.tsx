import React, { useState, useEffect, useRef, useCallback } from 'react'
import { Selector, SideBar } from 'antd-mobile'
import { useThrottleFn } from 'ahooks'
import RangeSelector from '@/components/range-selector'
import { usePropsValue } from 'antd-mobile/es/utils/use-props-value'


const sideList = [
  {
    key: 'area',
    title: '面积',
    selector: RangeSelector,
    options: [
      {
        label: '50㎡以下',
        value: [0, 50],
      },
      {
        label: '50-100㎡',
        value: [50, 100],
      },
      {
        label: '100-150㎡',
        value: [100, 150],
      },
      {
        label: '200-250㎡',
        value: [200, 250],
      },
      {
        label: '250-300㎡',
        value: [250, 300],
      },
      {
        label: '300-350㎡',
        value: [300, 350],
      },
      {
        label: '350元以上',
        value: [350, Infinity],
      },
    ],
    props: {
      columns: 3,
      multiple: true,
    },
  },
  {
    key: 'ball',
    title: '球类',
    selector: Selector,
    options: [
      {
        label: '篮球',
        value: 'basketball',
      },
      {
        label: '乒乓球',
        value: 'tableTennis',
      },
      {
        label: '羽毛球',
        value: 'badminton',
      },
      {
        label: '网球',
        value: 'tennis',
      },
    ],
    props: {
      columns: 3,
    },
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

type V = {
  [key: string]: any
}

interface IFilterMoreProps {
  value?: V
  onChange?: (v: V) => void
  defaultValue?: V
}

export default function FilterMore(props: IFilterMoreProps) {

  const { value: propsValue, onChange: propsOnChange, defaultValue = {} } = props

  const [sideKey, setSideKey] = useState(sideList[0].key)
  const [sideMainDom, setSideMainDom] = useState<HTMLDivElement | null>(null)
  const [sideMainDomRectTop, setSideMainDomRectTop] = useState(0)
  const isClickSideItemRef = useRef(false)

  const [value, setValue] = usePropsValue({
    value: propsValue,
    defaultValue: defaultValue,
    onChange: propsOnChange,
  })

  const handleChangeByKey = useCallback((key: string, val: any) => {
    setValue((prev) => ({...prev, [key]: val}))
  }, [setValue])

  const { run: handleScroll } = useThrottleFn(
    () => {
      if (isClickSideItemRef.current) {
        isClickSideItemRef.current = false
        return
      }
      let currentKey = sideList[0].key
      for (const item of sideList) {
        const element = document.getElementById(`anchor-${item.key}`)
        if (!element) continue
        const rect = element.getBoundingClientRect()
        if (rect.top <= sideMainDomRectTop) {
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
    <div className="list-filter-more-container">
      <div className="list-filter-more-side">
        <SideBar
          activeKey={sideKey}
          onChange={(key) => {
            setSideKey(key)
            isClickSideItemRef.current = true
            document.getElementById(`anchor-${key}`)?.scrollIntoView()
          }}
          style={{
            '--width': '80px'
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
      <div className="list-filter-more-main" ref={(ref) => {
        setSideMainDom(ref)
        setSideMainDomRectTop(ref?.getBoundingClientRect().top ?? 0)
      }}>
        {
          sideList.map(({ key, selector, props, options, title }) => {
            const Selector = selector
            return (
              <div
                id={`anchor-${key}`}
                className="list-filter-more-item"
                key={key}
              >
                <div>
                  <h4>{title}</h4>
                  <div>
                    {
                      Selector ? (
                        <Selector
                          {...props}
                          options={options as any}
                          value={value && value[key]}
                          onChange={(v) => handleChangeByKey(key, v)}
                        />
                      ) : (
                        <div style={{ height: 100 }}>{title}</div>
                      )
                    }
                  </div>
                </div>
              </div>
            )
          })
        }
      </div>
    </div>
  )
}