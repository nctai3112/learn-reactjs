const checkIsMobileDevice = () =>  !!('ontouchstart' in window || navigator.msMaxTouchPoints)

export default checkIsMobileDevice