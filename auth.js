const jwt = require('jsonwebtoken');
const jwksClient = require('jwks-rsa');

const KEYCLOAK_URL = process.env.KEYCLOAK_URL || 'http://localhost:8081';

const client = jwksClient({
  jwksUri: `${KEYCLOAK_URL}/realms/math-realm/protocol/openid-connect/certs`,
  cache: true,
  rateLimit: true
});

function getKey(header, callback) {
  client.getSigningKey(header.kid, (err, key) => {
    if (err) return callback(err);
    const signingKey = key.getPublicKey() || key.rsaPublicKey;
    callback(null, signingKey);
  });
}

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Access Denied: Missing or malformed Bearer token' });
  }

  const token = authHeader.split(' ')[1];

  jwt.verify(token, getKey, { algorithms: ['RS256'] }, (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: 'Access Denied: Invalid or expired token', details: err.message });
    }

    // --- RBAC Check ---
    const roles = decoded.realm_access?.roles || [];
    if (!roles.includes('math-user')) {
      return res.status(403).json({ error: 'Access Denied: Missing required [math-user] role' });
    }

    req.user = decoded;
    next();
  });
};

module.exports = verifyToken;
