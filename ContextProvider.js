import React, { useState, createContext, useMemo, useCallback, useRef } from 'react';



export const Context = createContext()

const list = [
  { name: "a", description: "fewfas", key: Math.random() },
  { name: "b", description: "fewf的话就开始as", key: Math.random() },
  { name: "c", description: "fewfas", key: Math.random() },
  { name: "d", description: "fewfas", key: Math.random() },
  { name: "e", description: "fewfas", key: Math.random() },
  { name: "f", description: "fewfas", key: Math.random() },
  { name: "g", description: "fewfas", key: Math.random() },
  { name: "h", description: "as是as", key: Math.random() },
  { name: "i", description: "fewfas", key: Math.random() },
  { name: "j", description: "fewfas", key: Math.random() },
  { name: "k", description: "fewfas", key: Math.random() },
  { name: "l", description: "fewfas", key: Math.random() },
  { name: "m", description: "fewfas", key: Math.random() },
  { name: "n", description: "s ewfas", key: Math.random() },
  { name: "o", description: "fewd fas", key: Math.random() },
  { name: "p", description: "feds wfas", key: Math.random() },
  { name: "q", description: "few dfas", key: Math.random() },
  // { name: "r", description: "s ewfas", key: Math.random() },
  // { name: "s", description: "fewd fas", key: Math.random() },
  // { name: "t", description: "feds wfas", key: Math.random() },
  // { name: "u", description: "few dfas", key: Math.random() },
  // { name: "v", description: "feds wfas", key: Math.random() },
  // { name: "w", description: "few dfas", key: Math.random() },
  // { name: "x", description: "s ewfas", key: Math.random() },
  // { name: "y", description: "fewd fas", key: Math.random() },
  // { name: "z", description: "feds wfas", key: Math.random() },
  // { name: "A", description: "few dfas", key: Math.random() },

]




export default function ContextProvider(props) {


  const [peopleList,setPeopleList] = useState(list)




  return <Context.Provider value={{
   
    peopleList,
    setPeopleList,

  }}>
    {props.children}
  </Context.Provider>


}