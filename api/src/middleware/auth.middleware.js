const db = require("../config/db");

async function authenticateToken(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Invalid Authorization header.",
      });
    }

    const token = authHeader.slice("Bearer ".length);

    const [rows] = await db.execute(
      `SELECT users.id, users.email, users.username
       FROM user_tokens
       JOIN users ON users.id = user_tokens.user_id
       WHERE user_tokens.token = ?
       LIMIT 1`,
      [token]
    );

    const user = rows[0];

    if (!user) {
      return res.status(401).json({
        message: "Invalid token.",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
    });
  }
}

module.exports = {
  authenticateToken,
};
