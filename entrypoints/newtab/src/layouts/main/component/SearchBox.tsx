import { twMerge } from 'tailwind-merge'
import { useState, useEffect, memo, useRef } from 'react'
import { useStateCallback } from '@/entrypoints/newtab/hooks/useStateCallback'
import { useKeyPress } from 'ahooks'
import { browser } from 'wxt/browser'
import { useConfig } from '@/entrypoints/newtab/src/components/ConfigProvider'
import Button from '@/entrypoints/newtab/src/components/Button'
import { PhMagnifyingGlass, PhX } from '@/entrypoints/newtab/src/components/icon'

interface SearchBoxProps {
  query?: string
  onInput?: (value: string) => void
}

const SearchBox: React.FC<SearchBoxProps> = memo(({ onInput, query = '' }) => {
  const [value, setValue] = useStateCallback(query)
  const [isComposite, setIsComposite] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement | null>(null)

  const { searchEngine } = useConfig()

  function sendSearchMessage(active = false) {
    browser.runtime.sendMessage({
      action: 'toSearchEngineUrl',
      searchEngine,
      query: value,
      active,
    })
  }

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
  }

  const onTextareaInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.currentTarget.value
    if (value === '\n') return

    setValue(value)

    if (isComposite) return
    onInput?.(value)
  }

  const onTextareaCompositionStart = () => {
    setIsComposite(true)
  }

  const onTextareaCompositionEnd = () => {
    setIsComposite(false)
    onInput?.(value)
  }
  const handleClearClick = () => {
    setValue('')
    onInput?.('')
  }

  useKeyPress('tab', (e) => {
    e.preventDefault()
    textareaRef.current?.focus()
  })

  useKeyPress(
    ['ctrl.enter', 'meta.enter'],
    (e) => {
      e.preventDefault()
      const textarea = e.target as HTMLTextAreaElement
      if (value.trim() === '') return
      const cursorPosition = textarea.selectionStart
      const textBefore = textarea.value.substring(0, cursorPosition)
      const textAfter = textarea.value.substring(cursorPosition)

      setValue(textBefore + '\n' + textAfter, () => {
        textarea.selectionStart = textarea.selectionEnd = cursorPosition + 1
      })
    },
    {
      exactMatch: true,
      target: textareaRef.current,
    },
  )

  useKeyPress(
    'enter',
    (e) => {
      e.preventDefault()
      sendSearchMessage()
    },
    {
      exactMatch: true,
      target: textareaRef.current,
    },
  )

  useKeyPress(
    'alt.enter',
    (e) => {
      e.preventDefault()
      sendSearchMessage(true)
    },
    {
      exactMatch: true,
      target: textareaRef.current,
    },
  )

  useEffect(() => {
    setValue(query)
    textareaRef.current?.focus()
  }, [query])

  console.log('--- Search Box ---')

  return (
    <form
      className='h-full'
      onSubmit={onSubmit}
    >
      <div className='flex h-full items-center gap-x-0.5'>
        <div className='relative h-full w-80'>
          <div className='absolute bottom-0 left-0 w-full rounded-t-md bg-neutral-50 dark:bg-neutral-800'>
            <div className='relative m-3 max-h-36 scroll-pr-4 overflow-hidden'>
              <textarea
                className='query-box-scrollbar absolute top-0 left-0 m-0 inline-block size-full min-w-0 resize-none bg-transparent align-bottom text-base break-words whitespace-pre-wrap outline-0 dark:caret-neutral-400'
                value={value}
                ref={textareaRef}
                autoFocus
                autoComplete='off'
                onInput={onTextareaInput}
                onCompositionStart={onTextareaCompositionStart}
                onCompositionEnd={onTextareaCompositionEnd}
              />
              <div className='pointer-events-none invisible static m-0 inline-block size-full min-h-6 resize-none overflow-hidden align-bottom text-base break-words whitespace-pre-wrap'>
                {value}
              </div>
            </div>
          </div>
        </div>
        {/* Clear */}
        <Button
          type='button'
          className={twMerge([
            'flex size-7 items-center justify-center text-base',
            value?.toString().trim() !== ''
              ? 'visible scale-100 opacity-100'
              : 'invisible scale-0 opacity-0',
          ])}
          onClick={handleClearClick}
        >
           <PhX />
        </Button>
        {/* Search */}
        <Button
          type='submit'
          className={twMerge([
            'flex size-8 items-center justify-center text-xl',
          ])}
          onClick={() => sendSearchMessage()}
        >
          <PhMagnifyingGlass />
        </Button>
      </div>
    </form>
  )
})

export default SearchBox
