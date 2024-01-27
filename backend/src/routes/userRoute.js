const express = require("express");
const router = express.Router();
const { createUser } = require("../controller/userController");
const deSerializeUser = require("../middleware/deserializeUser");
const {
  createSession,
  getSession,
  getUser,
  updateSession,
  googleOauthHandler,
} = require("../controller/sessionController");

router.post("/register", createUser);
router.post("/session", createSession);
router.get("/sessions", deSerializeUser, getSession);
router.put("/session", deSerializeUser, updateSession);
router.get("/user", deSerializeUser, getUser);
router.get("/session/oauth/google", googleOauthHandler);
module.exports = router;
