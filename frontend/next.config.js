/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  images: {
    domains: ['localhost'],
  },
  async rewrites() {
    return [
      {
        source: '/backend/:path*',
        destination: 'http://localhost:8000/:path*' // Proxy to Backend
      }
    ]
  }
}
