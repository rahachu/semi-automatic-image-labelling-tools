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
    // 1a. Clear old helper cookie used in 'authorize.ts' higher order function.
    // if (axiosInstance.defaults.headers.setCookie) {
    //   delete axiosInstance.defaults.headers.setCookie
    // }
    const accessToken = resp.data.access
    // // 2. Set up new access token
    const bearer = `Bearer ${accessToken}`
    // axiosInstance.defaults.headers.Authorization = bearer

    axiosInstance.defaults.headers.common['Authorization'] = bearer

    // // 3. Set up new refresh token as cookie
    // const responseCookie = setCookie.parse(resp.headers['set-cookie'])[0] // 3a. We can't just acces it, we need to parse it first.
    // axiosInstance.defaults.headers.setCookie = resp.headers['set-cookie'] // 3b. Set helper cookie for 'authorize.ts' Higher order Function.
    // axiosInstance.defaults.headers.cookie = cookie.serialize(
    //   responseCookie.name,
    //   responseCookie.value,
    // )
    // // 4. Set up access token of the failed request.
    failedRequest.response.config.headers.Authorization = bearer

    return Promise.resolve()
  }), { statusCodes: [ 401, 403 ] }
)

export default axiosInstance