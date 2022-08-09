import axiosInstance from '@/lib/axios'
import { User } from '@/types/User'
import axios, { AxiosRequestHeaders } from 'axios'
import { withIronSessionApiRoute } from 'iron-session/next'
import { sessionOptions } from 'lib/session'
import { NextApiRequest, NextApiResponse } from 'next'

const registerRoute = async (req: NextApiRequest, res: NextApiResponse) => {
  const { headers, body } = req

  try {
    const { data, headers: returnedHeaders } = await axios.post(
      `${process.env.API_URL}/api/auth/register`,
      body,
      {
        headers: {
          Accept: '*/*',
          'Content-Type': 'application/json'
        },
      }
    )
    
    const user: User = { isLoggedIn: true, ...data.user }
    req.session.user = user
    req.session.access = data.token
    axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${data.token}`
    req.session.refresh = data.refresh
    await req.session.save()

    res.send({...user, Authorization: `Bearer ${data.token}`})
  } catch (error) {
    if (axios.isAxiosError(error)) {
        res.status(error.response?.status || 500).json(error.response?.data)
    } else {
        res.status(500).json(error)
    }
  }
}

export default withIronSessionApiRoute(registerRoute, sessionOptions)
