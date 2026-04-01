/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Uncomment and set this if deploying to a repo (not root domain)
  // basePath: '/your-repo-name',
}

export default nextConfig
