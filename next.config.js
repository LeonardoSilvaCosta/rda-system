/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.postimg.cc',
        port: '',
        pathname: '/**'
      },
      {
        protocol: 'https',
        hostname: 'jfzcpicztjnxtltzxbkc.supabase.co',
        port: '',
        pathname: '/**'
      }
    ]
  }
};

module.exports = nextConfig;
