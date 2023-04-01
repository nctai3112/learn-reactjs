var randomColor = () => ('#' + (Math.random() * 0xFFFFFF << 0).toString(16).padStart(6, '0')).toUpperCase()

export default randomColor