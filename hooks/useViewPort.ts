import { useState, useEffect } from 'react'

/** Desktop-first default keeps sidebar/content in SSR HTML for crawlers. */
const SSR_DEFAULT_WIDTH = 1200
const SSR_DEFAULT_HEIGHT = 800

const useViewPort = () => {
  const [width, setWidth] = useState(SSR_DEFAULT_WIDTH)
  const [height, setHeight] = useState(SSR_DEFAULT_HEIGHT)

  useEffect(() => {
    const handleWindowResize = () => {
      setWidth(window.innerWidth)
      setHeight(window.innerHeight)
    }

    handleWindowResize()
    window.addEventListener('resize', handleWindowResize)
    return () => window.removeEventListener('resize', handleWindowResize)
  }, [])

  return { width, height }
}

export default useViewPort
