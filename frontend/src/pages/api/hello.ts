// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import axios, { AxiosRequestHeaders } from 'axios'
import axiosInstance from '@/lib/axios'
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
  name: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { data, headers } = await axios.get(`${process.env.API_URL}/api/`)
  const { data: userData, headers: a } = await axiosInstance.get('/api/auth')
  // (userData)
  // console.log(a)
  // console.log(headers)
  res.status(200).json(data)
}
