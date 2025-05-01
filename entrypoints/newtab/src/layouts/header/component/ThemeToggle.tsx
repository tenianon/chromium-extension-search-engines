import {
  usePersonalize,
  type Theme,
} from '@/entrypoints/newtab/src/components/PersonalizeProvider'
import Button from '@/entrypoints/newtab/src/components/Button'
import { JSX, useRef, useState } from 'react'
import { useClickAway } from 'ahooks'
import {
  IconoirSunLight,
  IconoirMoonSat,
  IconoirAppleImac2021,
} from '@/entrypoints/newtab/src/components/icon'

const themeMap: {
  [key in Theme]: JSX.Element
} = {
  light: <IconoirSunLight className='size-5'/>,
  dark: <IconoirMoonSat className='size-5'/>,
  system: <IconoirAppleImac2021 className='size-5'/>,
}

const ThemeToggle: React.FC<any> = () => {
  const { theme, setTheme } = usePersonalize()
  const popupRef = useRef<HTMLDivElement>(null)

  const [showThemePopup, setShowThemePopup] = useState(false)

  const handleCurrentThemeClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    setShowThemePopup((p) => !p)
  }

  useClickAway(() => {
    if (showThemePopup) {
      setShowThemePopup(false)
    }
  }, popupRef)

  return (
    <div className='relative'>
      <Button
        className='flex size-8 items-center justify-center p-0 text-xl'
        onClick={handleCurrentThemeClick}
      >
        {themeMap[theme]}
      </Button>
      {showThemePopup && (
        <div
          ref={popupRef}
          className='absolute top-10 right-0 flex w-28 flex-col rounded-md bg-neutral-50 p-2 dark:bg-neutral-800'
        >
          {(Object.keys(themeMap) as Theme[]).map((item) => (
            <Button
              key={item}
              className='flex items-center gap-x-2 rounded p-1.5 text-sm'
              rounded={false}
              onClick={() => setTheme(item)}
            >
              <div className='shrink-0 text-lg'>{themeMap[item]}</div>
              <span className='capitalize'>{item}</span>
            </Button>
          ))}
        </div>
      )}
    </div>
  )
}

export default ThemeToggle
