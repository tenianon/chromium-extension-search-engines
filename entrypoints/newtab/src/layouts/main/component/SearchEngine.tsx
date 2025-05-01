import { useRef, useState, memo } from 'react'
import iconBing from '@/assets/bing.svg'
import iconGoogle from '@/assets/google.svg'
import { twMerge } from 'tailwind-merge'
import { useClickAway, useKeyPress } from 'ahooks'
import Button from '@/entrypoints/newtab/src/components/Button'
import { useConfig } from '@/entrypoints/newtab/src/components/ConfigProvider'

export const searchEngineIconMap: {
  [key in SearchEngineName]: string
} = {
  bing: iconBing,
  google: iconGoogle,
}

const SearchEngine = memo(() => {
  const { searchEngine, setSearchEngine } = useConfig()

  const [showSearchEnginePopup, setShowSearchEnginePopup] = useState(false)

  const popupRef = useRef<HTMLDivElement>(null)

  const handleCurrentSearchEngineClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    setShowSearchEnginePopup((p) => !p)
  }

  useKeyPress('shift.alt', () => {
    const searchEngineList = Object.keys(
      searchEngineIconMap,
    ) as SearchEngineName[]
    const currentIndex = searchEngineList.indexOf(searchEngine)
    const nextIndex = (currentIndex + 1) % searchEngineList.length
    setSearchEngine(searchEngineList[nextIndex])
  })

  useClickAway(() => {
    if (showSearchEnginePopup) {
      setShowSearchEnginePopup(false)
    }
  }, popupRef)

  console.log(' --- SearchEngines ---')

  return (
    <div className='flex items-center rounded-full select-none'>
      <Button
        onClick={handleCurrentSearchEngineClick}
        className='size-10'
      >
        <img
          alt=''
          className='size-full object-cover'
          src={searchEngineIconMap[searchEngine]}
        />
      </Button>
      <div
        ref={popupRef}
        className={twMerge([
          'absolute right-full w-max origin-right overflow-hidden duration-300',
          showSearchEnginePopup
            ? 'visible -translate-x-1.5 scale-100 opacity-100'
            : 'invisible translate-x-0 scale-0 opacity-0',
        ])}
      >
        <div
          className={twMerge([
            'flex gap-x-2 rounded-md bg-neutral-50 p-3.5 dark:bg-neutral-800',
          ])}
        >
          {(Object.keys(searchEngineIconMap) as SearchEngineName[]).map(
            (item) => (
              <div
                className={twMerge([
                  'size-7 cursor-pointer duration-300',
                  searchEngine === item ? 'grayscale-0' : 'grayscale-[0.95]',
                ])}
                key={item}
                onClick={() => setSearchEngine(item)}
              >
                <img
                  alt=''
                  className='size-full object-cover'
                  src={searchEngineIconMap[item]}
                />
              </div>
            ),
          )}
        </div>
      </div>
    </div>
  )
})

export default SearchEngine
