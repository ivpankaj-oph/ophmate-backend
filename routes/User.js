import express from 'express'
import { completeProfile, login, userRegister, verifyOtp } from '../controllers/User.js'
import { authenticateUser } from '../middleware/index.js'

const userRouter = express.Router()


userRouter.post('/register',userRegister)
userRouter.post('/login',login)
userRouter.post('/complete-profile',authenticateUser,completeProfile)
userRouter.post('/verify-otp',verifyOtp)


export default userRouter