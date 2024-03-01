'use strict'
import Usuario from './user.model.js'
import { encrypt, checkPassword, checkUpdateUser } from '../utils/validator.js'
import { tokenSign, verifyToken } from '../helpers/generateToken.js'

//MOSTRAR
export const getAllUsers=async(req,res)=>{
    try {
        let usuarios=await Usuario.find()
        if(usuarios.length===0) return res.status(404).send({message: 'No hay usuarios que mostrar'})
        return res.send({usuarios})
    } catch (error) {
        console.error(error)
        return res.status(500).send({message: 'Error al obtener usuarios'})
    }
}


//REGISTRAR
export const register=async(req,res)=>{
    try {
        let data=req.body
        data.password=await encrypt(data.password)

        let user=new Usuario(data)
        await user.save()

        return res.send({message: 'Registered Successfully'})

    } catch (error) {
        console.error(error)
        return res.satus(500).send({message: 'Error registering user', error})
    }
}

//LOGIN
export const login=async(req,res)=>{
    try {
        let {username, password, email}=req.body
        /* console.log(username)
        console.log(email) */
        if(username){
            var user=await Usuario.findOne({username})
        }else if(email){
            var user=await Usuario.findOne({email})
        }
        
        const tokenSession=await tokenSign(user)

        if(user && await checkPassword(password, user.password)){
            let loggerUser={
                username: user.username,
                name: user.name,
                role: user.role,
                tokenSession
            }

            return res.send({message: `Welcome ${user.name}`, loggerUser})
        }
        return res.status(404).send({message: 'User or password incorrect'})

    } catch (error) {
        console.error(error)
        return res.satus(500).send({message: 'Error login in', error})
    }
}

export const updateMyAccount = async (req, res) => {
    try {
         let userId = req.params.id;
        
        const { password, ...updateData } = req.body;
        
        const user = await Usuario.findById(userId);

        if (!user) {
            return res.status(404).send({ message: 'Usuario no encontrado' });
        }

        if (password && !req.body.oldPassword) {
            return res.status(400).send({ message: 'Debe proporcionar la contraseña actual' });
        }
        
        if (password) {
            const isPasswordValid = await checkPassword(req.body.oldPassword, user.password);

            if (!isPasswordValid) {
                return res.status(401).send({ message: 'Contraseña incorrecta' });
            }
        }
        
        const updateUser = await Usuario.findByIdAndUpdate(userId, updateData, { new: true });

        if (!updateUser) {
            return res.status(404).send({ message: 'Usuario no encontrado o no actualizado' });
        }

        return res.send({ message: 'Usuario actualizado exitosamente', updateUser });
    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: 'Error al actualizar usuario', error });
    }
}












//  Historial borrado exitósamente 