/* eslint-disable no-restricted-imports */
import { URL } from 'url';
import mocks from './mocks/middleware.mock';

const createProxyConfig = (env, baseUrl) => (proxy) => {
  proxy.on('proxyReq', (proxyReq, req, res) => {
    const parsedUrl = new URL(req.url, baseUrl);
    console.log(new Date().toUTCString(), 'request', req.method, parsedUrl.href);
    if (env.USE_MOCK_MIDDLEWARE) {
      const mockHandler = mocks.find(
        (mock) => mock.pattern === parsedUrl.pathname && mock.method === req.method
      );
      if (mockHandler) {
        proxyReq.destroy({ stack: `mocked response for req: ${req.url}` });
        mockHandler.handle(req, res);
      }
    }
  });
};

/**
 * @param { ReturnType<getEnvVariables> } env
 * @returns { import('vite').ServerOptions }
 */
export const devServerSettings = (env) => {
  const url = new URL(env.BASE_URL);
  return {
    port: url.port,
    https: url.protocol === 'https:',
    proxy: {
      '/api': {
        target: env.VUE_APP_SERVICE_URL_PROXY,
        changeOrigin: true,
        secure: false,
        rewrite: (p) => p.replace(/^\/api/, ''),
        configure: createProxyConfig(env, env.VUE_APP_SERVICE_URL_PROXY),
      },
    },
    fs: {
      // Allow serving files from one level up to the project root, in order to show lx fonts in serving mode
      allow: ['..'],
    },
  };
};
