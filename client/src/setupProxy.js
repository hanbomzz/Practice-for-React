const { createProxyMiddleware } = require('http-proxy-middleware');

//client와 server의 포트번호가 달라서 CORS 이슈가 나는 것을
//Proxy 설정을 통해 origin 포트번호를 변경해줌
//Proxy server - 클라이언트에서 서버로 접속을 할 때 직접적으로 접속하지 않고 중간에 대신 전달해주는 서버
module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://localhost:5000',
      changeOrigin: true,
    })
  );
};