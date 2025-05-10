/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  
  // Optional: Add basePath if your app is not deployed at the root domain
  // basePath: '/your-subdirectory',
  
  // Enable trailing slashes for better compatibility with static servers
  trailingSlash: true,
  
  // Add images configuration if you're using Next.js Image Optimization
  images: {
    unoptimized: true, // Required for static exports
  },
  
  // Enable this if you need to redirect in a static export
  // skipTrailingSlashRedirect: true,
  
  // Optional: Add rewrites if you have API routes
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL}/api/:path*`,
      },
    ]
  },
}

module.exports = nextConfig



// /** @type {import('next').NextConfig} */
// const nextConfig = {
//     output: 'export',
//   };
  
//   module.exports = nextConfig;
  