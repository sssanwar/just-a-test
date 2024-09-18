import { useEffect, useState } from 'react'
import { Alert } from 'react-native'

export const useAppWrite = <T>(fn: () => Promise<T[]>) => {
  const [data, setData] = useState<T[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const fetchData = async () => {
    setIsLoading(true)
    try {
      const res = await fn()
      setData(res)
    } catch (err: any) {
      Alert.alert('Error', err.message)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  return { data, isLoading, fetchData }
}
