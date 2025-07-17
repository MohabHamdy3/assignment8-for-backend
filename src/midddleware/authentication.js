import jwt  from 'jsonwebtoken';

const authentication = (req, res, next) => {
  const rawHeader = req.headers.token || req.headers.authorization;
  const token = rawHeader?.split(" ")[1];
  if (!token) {
    return res.status(401).json({
      message: "Unauthorized",
      status: 401,
    });
  }

  try {
    const decoded = jwt.verify(token, "mohab");
    req.user = decoded;
    next();
  } catch (error) {
    console.error("Authentication error:", error);
    return res.status(401).json({
      message: "Invalid token",
      status: 401,
    });
  }
};


export default authentication;