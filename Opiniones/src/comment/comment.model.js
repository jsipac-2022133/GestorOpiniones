'use strict'
import mongoose from "mongoose"

const commentSchema=mongoose.Schema({
    comment:{
        type: String,
        required: true
    },
    publication:{
        type: mongoose.Types.ObjectId,
        ref: 'publication',
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

export default mongoose.model('comment', commentSchema)