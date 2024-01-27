const User = require("../model/User");
const cryptoJS = require("crypto-js");
exports.createUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const user = await User.create({
      name,
      email,
      password: cryptoJS.AES.encrypt(
        password,
        process.env.SECRET_KEY
      ).toString(),
    });
    res.status(201).json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};
