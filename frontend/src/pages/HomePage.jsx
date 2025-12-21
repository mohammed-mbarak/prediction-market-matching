import React, { useState } from 'react'
import OrderForm from '../components/OrderForm/OrderForm'
import OrderBook from '../components/OrderBook/OrderBook'
import TradeHistory from '../components/TradeHistory/TradeHistory'
import { useRealtimeData } from '../hooks/useRealtimeData'

const HomePage = () => {
  const [refreshKey, setRefreshKey] = useState(0)
  const { orderBook, trades, loading, error } = useRealtimeData(refreshKey)

  const handleOrderSubmit = () => {
    setRefreshKey(prev => prev + 1)
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Prediction Market Exchange</h1>
        <p className="text-gray-600">Real-time order matching for YES/NO shares</p>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4">
          <div className="flex items-center">
            <div className="shrink-0">
              <svg className="h-5 w-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
              <p className="text-sm text-red-600 mt-1">
                Make sure backend is running at: <code className="bg-red-100 px-2 py-1 rounded">http://localhost:8000</code>
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Order Form */}
        <div className="lg:col-span-1">
          <OrderForm onOrderSubmit={handleOrderSubmit} />
        </div>

        {/* Right Column - Order Book & Trades */}
        <div className="lg:col-span-2 space-y-8">
          <OrderBook orderBook={orderBook} loading={loading} />
          <TradeHistory trades={trades} loading={loading} />
        </div>
      </div>
    </div>
  )
}

export default HomePage