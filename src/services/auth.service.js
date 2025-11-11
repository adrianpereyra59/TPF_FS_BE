import transporter from "../config/mailer.config.js"
import UserRepository from "../repositories/user.repository.js"
import { ServerError } from "../utils/customError.utils.js"
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import ENVIRONMENT from "../config/environment.config.js"

class AuthService {
    static async register(username, password, email) {
        const user_found = await UserRepository.getByEmail(email)
        if (user_found) {
            throw new ServerError(400, 'Email ya en uso')
        }

        const password_hashed = await bcrypt.hash(password, 12)
        const user_created = await UserRepository.createUser(username, email, password_hashed)

        const verification_token = jwt.sign(
            {
                email: email,
                user_id: user_created._id
            },
            ENVIRONMENT.JWT_SECRET_KEY
        )

        const frontendBase = (ENVIRONMENT.URL_FRONTEND || ENVIRONMENT.URL_API_BACKEND || "").replace(/\/$/, "");
        const verificationLink = frontendBase ? `${frontendBase}/verify-email/${verification_token}` : `${ENVIRONMENT.URL_API_BACKEND}/api/auth/verify-email/${verification_token}`;

        await transporter.sendMail({
            from: 'pruevasdeveloperweb@gmail.com',
            to: email,
            subject: 'Verificacion de correo electronico',
            html: `
                <h1>Hola desde node.js</h1>
                <p>Este es un mail de verificacion</p>
                <a href='${verificationLink}'>Verificar email</a>
            `
        })
    }

    static async verifyEmail(verification_token){
        try{
            const payload = jwt.verify(verification_token, ENVIRONMENT.JWT_SECRET_KEY)

            await UserRepository.updateById(
                payload.user_id, 
                {
                    verified_email: true
                }
            )

            return 

        }
        catch(error){
            if(error instanceof jwt.JsonWebTokenError){
                throw new  ServerError(400, 'Token invalido')
            }
            throw error
        }
    }

    static async login(email, password){
        const user = await UserRepository.getByEmail(email)
        if(!user){
            throw new ServerError(404, 'Email no registrado')
        }

        if (user.verified_email === false){
            throw new ServerError(
                401, 
                'email no verificado, por favor verifique su email' 
            )
        }

        const is_same_password = await bcrypt.compare(password, user.password)
        if(!is_same_password){
            throw new ServerError(401, 'Contraseña incorrecta')
        }
        const authorization_token = jwt.sign(
            {
                id: user._id,
                name: user.name,
                email: user.email,
                created_at: user.created_at
            },
            ENVIRONMENT.JWT_SECRET_KEY,
            {
                expiresIn: '7d'
            }
        )

        return {
            authorization_token
        }
    }

    static async forgotPassword(email) {
        const user = await UserRepository.getByEmail(email)
        
        if (!user) {
            return
        }
        
        const reset_token = jwt.sign(
            {
                email: email,
                user_id: user._id,
                type: 'password_reset'
            },
            ENVIRONMENT.JWT_SECRET_KEY,
            {
                expiresIn: '1h'
            }
        )
        
        await UserRepository.updateById(user._id, {
            reset_token: reset_token,
            reset_token_expiry: new Date(Date.now() + 3600000)
        })
        
        const resetUrl = `${ENVIRONMENT.URL_API_BACKEND}/reset-password?token=${reset_token}`
        
        await transporter.sendMail({
            from: 'pruevasdeveloperweb@gmail.com',
            to: email,
            subject: 'Recuperación de contraseña',
            html: `
                <h1>Recuperación de contraseña</h1>
                <p>Has solicitado recuperar tu contraseña.</p>
                <p>Haz clic en el siguiente enlace para restablecer tu contraseña:</p>
                <a href="${resetUrl}">Restablecer contraseña</a>
                <p>Este enlace expirará en 1 hora.</p>
                <p>Si no solicitaste este cambio, ignora este correo.</p>
            `
        })
    }

    static async resetPassword(reset_token, new_password) {
        try {
            const payload = jwt.verify(reset_token, ENVIRONMENT.JWT_SECRET_KEY)
            
            if (payload.type !== 'password_reset') {
                throw new ServerError(400, 'Token inválido')
            }
            
            const user = await UserRepository.getById(payload.user_id)
            
            if (!user) {
                throw new ServerError(404, 'Usuario no encontrado')
            }
            
            if (user.reset_token !== reset_token) {
                throw new ServerError(400, 'Token inválido')
            }
            
            if (user.reset_token_expiry && new Date() > user.reset_token_expiry) {
                throw new ServerError(400, 'El token ha expirado')
            }
            
            const password_hashed = await bcrypt.hash(new_password, 12)
            
            await UserRepository.updateById(user._id, {
                password: password_hashed,
                reset_token: null,
                reset_token_expiry: null,
                modified_at: new Date()
            })
            
            return
        }
        catch (error) {
            if (error instanceof jwt.JsonWebTokenError) {
                throw new ServerError(400, 'Token inválido o expirado')
            }
            throw error
        }
    }
}

export default AuthService;