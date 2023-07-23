import React, { useContext } from 'react'

export const FiltersValueContext = React.createContext<{
  value: { [key: string]: any }
  setValueByKey: (key: string, value: any) => void
  subscripValuesByKeys: (keys: string[]) => void
  highlightKeys: string[] | undefined
  resetValue: (keys?: string[]) => void
}>({} as any)

export const useFiltersValueContext = () => {
  return useContext(FiltersValueContext)
}