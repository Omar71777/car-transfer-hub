
export const SIDEBAR_COOKIE_NAME = "sidebar:state"
export const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7 // 7 days
export const SIDEBAR_KEYBOARD_SHORTCUT = "b"

/**
 * Sets the sidebar state in a cookie
 */
export function setSidebarCookie(value: boolean) {
  document.cookie = `${SIDEBAR_COOKIE_NAME}=${value}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`
}

/**
 * Gets the sidebar state from cookies
 */
export function getSidebarCookie(): boolean | null {
  const match = document.cookie.match(new RegExp(`(^| )${SIDEBAR_COOKIE_NAME}=([^;]+)`))
  if (match) {
    return match[2] === "true"
  }
  return null
}
