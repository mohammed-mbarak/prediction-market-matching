import React, { useState } from 'react'
import Card from '../UI/Card'
import Input from '../UI/Input'
import Select from '../UI/Select'
import Button from '../UI/Button'
import { submitOrder } from '../../services/api'

const OrderForm = ({ onOrderSubmit }) => {
  const [formData, setFormData] = useState({
    account_id: `user_${Math.floor(Math.random() * 1000)}`,
    market_id: 'default_market',
    side: 'YES',
    order_type: 'BUY',
    price: 50,
    quantity: 10,
  })

  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' || name === 'quantity' ? parseInt(value) || 0 : value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    // Validate market order (price=0 only for SELL)
    if (formData.price === 0 && formData.order_type === 'BUY') {
      setMessage('❌ Error: Market orders (price=0) are only allowed for SELL orders')
      setLoading(false)
      return
    }

    try {
      const result = await submitOrder(formData)
      
      let msg = `✅ Order submitted! ID: ${result.order.order_id.slice(0, 8)}...`
      if (result.trades?.length > 0) {
        msg += ` ${result.trades.length} trade${result.trades.length > 1 ? 's' : ''} executed.`
      }
      
      setMessage(msg)
      
      if (onOrderSubmit) {
        onOrderSubmit()
      }
      
      // Reset form (keep account ID and other fields, only reset price/quantity)
      setFormData(prev => ({
        ...prev,
        price: 50,
        quantity: 10,
      }))
    } catch (err) {
      setMessage(`❌ Error: ${err.response?.data?.detail || err.message || 'Failed to submit order'}`)
    } finally {
      setLoading(false)
    }
  }

  const sideOptions = [
    { value: 'YES', label: 'YES' },
    { value: 'NO', label: 'NO' }
  ]

  const orderTypeOptions = [
    { value: 'BUY', label: 'BUY' },
    { value: 'SELL', label: 'SELL' }
  ]

  return (
    <Card title={
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-linear-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-md">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-800">New Trade Order</h2>
          <p className="text-sm text-slate-600">Submit market or limit orders</p>
        </div>
      </div>
    } className="border border-slate-200 shadow-lg">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Account ID Section */}
        <div className="bg-emerald-50 rounded-xl p-5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm">
              <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div className="flex-1">
              <Input
                label="Account ID"
                name="account_id"
                value={formData.account_id}
                onChange={handleChange}
                className="bg-white shadow-sm"
              />
            </div>
          </div>
        </div>

        {/* Trade Type and Order Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <label className="block text-sm font-medium text-slate-700">Trade Type</label>
            <div className="grid grid-cols-2 gap-3">
              <Select
                name="side"
                value={formData.side}
                onChange={handleChange}
                options={sideOptions}
                className="bg-white shadow-sm"
              />
              <Select
                name="order_type"
                value={formData.order_type}
                onChange={handleChange}
                options={orderTypeOptions}
                className="bg-white shadow-sm"
              />
            </div>
          </div>

          <div className="space-y-3">
            <label className="block text-sm font-medium text-slate-700">Order Details</label>
            <div className="grid grid-cols-2 gap-3">
              <Input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                min="0"
                max="100"
                placeholder="Price (¢)"
                className="bg-white shadow-sm"
              />
              <Input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                min="1"
                placeholder="Quantity"
                className="bg-white shadow-sm"
              />
            </div>
            <p className="text-xs text-slate-500 mt-2">
              Price: 0-100¢ • <span className="font-medium">0 = Market Order (SELL only)</span>
            </p>
          </div>
        </div>

        {/* Message Display */}
        {message && (
          <div className={`p-4 rounded-xl ${message.includes('❌') ? 'bg-red-50 text-red-700' : 'bg-emerald-50 text-emerald-700'}`}>
            <div className="flex items-center gap-3">
              <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${message.includes('❌') ? 'bg-red-100' : 'bg-emerald-100'}`}>
                {message.includes('❌') ? (
                  <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              <span className="font-medium">{message}</span>
            </div>
          </div>
        )}

        {/* Submit Section */}
        <div className="pt-6 border-t border-slate-100">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
            <div className="text-center sm:text-left">
              <div className="text-sm text-slate-600 mb-1">Executing on market</div>
              <div className="font-medium text-slate-800 bg-slate-50 px-4 py-2 rounded-lg">
                {formData.market_id}
              </div>
            </div>
            <Button 
              type="submit" 
              disabled={loading}
              variant="primary"
              className="w-full sm:w-auto min-w-50"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-3">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Processing Order...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-3">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <span>Execute Trade</span>
                </div>
              )}
            </Button>
          </div>

          {/* Order Summary */}
          <div className="mt-6 p-4 bg-slate-50 rounded-lg">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-slate-600">Price per unit</div>
                <div className="font-semibold text-slate-800">{formData.price}¢</div>
              </div>
              <div>
                <div className="text-slate-600">Total quantity</div>
                <div className="font-semibold text-slate-800">{formData.quantity} units</div>
              </div>
              <div>
                <div className="text-slate-600">Order type</div>
                <div className="font-semibold text-slate-800">{formData.order_type}</div>
              </div>
              <div>
                <div className="text-slate-600">Total value</div>
                <div className="font-bold text-slate-900">
                  ${((formData.price * formData.quantity) / 100).toFixed(2)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </Card>
  )
}

export default OrderForm