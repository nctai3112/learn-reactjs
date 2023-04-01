const backendURL = process.env.REACT_APP_BACKEND_URL

const ResponseCode = {
  SUCCESS: 'success',

  ERROR_PARAMS: 'error_params',
  ERROR_HEADER: 'error_header',
  ERROR_FORBIDDEN: 'error_forbidden',
}


const ANNOTATION_TYPE = {
  BBOX: 'BBOX',
  POLYGON: 'POLYGON',
  MASK: 'MASK',
}

const ENUM_ANNOTATION_TYPE = {
  BBOX: 1,
  POLYGON: 2,
  MASK: 3,
}

const DATASET_DATATYPE = {
  IMAGE: 'image',
  VIDEO: 'video',
}

export {
  backendURL,
  ResponseCode,

  ANNOTATION_TYPE,
  ENUM_ANNOTATION_TYPE,
  DATASET_DATATYPE
}