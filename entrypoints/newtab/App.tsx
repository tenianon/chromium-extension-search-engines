import SearchBar from './src/layouts/main/SearchBar'
import OptionsMenu from './src/layouts/header/OptionsMenu'
import texture from '@/assets/texture.png'
import pot from '@/assets/pot.png'
import ConfigProvider from './src/components/ConfigProvider'
import PersonalizeProvider from './src/components/PersonalizeProvider'

function configMounted() {
  requestIdleCallback(() => {
    window.document.documentElement.setAttribute('data-effect', 'duration')
  })
}

function App() {
  return (
    <ConfigProvider>
      <PersonalizeProvider onMounted={configMounted}>
        <div className='relative h-screen overflow-hidden bg-neutral-100 dark:bg-neutral-900'>
          <div
            className='pointer-events-none fixed top-0 left-0 z-10 size-full'
            style={{
              backgroundImage: `url(${pot})`,
              opacity: 0.03,
            }}
          ></div>
          <OptionsMenu />
          <div className='flex justify-center pt-56'>
            <SearchBar />
          </div>
        </div>
      </PersonalizeProvider>
    </ConfigProvider>
  )
}

export default App
