/** @type {import('next').NextConfig} */
const nextConfig = {
  // Tu configuración de 'images'
  images: {
    domains: ['res.cloudinary.com', 'plus.unsplash.com'],
  },

  // Tu configuración de 'rewrites' para el proxy
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://agrotrack-develop.onrender.com/:path*',
      },
    ];
  },
};

module.exports = nextConfig;