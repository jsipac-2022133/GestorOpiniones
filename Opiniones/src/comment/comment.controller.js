'use strict'
import Comment from "./comment.model.js"
import User from "../user/user.model.js"
import Publication from "../publication/publication.model.js"
import { verifyToken } from "../helpers/generateToken.js"
import { checkUpdate } from "../utils/validator.js"

//AGREGAR COMMENTARIO
export const addComment = async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1]
        const decodedToken = await verifyToken(token)
        if (!decodedToken) return res.status(401).send({ message: 'Unauthorized' })

        const data = req.body
        const { id } = req.params
        const user = decodedToken._id

        const commentAdded = new Comment(
            {
                comment: data.comment,
                publication: id,
                user: user
            }
        )

        await commentAdded.save()
        return res.send({message: 'Comment added successfully'})

    } catch (error) {
        console.error(error)
        return res.status(500).send({ message: 'Error adding comment', error })
    }
}

//ACTUALIZAR
export const updateComment=async(req,res)=>{
    try {
    const {id}=req.params
    const data=req.body

    const update=checkUpdate(data, id)
    if(!update) return res.status(400).send({message: 'Have submitted some data that cannot be updated or missing data'})
    
    const token=req.headers.authorization.split(' ')[1]
    const decodedToken=await verifyToken(token)
    if(!decodedToken) return res.status(401).send({message: 'Invalid token'})

    const userId=decodedToken._id
    const commentToUpdate=await Comment.find({_id: id, user: userId})
    if(!commentToUpdate) return res.status(403).send({message: 'You are not authorized to update this curso'})
    
    const updatedComment=await Comment.findOneAndUpdate(
        {_id: id},
        data,
        {new: true}
    )

    if(!updatedComment) return res.status(404).send({message: 'Comment not found or not updated'})

    return res.send({message: 'Updated comment', updatedComment})

    } catch (error) {
        console.error(error)
        return res.status(500).send({message: 'Error updating comment', error})
    }
}


//ELIMINAR
export const deleteComment=async(req,res)=>{
    try {
        const {id}=req.params

        const token=req.headers.authorization.split(' ')[1]
        const decodedToken=await verifyToken(token)
        if(!decodedToken) return res.status(401).sen({message: 'Invalid token'})

        const userId=decodedToken._id
        const commentToDelete=await Comment.findOne({_id: id, user: userId})
        if(!commentToDelete) res.status(403).send({message: 'You are not authorized to delete this curso'})

        const deletedComment=await Comment.findOneAndDelete({_id: id})
        if(!deletedComment) return res.status(404).send({message: 'Comment not found and not deleted'})

        return res.send({message: 'Comment deleted successfully'})

    } catch (error) {
        console.error(error)
        return res.status(500).send({message: 'Error deleting comment', error})
    }
}