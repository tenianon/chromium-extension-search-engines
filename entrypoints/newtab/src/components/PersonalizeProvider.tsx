import colors from 'tailwindcss/colors'
import {
  createContext,
  useContext,
  useEffect,
  useLayoutEffect,
  useState,
} from 'react'

export type Theme = 'dark' | 'light' | 'system'

export type Color = keyof typeof colors

interface PersonalizeContextProps {
  theme: Theme
  color: Color
  darkTheme: boolean
  setTheme: React.Dispatch<React.SetStateAction<Theme>>
  setColor: React.Dispatch<React.SetStateAction<Color>>
}

interface PersonalizeProviderProps {
  children: React.ReactNode | ((data: PersonalizeContextProps) => React.ReactNode)
  defaultTheme?: Theme
  defaultColor?: Color
  storageColorKey?: string
  storageThemeKey?: string
  onMounted?: () => void
}

export const twColor = colors

export const PersonalizeContext = createContext<PersonalizeContextProps | undefined>(undefined)

const rootElement = window.document.documentElement

const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

export const PersonalizeProvider: React.FC<PersonalizeProviderProps> = ({
  children,
  defaultTheme = 'system',
  defaultColor = 'neutral',
  storageThemeKey = 'theme',
  storageColorKey = 'color',
  onMounted,
  ...props
}) => {
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem(storageThemeKey) as Theme) || defaultTheme,
  )

  const [darkTheme, setDarkTheme] = useState(
    () =>
      localStorage[storageThemeKey] === 'dark' ||
      (!(storageThemeKey in localStorage) && mediaQuery.matches),
  )

  const [color, setColor] = useState<Color>(
    () => (localStorage.getItem(storageColorKey) as Color) || defaultColor,
  )

  const value = {
    theme,
    color,
    setTheme,
    darkTheme,
    setColor,
  }

  const renderChildren =
    typeof children === 'function' ? children(value) : children

  const modifyClass = () => {
    if (
      localStorage[storageThemeKey] === 'dark' ||
      (!(storageThemeKey in localStorage) && mediaQuery.matches)
    ) {
      setDarkTheme(true)
      rootElement.classList.add('dark')
    } else {
      setDarkTheme(false)
      rootElement.classList.remove('dark')
    }
  }

  const modifyThemeFromStorage = () => {
    const storageTheme = localStorage[storageThemeKey] as Theme
    if (['light', 'dark'].includes(storageTheme)) {
      setTheme(storageTheme)
    } else {
      setTheme('system')
    }
  }

  useEffect(() => {
    if (theme === 'system') {
      localStorage.removeItem(storageThemeKey)
    } else if (['light', 'dark'].includes(theme)) {
      localStorage[storageThemeKey] = theme
    }

    modifyClass()
  }, [theme])

  useEffect(() => {
    localStorage[storageColorKey] = color
  }, [color])

  useLayoutEffect(() => {
    mediaQuery.addEventListener('change', modifyClass)

    window.addEventListener('storage', modifyThemeFromStorage)

    onMounted?.()

    return () => {
      mediaQuery.removeEventListener('change', modifyClass)

      window.removeEventListener('storage', modifyThemeFromStorage)
    }
  }, [])

  return (
    <PersonalizeContext.Provider
      value={value}
      {...props}
    >
      {renderChildren}
    </PersonalizeContext.Provider>
  )
}

export default PersonalizeProvider

export const usePersonalize = () => {
  const context = useContext(PersonalizeContext)

  if (context === undefined)
    throw new Error('usePersonalize must be used within a PersonalizeProvider')

  return context
}
