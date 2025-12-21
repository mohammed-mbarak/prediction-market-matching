import axios from 'axios'

// Read base URL from Vite environment variable
const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

const api = axios.create({
  baseURL: API_URL,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Response interceptor for better error handling
api.interceptors.response.use(
  response => response,
  error => {
    console.error('API Error:', error.message)
    if (error.response) {
      console.error('Response data:', error.response.data)
      console.error('Response status:', error.response.status)
    }
    return Promise.reject(error)
  }
)

// Submit new order
export const submitOrder = async (orderData) => {
  try {
    const response = await api.post('/orders', orderData)
    return response.data
  } catch (error) {
    console.error('Error submitting order:', error)
    throw error
  }
}

// Get specific order by order_id
export const getOrder = async (orderId) => {
  try {
    const response = await api.get(`/orders/${orderId}`)
    return response.data
  } catch (error) {
    console.error(`Error fetching order ${orderId}:`, error)
    throw error
  }
}

// Get order book for a given market
export const getOrderBook = async (marketId = 'default_market') => {
  try {
    const response = await api.get(`/order-book/${marketId}`)
    return response.data
  } catch (error) {
    console.error('Error fetching order book:', error)
    throw error
  }
}

// Get recent trades for a given market
export const getTrades = async (marketId = 'default_market', limit = 20) => {
  try {
    const response = await api.get(`/trades/${marketId}?limit=${limit}`)
    return response.data
  } catch (error) {
    console.error('Error fetching trades:', error)
    throw error
  }
}

// Health check
export const healthCheck = async () => {
  try {
    const response = await api.get('/health')
    return response.data
  } catch (error) {
    console.error('Error checking health:', error)
    throw error
  }
}
