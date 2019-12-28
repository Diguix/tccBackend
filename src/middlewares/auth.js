const jwt = require('jsonwebtoken');
const jwtSecret = process.env.JWT_SECRET;

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).send({ error: 'Token nao fornecido' });
  }
  const parts = authHeader.split(' ');

  if (!parts.lenght === 2) {
    return res.status(401).send({ error: 'Erro no Token' });
  }

  const [schema, token] = parts;
  if (!/^Bearer$/i.test(schema)) {
    return res.status(401).send({ error: 'Token mau formatado' });
  }

  jwt.verify(token, jwtSecret, (err, decoded) => {
    if (err) return res.status(401).send({ error: 'Token invalido' });

    req.userId = decoded.params.id;
    console.log(req.userId);
    return next();
  });
};
