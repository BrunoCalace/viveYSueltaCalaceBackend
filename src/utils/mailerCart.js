import nodemailer from 'nodemailer'

const transport = nodemailer.createTransport ({
    service: 'gmail',
    port: 587,
    auth: {
      user: 'bruno.calace@gmail.com',
      pass: 'unouzhpdqrbggipb'
    }
})

const mailCart = (newTicket) => transport.sendMail({
    from: 'bruno.calace@gmail.com',
    to: 'bruno.calace@gmail.com',
    subject: `Compra de ${newTicket.purchaser}`,
    html: `
      <div>
        <h1>Compra</h1>
        <p>Código: ${newTicket.code}</p>
        <p>Cliente: ${newTicket.purchaser}</p>
        <p>Cantidad de productos: ${newTicket.amount}</p>
        <p>Total pagado: $ ${newTicket.total}</p>
        <p>Fecha: ${newTicket.purchase_datetime}</p>
      </div>
    `,
    attachments: []
})

export default mailCart