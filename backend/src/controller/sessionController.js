const Session = require("../model/Session");
const User = require("../model/User");
const cryptoJS = require("crypto-js");
const axios = require("axios");
const jwt = require("jsonwebtoken");
const qs = require("querystring");
const { getGoogleUser, updateGoogleUser } = require("../services/oauthService");
exports.createSession = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }
    const decryptedPassword = cryptoJS.AES.decrypt(
      user.password,
      process.env.SECRET_KEY
    ).toString(cryptoJS.enc.Utf8);
    if (decryptedPassword !== req.body.password) {
      return res.status(401).json({
        message: "Password is incorrect",
      });
    }
    const session = await Session.create({
      user: user._id,
      useAgent: req.get("User-Agent") || "",
    });
    const accessToken = jwt.sign(
      { user: user._id, session: session._id },
      process.env.JWT_ACCESSTOKEN_SECRET_KEY,
      { expiresIn: "15m" }
    );
    const refreshToken = jwt.sign(
      { user: user._id, session: session._id },
      process.env.JWT_REFRESH_TOKEN_SECRET_KEY,
      { expiresIn: "1y" }
    );
    res.cookie("accessToken", accessToken, {
      maxAge: 1000 * 60 * 15,
      httpOnly: true,
    });
    res.cookie("refreshToken", refreshToken, {
      maxAge: 1000 * 60 * 60 * 24 * 365,
      httpOnly: true,
    });
    res.status(200).json({
      accessToken,
      refreshToken,
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({
      message: "Error finding user",
    });
  }
};
exports.getSession = async (req, res) => {
  const session = await Session.find({
    user: req.id,
    valid: true,
  });
  res.status(200).json({
    success: true,
    data: session,
  });
};

exports.updateSession = async (req, res) => {
  const sessionId = req.session;
  await Session.findByIdAndUpdate({ _id: sessionId }, { valid: false });
  return res.send({
    accessToken: null,
    refreshToken: null,
  });
};
exports.getUser = async (req, res) => {
  try {
    const user = await User.findById({ _id: req.id });
    res.status(200).json({
      data: user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: error.message,
    });
  }
};
exports.googleOauthHandler = async (req, res) => {
  //get code from query string
  const code = req.query.code;

  //get the id and access token with the code
  const url = `https://oauth2.googleapis.com/token`;
  const values = {
    code,
    client_id: process.env.GOOGLE_CLIENT_ID,
    client_secret: process.env.GOOGLE_CLIENT_SECRET,
    redirect_uri: process.env.GOOGLE_REDIRECT_URI,
    grant_type: "authorization_code",
  };
  try {
    const response = await axios.post(url, qs.stringify(values), {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
    console.log(response.data);
    const { access_token, id_token, refresh_token } = response.data;
    // const googleUser = jwt.decode(id_token);
    //get the user info with the access token
    console.log(access_token, id_token, refresh_token);
    const googleUser = await getGoogleUser({ id_token, access_token });
    console.log(googleUser);
    // if (!googleUser.verified_email) {
    //   return res.status(401).json({
    //     message: "Email not verified",
    //   });
    // }
    //upsert the user in the database
    // const user = await updateGoogleUser(
    //   { email: googleUser.email },
    //   {
    //     email: googleUser.email,
    //     name: googleUser.name,
    //     picture: googleUser.picture,
    //   },
    //   {
    //     upsert: true,
    //     new: true,
    //   }
    // );
    //create a session
    const session = await Session.create({
      user: user._id,
      useAgent: req.get("User-Agent") || "",
    });
    //create access token and refresh token
    const accessToken = jwt.sign(
      { user: user._id, session: session._id },
      process.env.JWT_ACCESSTOKEN_SECRET_KEY,
      { expiresIn: "15m" }
    );
    const refreshToken = jwt.sign(
      { user: user._id, session: session._id },
      process.env.JWT_REFRESH_TOKEN_SECRET_KEY,
      { expiresIn: "1y" }
    );
    //set cookies redirect back to client
    res.cookie("accessToken", accessToken, {
      maxAge: 1000 * 60 * 15,
      httpOnly: true,
    });
    res.cookie("refreshToken", refreshToken, {
      maxAge: 1000 * 60 * 60 * 24 * 365,
      httpOnly: true,
    });
    res.redirect("http://localhost:3000/home");
  } catch (error) {
    console.log(error);
    return res.redirect("http://localhost:3000/login");
  }
};
