const express = require('express')
const { login, signUp, fetchUsers } = require('../controllers/user-controllers')
const userRouter = express.Router()

userRouter.post('/login',login)
userRouter.post('/signup',signUp)
userRouter.get('/:role',fetchUsers)



module.exports = userRouter