import axios from 'axios'
import createAuthRefreshInterceptor from 'axios-auth-refresh'

// Create axios instance.
const axiosInstance = axios.create({
  baseURL: process.env.API_URL,
  withCredentials: true,
})

// Create axios interceptor
createAuthRefreshInterceptor(axiosInstance, failedRequest =>
  axios.get(`${process.env.HOST || ''}/api/refreshToken`, {
    withCredentials: true,
    headers: {
      ...failedRequest.config.headers
    }
  })
  .then(resp => {
    const accessToken = resp.data.access
    const bearer = `Bearer ${accessToken}`

    axiosInstance.defaults.headers.common['Authorization'] = bearer
    failedRequest.response.config.headers.Authorization = bearer

    return Promise.resolve()
  }), { statusCodes: [ 401, 403 ] }
)

export default axiosInstance