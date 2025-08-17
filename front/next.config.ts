/** @type {import('next').NextConfig} */
const nextConfig = {
  // Permite que Next.js optimice imágenes desde estos dominios.
  images: {
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

    webpack: (config) => {
    config.externals.push({
      sharp: 'commonjs sharp',
    });
    return config;
  },

  // Redirige las peticiones a la API del front-end hacia el back-end en Render.
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://agrotrack-develop.onrender.com/api/:path*', // Corregido para incluir /api/
      },
    ];
  },
};

module.exports = nextConfig;