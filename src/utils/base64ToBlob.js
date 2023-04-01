const base64ToBlob = (base64) => {
  if (!base64) {
    return null
  }
  return fetch(base64)
  .then(res => res.blob())
}

export default base64ToBlob