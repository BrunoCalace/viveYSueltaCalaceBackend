import nodemailer from 'nodemailer'

const transport = nodemailer.createTransport ({
    service: 'gmail',
    port: 587,
    auth: {
      user: 'bruno.calace@gmail.com',
      pass: 'unouzhpdqrbggipb'
    }
})

const mailDelProd = (product, user) => transport.sendMail({
    from: 'bruno.calace@gmail.com',
    to: user.email,
    subject: `Eliminación producto ${product._id}`,
    html: `
      <div>
        <p>Su producto ${product.title} fue eliminado</p>
      </div>
    `,
    attachments: []
})

export default mailDelProd