import { useKeyPress } from 'ahooks'
import { twMerge } from 'tailwind-merge'
import { memo, useEffect } from 'react'
import { useStateCallback } from '@/entrypoints/newtab/hooks/useStateCallback'
import { browser } from 'wxt/browser'
import { useConfig } from '@/entrypoints/newtab/src/components/ConfigProvider'

import HighlightText from '@/entrypoints//newtab/src/components/HighlightText'
import { PhMagnifyingGlassLight } from '@/entrypoints//newtab/src/components/icon'

interface SearchSuggestProps {
  keyword?: string
  value?: string[]
  onSuggestSelect?: (query: string) => void
}

const SearchSuggest: React.FC<SearchSuggestProps> = memo(
  ({ keyword, value, onSuggestSelect }) => {
    const [highlightIndex, setHighlightIndex] = useStateCallback(-1)

    const { searchEngine } = useConfig()

    const handleSuggestClick = (
      e: React.MouseEvent<HTMLDivElement, MouseEvent>,
      query: string,
    ) => {
      browser.runtime.sendMessage({
        action: 'toSearchEngineUrl',
        searchEngine,
        query,
        active: e.ctrlKey,
      })
    }

    useKeyPress(['ctrl.uparrow', 'meta.uparrow'], (e) => {
      e.preventDefault()
      setHighlightIndex(
        (prev) => {
          if (!value || value.length === 0) return -1
          return (prev - 1 + value.length) % value.length
        },
        (v) => {
          value && onSuggestSelect?.(value[v])
        },
      )
    })

    useKeyPress(['ctrl.downarrow', 'meta.downarrow'], (e) => {
      e.preventDefault()
      setHighlightIndex(
        (prev) => {
          if (!value || value.length === 0) return -1
          return (prev + 1) % value.length
        },
        (v) => {
          value && onSuggestSelect?.(value[v])
        },
      )
    })

    useEffect(() => {
      setHighlightIndex(-1)
    }, [value])

    console.log('--- SearchSuggestion ---')
    return (
      <div className='suggestion-scrollbar max-h-96 max-w-[440px] overflow-x-hidden rounded-b-md bg-neutral-50 dark:bg-neutral-800'>
        {value &&
          value.map((item, index) => (
            <div
              key={item}
              className={twMerge([
                'flex cursor-pointer items-center gap-x-2 px-4 py-2',
                highlightIndex === index &&
                  'bg-neutral-200/40 dark:bg-neutral-700/60',
              ])}
              onMouseEnter={() => setHighlightIndex(index)}
              onClick={(e) => handleSuggestClick(e, item)}
            >
              <div
                className={twMerge([
                  'flex text-xl',
                  highlightIndex === index
                    ? 'dark:text-neutral-300'
                    : 'dark:text-neutral-400',
                ])}
              >
                <PhMagnifyingGlassLight className='size-5' />
              </div>
              <HighlightText
                keywords={[keyword || '']}
                className={twMerge([
                  'text-sm',
                  keyword?.trim() !== '' && 'font-bold',
                ])}
                keywordClassName='font-normal'
              >
                {item}
              </HighlightText>
            </div>
          ))}
      </div>
    )
  },
)
export default SearchSuggest
