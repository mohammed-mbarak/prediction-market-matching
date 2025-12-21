import { useState, useEffect, useRef } from 'react'
import { getOrderBook, getTrades } from '../services/api'

export const useRealtimeData = (refreshKey) => {
  const [orderBook, setOrderBook] = useState(null)
  const [trades, setTrades] = useState([])
  const [loading, setLoading] = useState(true)

  // Store previous data refs (no re-render)
  const prevOrderBookRef = useRef(null)
  const prevTradesRef = useRef(null)

  useEffect(() => {
    let isMounted = true

    const fetchAllData = async () => {
      try {
        const [orderBookData, tradesData] = await Promise.all([
          getOrderBook(),
          getTrades()
        ])

        if (!isMounted) return

        // Update order book only if changed
        if (
          JSON.stringify(prevOrderBookRef.current) !==
          JSON.stringify(orderBookData)
        ) {
          prevOrderBookRef.current = orderBookData
          setOrderBook(orderBookData)
        }

        // Update trades only if changed
        if (
          JSON.stringify(prevTradesRef.current) !==
          JSON.stringify(tradesData)
        ) {
          prevTradesRef.current = tradesData
          setTrades(tradesData)
        }

        setLoading(false)
      } catch (err) {
        console.error('Error fetching realtime data:', err)
      }
    }

    fetchAllData()
    const interval = setInterval(fetchAllData, 4000) // ✅ slower & smoother

    return () => {
      isMounted = false
      clearInterval(interval)
    }
  }, [refreshKey])

  return { orderBook, trades, loading }
}
