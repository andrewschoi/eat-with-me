import React, {ReactNode, createContext, useEffect, useState} from "react"
import {User} from "../firebase/types"
import * as BE from "../firebase/common"
import * as Location from "expo-location"

interface IUserContext {
  user: User | null,
  setUser: React.Dispatch<React.SetStateAction<User | null>>
  locations: string[]
}

const userContext = createContext<IUserContext | null>(null)

export default userContext;

const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [locations, setLocations] = useState<string[]>([])

  useEffect(() => {
    const getPermissions = async () => {
      const {status} = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        return
      }
      const currentLocation = await Location.getCurrentPositionAsync({})
      const locationsInRadius = BE.getLocationsInRadius(currentLocation)
      setLocations(locationsInRadius)
    }
    getPermissions()
  }, [])

  const userContextValue = {
    user,
    setUser,
    locations
  }

  return <userContext.Provider value={userContextValue}>{children}</userContext.Provider>
}

export {UserProvider}