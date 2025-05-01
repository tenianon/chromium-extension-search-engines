import ThemeToggle from './component/ThemeToggle'

const ConfigMenu: React.FC<any> = () => {
  return (
    <div className='flex justify-end gap-x-4 px-4 py-3'>
      <ThemeToggle />
    </div>
  )
}

export default ConfigMenu
