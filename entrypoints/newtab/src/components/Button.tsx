import { memo } from 'react'
import { twMerge } from 'tailwind-merge'

interface ButtonProps
  extends React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  rounded?: boolean
}

const Button: React.FC<ButtonProps> = memo(
  ({ children, className, rounded = true, ...props }) => {
    return (
      <button
        {...props}
        className={twMerge(
          'cursor-pointer p-1.5 outline-0 text-left hover:bg-neutral-200/80 dark:hover:bg-neutral-500/20',
          rounded && 'rounded-full',
          className,
        )}
      >
        {children}
      </button>
    )
  },
)

export default Button
