/** @type {import('next').NextConfig} */

const { locales, sourceLocale } = require('./lingui.config.js');

const nextConfig = {
  reactStrictMode: true,
  i18n: {
    locales,
    defaultLocale: sourceLocale,
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.po/,
      use: ['@lingui/loader'],
    });

    return config;
  },
};

module.exports = nextConfig;
