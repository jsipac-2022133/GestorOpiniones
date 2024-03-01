'user strict'

import express from "express"
import { register, getAllUsers, login, updateMyAccount } from "./user.controller.js"
import { checkAuth, checkRoleAuth } from "../middleware/auth.js"

const api=express.Router()

api.post('/register', register)
api.post('/login',login)
api.put('/updateMyAcount/:id', checkAuth, updateMyAccount)
api.get('/selectUsers', checkAuth, getAllUsers)

export default api