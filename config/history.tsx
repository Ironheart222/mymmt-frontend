import { useRouter } from 'next/router'
import React, { createContext, useState, useEffect, useContext } from 'react'

interface HValidation {
  history: string[]
  setHistory(data: string[]): void
  back(): void
}

const HistoryContext = createContext<HValidation>({} as HValidation)
export const HistoryProvider: React.FC = ({ children }) => {
  const { asPath, push, pathname } = useRouter()
  const [history, setHistory] = useState<string[]>([])

  function back() {
    for (let i = history.length - 2; i >= 0; i--) {
      const route = history[i]
      if (route !== pathname) {
        push(route)

        // if you want to pop history on back
        const newHistory = history.slice(0, i)
        setHistory(newHistory)

        break
      }
    }
  }
  console.log("history", history);
  

  useEffect(() => {
    console.log("asPath", asPath);
    setHistory(previous => [...previous, asPath])
  }, [asPath])

  return (
    <HistoryContext.Provider
      value={{
        back,
        history,
        setHistory,
      }}
    >
      {children}
    </HistoryContext.Provider>
  )
}

export function useHistory(): HValidation {
  const context = useContext(HistoryContext)
  return context
}