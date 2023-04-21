import React, {ReactNode, createContext, useContext, useState} from "react"
import {User} from "../firebase/types"


interface IUserContext {
  isLogin: boolean,
  setIsLogin: React.Dispatch<React.SetStateAction<boolean>>,
  user: User,
  setUser: React.Dispatch<React.SetStateAction<User>>

}

const userContext = createContext<IUserContext | null>(null)

export default userContext;

const UserProvider = (children: ReactNode) => {
  const [user, setUser] = useState<User>({
    name: "",
    activeRequests: 0
  })

  const [isLogin, setIsLogin] = useState<boolean>(false)

  const userContextValue = {
    user,
    setUser,
    isLogin,
    setIsLogin
  }

  return <userContext.Provider value={userContextValue}>{children}</userContext.Provider>
}

export {UserProvider}