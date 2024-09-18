import { createContext, useContext, useState, useEffect, PropsWithChildren } from 'react'
import { getCurrentUser } from '@/lib/appwrite'
import { Models } from 'react-native-appwrite'

type AppContext = {
  isLoggedIn: boolean
  setIsLoggedIn: (val: boolean) => void
  isLoading: boolean
  setIsLoading: (val: boolean) => void
}

const GlobalContext = createContext<AppContext>({
  isLoggedIn: false,
  isLoading: false,
  setIsLoading: () => {},
  setIsLoggedIn: () => {},
})

export const useGlobalContext = () => useContext(GlobalContext)

const GlobalProvider = (props: PropsWithChildren) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState<Models.Document>()
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    getCurrentUser()
      .then(user => {
        setIsLoggedIn(user ? true : false)
        setUser(user ? user : undefined)
      })
      .catch(err => console.log(err))
      .finally(() => setIsLoading(false))
  }, [])

  return (
    <GlobalContext.Provider
      value={{
        isLoggedIn,
        isLoading,
        setIsLoading,
        setIsLoggedIn,
      }}
    >
      {props.children}
    </GlobalContext.Provider>
  )
}

export default GlobalProvider
