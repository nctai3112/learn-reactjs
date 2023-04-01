import axios from 'axios'
import { backendURL } from '../constants/constants'

const RestConnector = () => {
  const instance = axios.create({ 
    baseURL: backendURL,
    headers: { },
  })

  instance.interceptors.response.use(
    function (response) {
      return response
    },
    function (err) {
      return Promise.reject(err.response || err)
    }
  )

  return instance
}

export default RestConnector()