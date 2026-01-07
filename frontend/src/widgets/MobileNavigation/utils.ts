export const isMobile = () => {
  return (
    window.innerWidth < 768 ||
    window.navigator.userAgent.includes('Mobile') ||
    window.navigator.userAgent.includes('Android') ||
    window.navigator.userAgent.includes('iPhone')
  )
}
