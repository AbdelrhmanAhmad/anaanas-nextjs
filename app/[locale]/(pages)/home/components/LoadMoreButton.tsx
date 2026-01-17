'use client'
import useToggle from '@/hooks/useToggle'
import clsx from 'clsx'
import { Button } from 'react-bootstrap'

const LoadMoreButton = ({
  onClick,
  loading,
  disabled,
  label = 'Load more',
}: {
  onClick?: () => void | Promise<void>
  loading?: boolean
  disabled?: boolean
  label?: string
}) => {
  // Backwards compatible: if no onClick passed, keep old toggle behavior
  const { isTrue: isLoadButton, toggle } = useToggle()
  const isBusy = loading ?? isLoadButton
  const handleClick = () => {
    if (disabled) return
    if (onClick) {
      void onClick()
      return
    }
    toggle()
  }
  return (
    <Button
      onClick={handleClick}
      variant="primary-soft"
      role="button"
      disabled={!!disabled || !!isBusy}
      className={clsx('btn-loader', { active: isBusy })}
      data-bs-toggle="button"
      aria-pressed="true">
      <span className="load-text"> {label} </span>
      <div className="load-icon">
        <div className="spinner-grow spinner-grow-sm" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    </Button>
  )
}
export default LoadMoreButton
