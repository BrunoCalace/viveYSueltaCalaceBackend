import nodemailer from 'nodemailer'
import jwt from 'jsonwebtoken'

const transport = nodemailer.createTransport ({
    service: 'gmail',
    port: 587,
    auth: {
      user: 'bruno.calace@gmail.com',
      pass: 'unouzhpdqrbggipb'
    }
})

const mailPass = (user) => {
  const token = jwt.sign({ userId: user._id }, 'secreto', { expiresIn: '1h' });

  const resetLink = `http://localhost:8080/changePass/${token}`

  return transport.sendMail({
    from: 'bruno.calace@gmail.com',
    to: user.email,
    subject: `Cuenta VyS - Password Recovery`,
    html: `
      <div>
        <a href="${resetLink}">Haga clic aquí para recuperar su contraseña</a>
      </div>
    `,
    attachments: []
  })
}
export default mailPass