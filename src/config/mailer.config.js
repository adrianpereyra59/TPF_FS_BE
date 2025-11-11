import nodemailer from 'nodemailer'
import ENVIRONMENT from './environment.config.js'

//La configuracion para nuestro mailer
const transporter = nodemailer.createTransport(
    {
        service: 'gmail',
        auth: {
            user: 'pruevasdeveloperweb@gmail.com',
            pass: ENVIRONMENT.GMAIL_PASSWORD
        },
        tls: {
    rejectUnauthorized: false, 
  },
    }
)


export default transporter