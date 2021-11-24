import React, { useState, createContext, useMemo, useCallback, useRef } from 'react';



export const AppContext = createContext()





export default function ContextProvider(props) {


  return <AppContext.Provider value={{
   
  }}>
    {props.children}
  </AppContext.Provider>


}