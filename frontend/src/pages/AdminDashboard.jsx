import React from 'react'
import { useSelector } from 'react-redux'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'
import AdminSidebar from '../components/AdminSidebar'
import { useState } from 'react'
import { pageShell } from '../designTokens'

function Sparkline({ values = [] }) {
  const w = 120, h = 40
  if (!values.length) return <svg width={w} height={h}></svg>
  const max = Math.max(...values)
  const min = Math.min(...values)
  const pts = values.map((v, i) => `${(i / (values.length - 1)) * w},${h - ((v - min) / (max - min || 1)) * h}`)
  return (
    <svg width={w} height={h} className='block'>
      <polyline fill='none' stroke='#ff4d2d' strokeWidth='2' points={pts.join(' ')} />
    </svg>
  )
}

function RecentOrdersList({ orders = [] }) {
  const [visible, setVisible] = useState(6)
  const slice = orders.slice(0, visible)
  return (
    <div className='space-y-3'>
      {slice.map((o) => (
        <div key={o._id} className='flex items-center justify-between rounded-2xl border p-3'>
          <div>
            <p className='text-sm font-semibold text-slate-900'>Order #{o._id.slice(-6)}</p>
            <p className='text-xs text-slate-500'>{new Date(o.createdAt).toLocaleString()}</p>
          </div>
          <div className='text-right'>
            <p className='text-sm font-semibold text-slate-900'>₹{o.totalAmount}</p>
            <Badge tone='slate'>{o.shopOrders?.[0]?.status}</Badge>
          </div>
        </div>
      ))}
      {orders.length > visible && (
        <div className='pt-2'>
          <button onClick={() => setVisible((v) => v + 6)} className='rounded-full bg-slate-100 px-4 py-2 text-sm text-slate-700'>Load more</button>
        </div>
      )}
    </div>
  )
}

function AdminDashboard() {
  const { myOrders, itemsInMyCity, userData } = useSelector((s) => s.user)

  const totalRevenue = myOrders?.reduce((s, o) => s + (o.totalAmount || 0), 0) || 0
  const totalOrders = myOrders?.length || 0
  const activeUsers = 1240 // placeholder
  const popularFoods = (itemsInMyCity || []).slice(0, 6)

  const revenueHistory = [1200, 1500, 1800, 1700, 1900, 2100, 2500]

  return (
    <div className={`${pageShell} py-8`}>
      <div className='mx-auto max-w-7xl'>
        <div className='flex gap-6'>
          <AdminSidebar />
          <main className='flex-1'>
            <div className='mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
              <Card className='p-4'>
                <p className='text-sm text-slate-500'>Revenue</p>
                <div className='mt-2 flex items-center justify-between'>
                  <div>
                    <p className='text-2xl font-semibold text-slate-900'>₹{totalRevenue}</p>
                    <p className='text-xs text-slate-500'>Last 30 days</p>
                  </div>
                  <Sparkline values={revenueHistory} />
                </div>
              </Card>

              <Card className='p-4'>
                <p className='text-sm text-slate-500'>Orders</p>
                <div className='mt-2 flex items-center justify-between'>
                  <div>
                    <p className='text-2xl font-semibold text-slate-900'>{totalOrders}</p>
                    <p className='text-xs text-slate-500'>Total orders</p>
                  </div>
                  <Sparkline values={[5,6,8,7,9,10,12]} />
                </div>
              </Card>

              <Card className='p-4'>
                <p className='text-sm text-slate-500'>Active Users</p>
                <div className='mt-2 flex items-center justify-between'>
                  <div>
                    <p className='text-2xl font-semibold text-slate-900'>{activeUsers}</p>
                    <p className='text-xs text-slate-500'>Monthly active</p>
                  </div>
                  <Sparkline values={[800,900,1000,1200,1100,1300,1240]} />
                </div>
              </Card>

              <Card className='p-4'>
                <p className='text-sm text-slate-500'>Popular foods</p>
                <div className='mt-3 grid gap-2'>
                  {popularFoods.length ? popularFoods.map((f, i) => (
                    <div className='flex items-center justify-between' key={i}>
                      <div className='flex items-center gap-3'>
                        <img loading="lazy" src={f.image} alt='' className='h-8 w-8 rounded object-cover' />
                        <div>
                          <p className='text-sm font-medium text-slate-900'>{f.name}</p>
                          <p className='text-xs text-slate-500'>₹{f.price}</p>
                        </div>
                      </div>
                      <Badge tone='brand'>Top</Badge>
                    </div>
                  )) : <p className='text-sm text-slate-500'>No data</p>}
                </div>
              </Card>
            </div>

            <div className='grid gap-6 lg:grid-cols-2'>
              <Card className='p-4'>
                <h3 className='text-lg font-semibold text-slate-900'>Recent Orders</h3>
                <div className='mt-3'>
                  {myOrders && myOrders.length > 0 ? (
                    <RecentOrdersList orders={myOrders} />
                  ) : (
                    <p className='text-sm text-slate-500'>No recent orders</p>
                  )}
                </div>
              </Card>

              <Card className='p-4'>
                <h3 className='text-lg font-semibold text-slate-900'>Users Overview</h3>
                <div className='mt-3 grid gap-2'>
                  <div className='flex items-center justify-between'>
                    <p className='text-sm text-slate-700'>Total users</p>
                    <p className='font-semibold text-slate-900'>~{activeUsers + 200}</p>
                  </div>
                  <div className='flex items-center justify-between'>
                    <p className='text-sm text-slate-700'>New signups (30d)</p>
                    <p className='font-semibold text-slate-900'>120</p>
                  </div>
                  <div className='flex items-center justify-between'>
                    <p className='text-sm text-slate-700'>Active shops</p>
                    <p className='font-semibold text-slate-900'>{(userData?.myShops || []).length || '—'}</p>
                  </div>
                </div>
              </Card>
            </div>

            <div className='mt-6 grid gap-6 lg:grid-cols-2'>
              <Card className='p-4 overflow-auto'>
                <h3 className='text-lg font-semibold text-slate-900'>Orders Table</h3>
                <table className='mt-3 w-full min-w-[640px] table-auto text-sm'>
                  <thead>
                    <tr className='text-left text-xs text-slate-500'>
                      <th className='py-2'>Order</th>
                      <th className='py-2'>Date</th>
                      <th className='py-2'>Amount</th>
                      <th className='py-2'>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {myOrders?.map((o) => (
                      <tr key={o._id} className='border-t border-slate-100'>
                        <td className='py-3'>{o._id.slice(-6)}</td>
                        <td className='py-3'>{new Date(o.createdAt).toLocaleDateString()}</td>
                        <td className='py-3'>₹{o.totalAmount}</td>
                        <td className='py-3'><Badge tone='slate'>{o.shopOrders?.[0]?.status}</Badge></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Card>

              <Card className='p-4 overflow-auto'>
                <h3 className='text-lg font-semibold text-slate-900'>Analytics</h3>
                <div className='mt-4 grid gap-3'>
                  <div className='flex items-center justify-between'>
                    <p className='text-sm text-slate-700'>Conversion rate</p>
                    <p className='font-semibold text-slate-900'>4.2%</p>
                  </div>
                  <div className='flex items-center justify-between'>
                    <p className='text-sm text-slate-700'>Avg order value</p>
                    <p className='font-semibold text-slate-900'>₹{Math.round((totalRevenue || 0) / (totalOrders || 1))}</p>
                  </div>
                  <div className='flex items-center justify-between'>
                    <p className='text-sm text-slate-700'>Refunds (30d)</p>
                    <p className='font-semibold text-slate-900'>3</p>
                  </div>
                </div>
              </Card>
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}

export default React.memo(AdminDashboard)
