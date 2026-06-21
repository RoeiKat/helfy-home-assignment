const crypto = require("crypto");
const db = require("../config/db");
const logger = require("../config/logger");

function hashPassword(password) {
  return crypto.createHash("sha256").update(password).digest("hex");
}

async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required.",
      });
    }

    const [users] = await db.execute(
      "SELECT id, email, username, password_hash FROM users WHERE email = ?",
      [email]
    );

    const user = users[0];

    if (!user) {
      return res.status(401).json({
        message: "Email or password is incorrect.",
      });
    }

    const isPasswordValid = hashPassword(password) === user.password_hash;

    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Email or password is incorrect.",
      });
    }

    const token = crypto.randomBytes(32).toString("hex");

    await db.execute(
      "INSERT INTO user_tokens (user_id, token) VALUES (?, ?)",
      [user.id, token]
    );

    logger.info({
      timestamp: new Date().toISOString(),
      userId: user.id,
      action: "user_login",
      ipAddress: req.ip,
    });

    return res.json({
      token,
    });
  } catch (error) {
    logger.error({
      timestamp: new Date().toISOString(),
      action: "login_failed",
      error: error.message,
    });

    return res.status(500).json({
      message: "Server error",
    });
  }
}

function getCurrentUser(req, res) {
  return res.json({
    id: req.user.id,
    email: req.user.email,
    username: req.user.username,
  });
}

module.exports = {
  login,
  getCurrentUser,
};