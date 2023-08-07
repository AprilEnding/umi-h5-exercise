import React from 'react'
import { useParams} from 'umi'

export default function Detail() {

  const { id } = useParams() as { id: string }

  return (
    <div>
      detail: {id}
      <button onClick={() => {
        fetch('/api/test/login')
      }}>fetch</button>
    </div>
  )
}