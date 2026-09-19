/** @type {import('next').NextConfig} */
const isGithubActions = process.env.GITHUB_ACTIONS || false
let basePath = ""

if (isGithubActions) {
  const repo = process.env.GITHUB_REPOSITORY?.split("/")[1] || "Pakistani-Student-Schemes"
  basePath = `/${repo}`
}

const nextConfig = {
  output: "export",
  basePath: basePath,
  trailingSlash: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
