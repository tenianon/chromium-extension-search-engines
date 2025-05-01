import { createContext, useContext, useEffect, useState } from 'react'

export type SearchEngineName = 'google' | 'bing'

interface ConfigContextProps {
  searchEngine: SearchEngineName
  setSearchEngine: React.Dispatch<React.SetStateAction<SearchEngineName>>
}

interface ConfigProviderProps {
  defaultSearchEngine?: SearchEngineName
  storageSearchEngineKey?: string
  children?: React.ReactNode
}

export const ConfigContext = createContext<ConfigContextProps | undefined>(undefined)

export const ConfigProvider: React.FC<ConfigProviderProps> = ({
  defaultSearchEngine = 'bing',
  storageSearchEngineKey = 'searchEngine',
  children,
  ...props
}) => {
  const [searchEngine, setSearchEngine] = useState<SearchEngineName>(
    () =>
      (localStorage.getItem(storageSearchEngineKey!) as SearchEngineName) ||
      defaultSearchEngine,
  )

  const value = {
    searchEngine,
    setSearchEngine,
  }

  useEffect(() => {
    localStorage[storageSearchEngineKey!] = searchEngine
  }, [searchEngine])

  return (
    <ConfigContext.Provider
      value={value}
      {...props}
    >
      {children}
    </ConfigContext.Provider>
  )
}

export default ConfigProvider

export const useConfig = () => {
  const context = useContext(ConfigContext)

  if (context === undefined)
    throw new Error('useConfig must be used within a ConfigProvider')

  return context
}
