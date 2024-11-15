// proxy.js
const http = require('http');
const httpProxy = require('http-proxy');

// Create a proxy server
const proxy = httpProxy.createProxyServer({});

// Create a local server
const server = http.createServer((req, res) => {
  // Here, we will proxy all requests to the target URL
  // You can customize this to filter or modify requests
  const targetUrl = req.url.includes('google.com') 
    ? 'https://www.google.com' 
    : 'https://www.linkedin.com'; // Replace with your desired default target

  // Use the proxy to forward the request to the target URL
  proxy.web(req, res, { target: targetUrl, changeOrigin: true }, (error) => {
    console.error('Proxy error:', error);
    res.writeHead(502);
    res.end('Bad Gateway');
  });
});

// Listen on port 3001
const PORT = 3001;
server.listen(PORT, () => {
  console.log(`Proxy server is running on http://localhost:${PORT}`);
});
