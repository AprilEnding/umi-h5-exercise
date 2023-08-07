import React from 'react'
import { useParams } from 'umi'
import { getAreaOptions } from '@/api'

export default function Detail() {

  const { id } = useParams() as { id: string }

  return (
    <div>
      detail: {id}
      <button onClick={() => {
        getAreaOptions().then(res => {
          console.log('res', res)
        })
      }}>fetch</button>
    </div>
  )
}