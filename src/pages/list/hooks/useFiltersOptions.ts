import { 
  getAreaOptions, 
  getVegetableOptions, 
  getPriceRangeOptions,
  getAreaRangeOptions,
  getBallOptions,
} from '@/api'
import { useRequest } from 'ahooks'
import { useEffect, useState } from 'react'
import { CascaderOption } from 'antd-mobile'

export interface Datum {
  citys: City[];
  provinceId: string;
  provinceName: string;
}

export interface City {
  cityId: string;
  cityName: string;
  regions: Region[];
}

export interface Region {
  regionId: string;
  regionName: string;
}


function mapOptions(
  source: { [key: string]: any }[],
  mapKey: {
    label: string,
    value: string,
    children: string
  }
) {
  return source?.map(item => ({
    label: item[mapKey.label],
    value: item[mapKey.value],
    children: item[mapKey.children],
  })) || []
}

function formatAreaOptions(areaResData: Datum[]) {
  return areaResData?.map(provinceArr => {
    return {
      label: provinceArr.provinceName,
      value: provinceArr.provinceId,
      children: provinceArr.citys?.map(cityArr => ({
        label: cityArr.cityName,
        value: cityArr.cityId,
        children: cityArr.regions?.map(region => ({
          label: region.regionName,
          value: region.regionId,
        })),
      }))
    }
  }) || []
}

export default function useFiltersOptions() {
  const { runAsync: fetchAreaOptions } = useRequest(getAreaOptions, { manual: true })
  const {data: vegetableOptionsRes} = useRequest(getVegetableOptions)
  const {data: priceRangeOptionsRes} = useRequest(getPriceRangeOptions)
  const {data: areaRangeOptionsRes} = useRequest(getAreaRangeOptions)
  const {data: ballOptionsRes} = useRequest(getBallOptions)
  const [areaOptions, setAreaOptions] = useState<CascaderOption[]>([])

  useEffect(() => {
    (async () => {
      const areaOptionRes = await fetchAreaOptions()
      setAreaOptions(formatAreaOptions(areaOptionRes?.data))
    })()
  }, [])

  return {
    areaOptions,
    vegetableOptions: vegetableOptionsRes?.data || [],
    priceRangeOptions: priceRangeOptionsRes?.data || [],
    areaRangeOptions: areaRangeOptionsRes?.data || [],
    ballOptions: ballOptionsRes?.data || []
  }
}