const jwt = require("jsonwebtoken");
const Session = require("../model/Session");
const User = require("../model/User");
const deSerializeUser = (req, res, next) => {
  const authHeader = req.headers.Authorization || req.headers.authorization;
  const accessToken = req.cookies.accessToken || authHeader.split(" ")[0];
  console.log(accessToken, "accessToken");
  const refreshToken =
    req.headers["x-refresh-token"] || req.cookies.refreshToken;

  jwt.verify(
    accessToken,
    process.env.JWT_ACCESSTOKEN_SECRET_KEY,
    (err, user) => {
      if (err) {
        if (refreshToken) {
          jwt.verify(
            refreshToken,
            process.env.JWT_REFRESH_TOKEN_SECRET_KEY,
            async (err, user) => {
              console.log("user", user);
              if (err) {
                return res.status(403).json({
                  message: "Invalid refresh token",
                });
              } else {   
                const session = await Session.findById({
                  _id: user.session,
                });
                if (!session.valid || !session) {
                  return;
                }
                const userInfo = await User.findById({ _id: session.user });
                if (!userInfo) {
                  return;
                }
                const accessToken = jwt.sign(
                  { user: userInfo._id, session: session._id },
                  process.env.JWT_ACCESSTOKEN_SECRET_KEY,
                  { expiresIn: "15m" }
                );
                res.setHeader("x-access-token", `${accessToken}`);
                res.cookie("accessToken", accessToken, {
                  maxAge: 1000 * 60 * 15,
                  httpOnly: true,
                });
                req.id = user.user;
                req.session = user.session;
                console.log("userInside", req.id);
                next();
              }
            }
          );
        }
      } else {
        console.log("accessUser", user);
        req.id = user.user;
        req.session = user.session;
        console.log("user", req.id);
        next();
      }
    }
  );
};
module.exports = deSerializeUser;
