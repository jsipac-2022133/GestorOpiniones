'use strict';
import Publication from "./publication.model.js";
import Comment from "../comment/comment.model.js";
import User from "../user/user.model.js";
import { verifyToken } from "../helpers/generateToken.js";
import { checkUpdate } from "../utils/validator.js";
import Category from "../category/category.model.js";

export const addPublication = async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = await verifyToken(token);

        if (decodedToken) {
            const userId = decodedToken._id;
            const user = await User.findOne({ _id: userId });
            if (!user) return res.send({ message: 'User not found' });

            const data = req.body;


            if (data.category) {
                let category = await Category.findOne({ _id: data.category })
                if (!category) return res.status(404).send({ message: 'Category not found' })
            }

            const publication = new Publication({
                user: userId,
                titulo: data.titulo,
                category: data.category,
                textoPrincipal: data.textoPrincipal
            });

            await publication.save();
            return res.send({ message: 'Publication saved successfully' });
        } else {
            return res.send({ message: 'Invalid token' });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: 'Error saving publication', error });
    }
};


//ACTUALIZAR
export const updatePublication = async (req, res) => {
    try {
        const { id } = req.params
        const data = req.body

        const update = checkUpdate(data, id)
        if (!update) {
            return res.status(400).send({ message: 'Have submitted some data that cannot be updated or missing data' })
        }
        const token = req.headers.authorization.split(' ')[1]
        const decodedToken = await verifyToken(token)
        if (!decodedToken) return res.status(401).send({ message: 'Invalid token' })

        const userID = decodedToken._id

        const publicationUpdate = await Publication.findOne({ _id: id, user: userID })
        if (!publicationUpdate) {
            return res.status(403).send({ message: 'You are not authorized to update this publication' })
        }

        const updatedPublication = await Publication.findOneAndUpdate(
            { _id: id },
            data,
            { new: true }
        )

        if (!updatedPublication) {
            return res.send({ message: 'Publication not found and not updated' })
        }

        return res.send({ message: 'Updated Publication', updatedPublication })

    } catch (error) {
        console.error(error)
        return res.status(500).send({ message: 'Error updating publication' })
    }
}

//aliminar publicación
export const deletePublication = async (req, res) => {
    try {
        const { id } = req.params;
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = await verifyToken(token);
        if (!decodedToken) return res.status(401).send({ message: 'Token inválido' });

        const userId = decodedToken._id;

        const publicationDelete = await Publication.findOne({ _id: id, user: userId });
        if (!publicationDelete) return res.status(403).send({ message: 'You are not authorized to delete this publication' });

        // Eliminar los comentarios asociados, en caso haya
        await Comment.deleteMany({ publication: id });

        const publicationDeleted = await Publication.findOneAndDelete({ _id: id });
        if (!publicationDeleted) return res.status(404).send({ message: 'Publication not found and not deleted' });

        return res.send({ message: `Publication with title ${publicationDeleted.titulo} deleted successfully` });

    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: 'Error deleting publication' });
    }
}


//OBTENER PUBLICACIÓN
export const getPublication = async (req, res) => {
    try {
        const { publicationId } = req.params;

        const publication = await Publication.findById(publicationId).populate('user', ['name']);

        if (!publication) {
            return res.status(404).send({ message: "La publicación no fue encontrada" });
        }

        const comments = await Comment.find({ publication: publicationId }).populate('user', ['name']);

        return res.status(200).send({ publication, comments });
    } catch (error) {
        console.error("Error al obtener la publicación y sus comentarios:", error);
        return res.status(500).send({ message: "Error del servidor" });
    }
}

//MOSTRAR TODAS LAS PUBLICACIONES
export const getPublications = async (req, res) => {
    try {
        const publications = await Publication.find().populate('user', ['name']);

        if (!publications || publications.length === 0) {
            return res.status(404).send({ message: "No se encontraron publicaciones" });
        }

        const publicationsWithComments = [];

        for (const publication of publications) {
            const comments = await Comment.find({ publication: publication._id }).populate('user', ['name']);
            publicationsWithComments.push({ publication, comments });
        }

        return res.status(200).send({ publicationsWithComments });
    } catch (error) {
        console.error("Error al obtener las publicaciones y sus comentarios:", error);
        return res.status(500).send({ message: "Error del servidor" });
    }
}

//MOSTRAR MIS PUBLICACIONES
export const getMyPublications = async (req, res) => {
    try {
        const decodedToken = await verifyToken(req.headers.authorization.split(' ')[1]);
        const userId = decodedToken._id;

        const publications = await Publication.find({ user: userId }).populate('user', ['name']);

        if (!publications || publications.length === 0) {
            return res.status(404).send({ message: "No se encontraron publicaciones para este usuario" });
        }

        const publicationsWithComments = [];
        for (const publication of publications) {
            const comments = await Comment.find({ publication: publication._id }).populate('user', ['name']);
            publicationsWithComments.push({ publication, comments });
        }

        return res.status(200).send({ publicationsWithComments });
    } catch (error) {
        console.error("Error al obtener las publicaciones del usuario:", error);
        return res.status(500).send({ message: "Error del servidor" });
    }
}
