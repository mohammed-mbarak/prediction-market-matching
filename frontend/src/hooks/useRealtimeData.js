import { useState, useEffect, useRef } from 'react'
import { getOrderBook, getTrades } from '../services/api'

// Helper: shallow comparison for order book levels
const orderBookChanged = (prev, next) => {
  if (!prev || !next) return true
  
  const keys = ['yes_bids', 'yes_asks', 'no_bids', 'no_asks']
  
  for (const key of keys) {
    const prevLevels = prev[key] || []
    const nextLevels = next[key] || []
    
    if (prevLevels.length !== nextLevels.length) return true
    
    for (let i = 0; i < prevLevels.length; i++) {
      if (
        prevLevels[i].price !== nextLevels[i].price ||
        prevLevels[i].total_quantity !== nextLevels[i].total_quantity
      ) {
        return true
      }
    }
  }
  
  return false
}

export const useRealtimeData = (refreshKey) => {
  const [orderBook, setOrderBook] = useState(null)
  const [trades, setTrades] = useState([])
  const [loading, setLoading] = useState(true)

  // refs (do not trigger re-renders)
  const hasLoadedRef = useRef(false)
  const lastTradesRef = useRef([])
  const lastOrderBookRef = useRef(null)

  useEffect(() => {
    let cancelled = false

    const fetchAllData = async () => {
      try {
        const [orderBookData, tradesData] = await Promise.all([
          getOrderBook(),
          getTrades()
        ])

        if (cancelled) return

        /* ---------------- ORDER BOOK ---------------- */
        if (orderBookData && Object.keys(orderBookData).length > 0) {
          // Only update if data actually changed
          if (orderBookChanged(lastOrderBookRef.current, orderBookData)) {
            setOrderBook(orderBookData)
            lastOrderBookRef.current = orderBookData
          }
        }

        /* ---------------- TRADES ---------------- */
        if (Array.isArray(tradesData) && tradesData.length > 0) {
          const lastTrades = lastTradesRef.current

          // Basic change detection (cheap & stable)
          const isDifferent =
            lastTrades.length !== tradesData.length ||
            lastTrades[0]?.trade_id !== tradesData[0]?.trade_id

          if (isDifferent) {
            setTrades(tradesData)
            lastTradesRef.current = tradesData
          }
        }

        /* ---------------- LOADING (FIRST LOAD ONLY) ---------------- */
        if (!hasLoadedRef.current) {
          setLoading(false)
          hasLoadedRef.current = true
        }
      } catch (err) {
        console.error('Realtime fetch failed:', err)
        
        // Set loading false even on error (first load)
        if (!hasLoadedRef.current) {
          setLoading(false)
          hasLoadedRef.current = true
        }
      }
    }

    fetchAllData()
    const interval = setInterval(fetchAllData, 4000)

    return () => {
      cancelled = true
      clearInterval(interval)
    }
  }, [refreshKey])

  return { orderBook, trades, loading }
}