import jsonServer from 'json-server';
import path from 'node:path';

const server = jsonServer.create();
const router = jsonServer.router(path.resolve('mock-api/db.json'));
const middlewares = jsonServer.defaults();

server.use(jsonServer.bodyParser);
server.use(middlewares);

server.post('/auth/login', (req, res) => {
  const { email, password } = req.body;
  if (email && password?.length >= 6) {
    return res.status(200).json({
      token: 'fake-jwt-token-123456',
      user: { id: 1, name: 'Admin', email }
    });
  }
  return res.status(401).json({ message: 'Identifiants invalides' });
});

server.use(router);
server.listen(3000, () => {
  console.log('Mock API running on http://localhost:3000');
});
