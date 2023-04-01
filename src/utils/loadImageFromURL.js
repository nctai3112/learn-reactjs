const loadImageFromURL = url => fetch(url)
  .then(response => response.blob())
  .then(blob => new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onloadend = () => resolve({ blob, base64: reader.result })
    reader.onerror = reject
    reader.readAsDataURL(blob)
  }))

export default loadImageFromURL