import { useState, useEffect, useCallback } from 'react'
import { getOrderBook, getTrades } from '../services/api'

export const useRealtimeData = (refreshKey) => {
  const [orderBook, setOrderBook] = useState(null)
  const [trades, setTrades] = useState([])
  const [loading, setLoading] = useState(true)
  const [lastUpdate, setLastUpdate] = useState(null)

  const fetchAllData = useCallback(async () => {
    try {
      console.log('🔄 Fetching real-time data...')
      
      const [orderBookData, tradesData] = await Promise.all([
        getOrderBook(),
        getTrades()
      ])
      
      console.log('📊 Order Book Data:', orderBookData)
      console.log('📈 Trades Data:', tradesData)
      
      // Force state update even if data appears similar
      setOrderBook(prev => {
        // Compare by converting to JSON string
        const prevStr = JSON.stringify(prev)
        const newStr = JSON.stringify(orderBookData)
        if (prevStr !== newStr) {
          console.log('🆕 Order book updated!')
          return orderBookData
        }
        console.log('⏸️ Order book unchanged')
        return prev
      })
      
      setTrades(prev => {
        const prevStr = JSON.stringify(prev)
        const newStr = JSON.stringify(tradesData)
        if (prevStr !== newStr) {
          console.log('🆕 Trades updated!')
          return tradesData
        }
        console.log('⏸️ Trades unchanged')
        return prev
      })
      
      setLastUpdate(new Date().toISOString())
      
    } catch (error) {
      console.error('❌ Error fetching real-time data:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchAllData()
    const interval = setInterval(fetchAllData, 2000)
    
    console.log('⏰ Polling started (2s interval)')
    
    return () => {
      console.log('🛑 Polling stopped')
      clearInterval(interval)
    }
  }, [fetchAllData, refreshKey])

  return { orderBook, trades, loading, lastUpdate }
}