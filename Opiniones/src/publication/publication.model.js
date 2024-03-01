'use strict'

import mongoose from "mongoose"

const publicationSchema=mongoose.Schema({    
    titulo:{
        type: String,
        required: true
    },       
    category:{
        type: mongoose.Types.ObjectId,
        ref: 'category',
        required: true
    },
    textoPrincipal:{
        type: String,
        required: true
    },
    user:{
        type: mongoose.Types.ObjectId,
        ref: 'user',
        required: true
    },    
    date: {
        type: Date,
        default: Date.now
    }
})

export default mongoose.model('publication', publicationSchema)