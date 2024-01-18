import nodemailer from 'nodemailer'

const transport = nodemailer.createTransport ({
    service: 'gmail',
    port: 587,
    auth: {
      user: 'bruno.calace@gmail.com',
      pass: 'unouzhpdqrbggipb'
    }
})

const mailPass = (user) => transport.sendMail({
    from: 'bruno.calace@gmail.com',
    to: 'bruno.calace@gmail.com',
    subject: `Cuenta VyS - Password Recovery`,
    html: `
      <div>
        <a href='#'>Haga click aquí para recuperar su contraseña</a>
      </div>
    `,
    attachments: []
})

export default mailPass