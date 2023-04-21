import React, {ReactNode, createContext, useEffect, useState} from "react"
import {User} from "../firebase/types"
import * as Location from "expo-location"

interface IUserContext {
  isLogin: boolean,
  setIsLogin: React.Dispatch<React.SetStateAction<boolean>>,
  user: User | null,
  setUser: React.Dispatch<React.SetStateAction<User | null>>
  location: Location.LocationObject | null
}

const userContext = createContext<IUserContext | null>(null)

export default userContext;

const UserProvider = (children: ReactNode) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLogin, setIsLogin] = useState<boolean>(false)
  const [location, setLocation] = useState<Location.LocationObject | null>(null)

  useEffect(() => {
    const getPermissions = async () => {
      const {status} = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        return
      }
      const currentLocation = await Location.getCurrentPositionAsync({})
      setLocation(currentLocation)
    }
    getPermissions()
  }, [])

  const userContextValue = {
    user,
    setUser,
    isLogin,
    setIsLogin,
    location
  }

  return <userContext.Provider value={userContextValue}>{children}</userContext.Provider>
}

export {UserProvider}