import { twMerge } from 'tailwind-merge'
import React, { useEffect, useState } from 'react'
import SearchEngine from './component/SearchEngine'
import SearchBox from './component/SearchBox'
import SearchSuggest from './component/SearchSuggest'
import { useConfig } from '@/entrypoints/newtab/src/components/ConfigProvider'
import { useThrottleFn } from 'ahooks'

const SearchBar: React.FC<any> = () => {
  const [query, setQuery] = useState('')

  const [suggestValue, setSuggestValue] = useState('')

  const { searchEngine } = useConfig()

  const [suggestionList, setSuggestionList] = useState<string[]>([])

  function getSearchSuggestions(searchEngine: SearchEngineName, query: string) {
    chrome.runtime.sendMessage(
      { action: 'getSearchSuggestions', searchEngine, query },
      (data) => {
        setSuggestionList(data)
      },
    )
  }

  const { run } = useThrottleFn(
    (searchEngine: SearchEngineName, query: string) => {
      getSearchSuggestions(searchEngine, query)
    },
    { wait: 500 },
  )

  const onSearchBoxInput = (value: string) => {
    run(searchEngine, value)
    setQuery(value)
  }

  useEffect(() => {
    getSearchSuggestions(searchEngine, query)
  }, [searchEngine])

  return (
    <div className='flex flex-col rounded-md shadow'>
      <div
        className={twMerge([
          'relative flex h-12 items-center bg-neutral-50 px-2 outline-0 dark:bg-neutral-800',
          suggestionList.length > 0 ? 'rounded-t-md' : 'rounded-md',
        ])}
      >
        <SearchEngine />
        <SearchBox
          onInput={onSearchBoxInput}
          query={suggestValue}
        />
      </div>
      {suggestionList.length > 0 && (
        <SearchSuggest
          keyword={query}
          value={suggestionList}
          onSuggestSelect={setSuggestValue}
        />
      )}
    </div>
  )
}

export default SearchBar
