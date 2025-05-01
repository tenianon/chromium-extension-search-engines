import { defineBackground } from 'wxt/sandbox'
import { browser } from 'wxt/browser'

type EngineUrlMap = {
  [key in SearchEngineName]: {
    suggestion: string
    url: string
  }
}

const searchEngineUrlMap: EngineUrlMap = {
  google: {
    suggestion:
      'https://suggestqueries.google.com/complete/search?client=chrome&q=',
    url: 'https://www.google.com/search?q=',
  },
  bing: {
    suggestion: 'https://api.bing.com/osjson.aspx?q=',
    url: 'https://www.bing.com/search?q=',
  },
}

async function getSearchSuggestions(
  searchEngine: SearchEngineName = 'bing',
  query = '',
) {
  try {
    if (searchEngine === 'google' && query.trim() === '') return []

    const response = await fetch(
      searchEngineUrlMap[searchEngine].suggestion + encodeURIComponent(query),
      { method: 'get' },
    )
    const data = await response.json()
    return data[1] || []
  } catch (error) {
    console.error('Error fetching search suggestions:', error)
    return []
  }
}

async function toSearchEngineUrl(
  searchEngine: SearchEngineName = 'bing',
  query = '',
  active = false,
) {
  const q = encodeURIComponent(query)
  if (q.trim() === '') return
  const url = searchEngineUrlMap[searchEngine].url + q
  active
    ? browser.tabs.create({
        url,
        active,
      })
    : browser.tabs.update({
        url,
        active,
      })
}

export default defineBackground(() => {
  browser.runtime.onMessage.addListener(
    (messages: any, sender, sendResponse) => {
      const { action, searchEngine, query, active } = messages
      switch (action) {
        case 'getSearchSuggestions':
          getSearchSuggestions(searchEngine, query)
            .then((suggestions) => sendResponse(suggestions))
            .catch((error) => sendResponse([]))
          break
        case 'toSearchEngineUrl':
          toSearchEngineUrl(searchEngine, query, active)
          sendResponse({ response: 'success' })
          break

        default:
          sendResponse({ response: `unknown action: ${action}` })
          break
      }

      return true
    },
  )
})
