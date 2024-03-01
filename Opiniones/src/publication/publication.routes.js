'use strict'
import express from "express"
import { addPublication, updatePublication, deletePublication, getPublication, getPublications, getMyPublications } from "./publication.controller.js"
import { checkAuth } from "../middleware/auth.js"

const api=express.Router()

api.post('/addPublication', checkAuth, addPublication)
api.put('/updatePublication/:id', checkAuth, updatePublication)
api.delete('/deletePublication/:id', checkAuth, deletePublication)
api.get('/getPublication/:publicationId', checkAuth, getPublication)
api.get('/getPublications', checkAuth, getPublications)
api.get('/getMyPublications', checkAuth, getMyPublications)

export default api