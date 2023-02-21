const nextConfig = {
  reactStrictMode: false,
  output: 'standalone',
  compiler: {
    removeConsole: process.env.NODE_ENV === "production"
  },
};

module.exports = nextConfig;
