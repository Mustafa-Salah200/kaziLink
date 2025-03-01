const express = require("express");
const {
  login,
  signUp,
  fetchUsers,
  updataUser,
  deleteUser,
  updataOnlyOne,
} = require("../controllers/user-controllers");
const getUser = require("../utils/getUser");
const userRouter = express.Router();

userRouter.post("/login", login);
userRouter.post("/signup", signUp);
userRouter.post("/update", getUser, updataUser);
userRouter.get("/:role", fetchUsers);
userRouter.route("/:id").delete(deleteUser).post(updataOnlyOne);

module.exports = userRouter;
