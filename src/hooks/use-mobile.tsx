
import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    
    // Check on initial render
    checkIfMobile()
    
    // Add event listener with debounce to avoid performance issues
    let resizeTimer: ReturnType<typeof setTimeout>
    const handleResize = () => {
      clearTimeout(resizeTimer)
      resizeTimer = setTimeout(checkIfMobile, 100)
    }

    window.addEventListener("resize", handleResize)
    
    // Create a MediaQueryList object
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    
    // MediaQueryList change event
    const handleMediaChange = () => {
      setIsMobile(mql.matches)
    }
    
    mql.addEventListener("change", handleMediaChange)
    
    return () => {
      window.removeEventListener("resize", handleResize)
      mql.removeEventListener("change", handleMediaChange)
      clearTimeout(resizeTimer)
    }
  }, [])

  // Always return a boolean even if state is undefined initially
  return !!isMobile
}
