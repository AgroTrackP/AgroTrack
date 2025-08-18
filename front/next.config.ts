/** @type {import('next').NextConfig} */
const nextConfig = {
  // Permite que Next.js optimice imágenes desde estos dominios.
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: 'plus.unsplash.com',
      },
    ],
  },
  
  // Redirige las peticiones a la API del front-end hacia el back-end en Render.
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://agrotrack-develop.onrender.com/:path*', // Corregido para incluir /api/
      },
    ];
  },
};

module.exports = nextConfig;