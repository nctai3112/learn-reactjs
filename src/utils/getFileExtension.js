const getFileExtension = (filename) => {
  var a = filename.toLowerCase().split(".");
  if (a.length === 1 || (a[0] === "" && a.length === 2)) {
    return "";
  }
  return a.pop();
}

export default getFileExtension