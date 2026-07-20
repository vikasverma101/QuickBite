import React from 'react'
import Card from './ui/Card'
import Badge from './ui/Badge'

function CategoryCard({ name, image, subtitle, label, onClick }) {
  return (
    <Card className='relative overflow-hidden border-0 bg-white shadow-[0_20px_60px_rgba(15,23,42,0.08)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_30px_90px_rgba(15,23,42,0.12)]' hover={true}>
      <button
        type='button'
        onClick={onClick}
        className='group block w-full overflow-hidden text-left'
      >
        <div className='relative h-44 overflow-hidden bg-slate-100'>
          <img loading="lazy" src={image} alt={name} className='h-full w-full object-cover transition duration-500 group-hover:scale-105' />
          <div className='absolute inset-0 bg-gradient-to-t from-slate-950/70 to-transparent opacity-80' />
          {label && (
            <Badge className='absolute left-4 top-4 bg-white text-slate-900 shadow-sm' tone='slate'>
              {label}
            </Badge>
          )}
        </div>
        <div className='space-y-2 px-4 py-4'>
          <h3 className='text-base font-semibold text-slate-900'>{name}</h3>
          {subtitle && <p className='text-sm text-slate-500'>{subtitle}</p>}
        </div>
      </button>
    </Card>
  )
}

export default CategoryCard
