const crypto = require("crypto");

const getAuthSecret = () => process.env.AUTH_TOKEN_SECRET || "mindgarden-dev-secret";

const base64Url = (value) => Buffer.from(value).toString("base64url");

const signPayload = (payload) => {
  const encodedPayload = base64Url(JSON.stringify(payload));
  const signature = crypto
    .createHmac("sha256", getAuthSecret())
    .update(encodedPayload)
    .digest("base64url");

  return `${encodedPayload}.${signature}`;
};

const verifyToken = (token) => {
  const [encodedPayload, signature] = String(token || "").split(".");
  if (!encodedPayload || !signature) return null;

  const expectedSignature = crypto
    .createHmac("sha256", getAuthSecret())
    .update(encodedPayload)
    .digest("base64url");

  const actual = Buffer.from(signature);
  const expected = Buffer.from(expectedSignature);

  if (actual.length !== expected.length || !crypto.timingSafeEqual(actual, expected)) {
    return null;
  }

  const payload = JSON.parse(Buffer.from(encodedPayload, "base64url").toString("utf8"));
  if (payload.exp && Date.now() > payload.exp) return null;

  return payload;
};

const requireAuth = (req, res, next) => {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";
  const payload = verifyToken(token);

  if (!payload?.email) {
    return res.status(401).json({ error: "Please sign in again." });
  }

  req.user = { email: payload.email };
  next();
};

module.exports = { requireAuth, signPayload };
