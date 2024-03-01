'use strict'
import express from "express"
import { addComment, deleteComment, updateComment } from "./comment.controller.js"
import { checkAuth, checkRoleAuth } from "../middleware/auth.js"

const api=express.Router()

api.post('/addComment/:id', checkAuth, addComment)
api.put('/updateComment/:id', checkAuth, updateComment)
api.delete('/deleteComment/:id', checkAuth, deleteComment)

export default api
