import nodemailer from 'nodemailer'

const transport = nodemailer.createTransport ({
    service: 'gmail',
    port: 587,
    auth: {
      user: 'bruno.calace@gmail.com',
      pass: 'unouzhpdqrbggipb'
    }
})

const mailUser = (user) => {
    return transport.sendMail({
        from: 'bruno.calace@gmail.com',
        to: user.email,
        subject: `Eliminación de cuenta por inactividad`,
        html: `
          <div>
            <p>Su cuenta ha sido eliminada por superar los dos días de inactividad</p>
          </div>
        `,
        attachments: []
      })
}
export default mailUser