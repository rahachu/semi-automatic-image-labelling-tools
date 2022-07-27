import axios from 'axios'
import { withIronSessionApiRoute } from 'iron-session/next'
import { sessionOptions } from 'lib/session'
import { NextApiRequest, NextApiResponse } from 'next'

const refreshTokenRoute = async (req: NextApiRequest, res: NextApiResponse) => {
  const { session } = req
  try {
    const {data, headers: returnedHeaders} = await axios.post(
      `${process.env.API_URL}/api/auth/refresh`, // refresh token Node.js server path
      {
        refresh: session.refresh
      },
      {
        withCredentials: true,
        headers: {
          Accept: '*/*',
          'Content-Type': 'application/json',
          Origin: `${process.env.HOST}`,
          Cookie: req.headers.cookie || ''
        },
      },
    )

    res.status(200).send(data)
  } catch (error) {
    // we don't want to send status 401 here.
    res.send(error)
  }
}

export default withIronSessionApiRoute(refreshTokenRoute, sessionOptions)
