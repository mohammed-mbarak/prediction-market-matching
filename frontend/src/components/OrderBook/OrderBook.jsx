import React from 'react'
import Card from '../UI/Card'

const OrderTable = ({ title, orders, isBid }) => {
  if (!orders || orders.length === 0) {
    return (
      <div className="p-6 text-center border border-gray-200 rounded-lg">
        <div className="text-gray-400 mb-2">No {title.toLowerCase()}</div>
        <div className="text-sm text-gray-500">Waiting for orders...</div>
      </div>
    )
  }

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <div className="bg-gray-50 px-4 py-3 border-b">
        <h3 className="font-semibold text-gray-700">{title}</h3>
      </div>
      <div className="divide-y divide-gray-100">
        {orders.map((level) => (
          <div
            key={level.price} // use price as key to prevent flicker
            className="px-4 py-3 hover:bg-gray-50 flex justify-between items-center"
          >
            <div className="flex items-center gap-3">
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  isBid ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}
              >
                {level.price}¢
              </span>
              <span className="text-gray-600">
                {level.orders.length} order{level.orders.length !== 1 ? 's' : ''}
              </span>
            </div>
            <div className="text-lg font-bold text-gray-900">{level.total_quantity}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

const OrderBook = ({ orderBook, loading }) => {
  const yesBids = orderBook?.yes_bids || []
  const yesAsks = orderBook?.yes_asks || []
  const noBids = orderBook?.no_bids || []
  const noAsks = orderBook?.no_asks || []

  return (
    <Card
      title={
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-800">Live Order Book</h2>
            <p className="text-sm text-gray-500 mt-1">Auto-refreshing every 2 seconds</p>
          </div>
        </div>
      }
    >
      {loading && (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600">Loading order book...</p>
        </div>
      )}

      {!loading && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* YES Shares */}
          <div>
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <h3 className="text-lg font-semibold text-gray-800">YES Shares</h3>
              </div>
              <div className="space-y-4">
                <OrderTable title="BUY YES (Bids)" orders={yesBids} isBid={true} />
                <OrderTable title="SELL YES (Asks)" orders={yesAsks} isBid={false} />
              </div>
            </div>
          </div>

          {/* NO Shares */}
          <div>
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                <h3 className="text-lg font-semibold text-gray-800">NO Shares</h3>
              </div>
              <div className="space-y-4">
                <OrderTable title="BUY NO (Bids)" orders={noBids} isBid={true} />
                <OrderTable title="SELL NO (Asks)" orders={noAsks} isBid={false} />
              </div>
            </div>
          </div>
        </div>
      )}

      {orderBook && (
        <div className="mt-6 pt-4 border-t border-gray-200 text-sm text-gray-500">
          <div className="flex items-center justify-between">
            <span>Market: {orderBook.market_id || 'default_market'}</span>
            <span>
              Total orders: {yesBids.length + yesAsks.length + noBids.length + noAsks.length}
            </span>
          </div>
        </div>
      )}
    </Card>
  )
}

export default OrderBook
