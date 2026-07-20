import React from 'react'
import { Player } from 'lottie-react'

export default function LottieEmpty({ animationData, title = 'No items', subtitle = '' }) {
  return (
    <div className='grid place-items-center gap-4 py-12'>
      {animationData ? (
        <div style={{ width: 220 }}>
          <Player autoplay loop src={animationData} />
        </div>
      ) : (
        <div className='h-28 w-28 rounded-full bg-slate-50' />
      )}
      <h3 className='text-lg font-semibold text-slate-900'>{title}</h3>
      {subtitle && <p className='text-sm text-slate-500'>{subtitle}</p>}
    </div>
  )
}
