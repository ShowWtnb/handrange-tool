/** @type {import('next').NextConfig} */

const branchName = process.env.BRANCH_NAME ? "/" + process.env.BRANCH_NAME : "";

const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  assetPrefix: branchName,
  basePath: branchName,
}

module.exports = nextConfig
