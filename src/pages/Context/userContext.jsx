import React, { createContext, useState } from 'react'

export const userContext=createContext([])


const UseProvider = ({children}) => {
    const [userdata,setuserdata]=useState()
  return (
   <userContext.Provider value={{userdata,setuserdata}}>
     {children}
   </userContext.Provider>
  )
}

export default UseProvider

