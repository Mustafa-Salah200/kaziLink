const express = require('express')
const { login, signUp, fetchUsers, updataUser } = require('../controllers/user-controllers')
const getUser = require('../utils/getUser')
const userRouter = express.Router()

userRouter.post('/login',login)
userRouter.post('/signup',signUp)
userRouter.post('/update',getUser,updataUser)
userRouter.get('/:role',fetchUsers)



module.exports = userRouter