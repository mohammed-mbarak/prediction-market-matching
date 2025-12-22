import React from 'react'
import Card from '../UI/Card'

const TradeHistory = ({ trades, loading }) => {
  const formatTime = (timestamp) => {
    try {
      const date = new Date(timestamp)
      return date.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      })
    } catch {
      return 'Unknown'
    }
  }

  if (loading) {
    return (
      <Card title="Recent Trades" className="border border-gray-200 shadow-sm">
        <div className="flex flex-col items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">Loading trades...</p>
        </div>
      </Card>
    )
  }

  const tradeList = Array.isArray(trades) ? trades : []
  const hasTrades = tradeList.length > 0

  return (
    <Card
      title={
        <div className="flex items-center justify-between">
          <span className="text-xl font-bold text-gray-800">Recent Trades</span>
          {hasTrades && (
            <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
              {tradeList.length} trade{tradeList.length !== 1 ? 's' : ''}
            </span>
          )}
        </div>
      }
      className="border border-gray-200 shadow-sm"
    >
      {!hasTrades ? (
        <div className="text-center py-12 text-gray-500">
          No trades yet
        </div>
      ) : (
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left text-xs text-gray-500">Time</th>
              <th className="px-4 py-2 text-left text-xs text-gray-500">Side</th>
              <th className="px-4 py-2 text-left text-xs text-gray-500">Price</th>
              <th className="px-4 py-2 text-left text-xs text-gray-500">Qty</th>
              <th className="px-4 py-2 text-left text-xs text-gray-500">Buyer</th>
              <th className="px-4 py-2 text-left text-xs text-gray-500">Seller</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {tradeList.map((trade) => (
              <tr key={trade.trade_id}>
                <td className="px-4 py-2 text-sm">{formatTime(trade.timestamp)}</td>
                <td className="px-4 py-2 text-sm">{trade.side}</td>
                <td className="px-4 py-2 text-sm">{trade.price}¢</td>
                <td className="px-4 py-2 text-sm">{trade.quantity}</td>
                <td className="px-4 py-2 text-sm">{trade.buyer_account.slice(0, 8)}…</td>
                <td className="px-4 py-2 text-sm">{trade.seller_account.slice(0, 8)}…</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </Card>
  )
}

export default TradeHistory
