function bufferArrayToBase64(arrayBuffer, mimetype = "image/jpeg") {
  let u8 = new Uint8Array(arrayBuffer)
  let b64encoded = btoa([].reduce.call(u8, function (p, c) { return p + String.fromCharCode(c) }, ''))
  return "data:" + mimetype + ";base64," + b64encoded
}

export default bufferArrayToBase64