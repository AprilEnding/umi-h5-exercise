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
    props: {
      columns: 3,
      multiple: true,
    },
  },
  {
    key: 'likeBall',
    title: '喜欢的球类',
    selector: Selector,
    props: {
      columns: 3,
    },
  },
  {
    key: 'unlikeBall',
    title: '讨厌的球类',
    selector: Selector,
    props: {
      columns: 3,
    },
  },
]

type V = {
  [key: string]: any
}

interface IFilterMoreProps {
  value?: V
  onChange?: (v: V) => void
  defaultValue?: V
  areaRangeOptions: { label: string, value: [number, number] }
  ballOptions: { label: string, value: string }
}

export default function FilterMore(props: IFilterMoreProps) {

  const {
    value: propsValue,
    onChange: propsOnChange,
    defaultValue = {},
    areaRangeOptions,
    ballOptions,
  } = props

  const [sideKey, setSideKey] = useState(sideList[0].key)
  const [sideMainDom, setSideMainDom] = useState<HTMLDivElement | null>(null)
  const [sideMainDomRectTop, setSideMainDomRectTop] = useState(0)
  const isClickSideItemRef = useRef(false)

  const optionsMap: { [key: string]: any } = {
    area: areaRangeOptions,
    likeBall: ballOptions,
    unlikeBall: ballOptions,
  }

  const [value, setValue] = usePropsValue({
    value: propsValue,
    defaultValue: defaultValue,
    onChange: propsOnChange,
  })

  const handleChangeByKey = useCallback((key: string, val: any) => {
    setValue((prev) => ({ ...prev, [key]: val }))
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
          sideList.map(({ key, selector, props, title }) => {
            const Selector = selector
            const options = optionsMap[key]
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