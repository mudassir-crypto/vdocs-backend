import nodemailer from 'nodemailer'

const mailHelper = async (options) => {

  let transporter = nodemailer.createTransport({
    service: process.env.SMTP_SERVICE,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  })

  const message = {
    from: process.env.SMTP_USER, // sender address
    to: options.email, // list of receivers
    subject: options.subject, // Subject line
    html: options.message, // plain text body
  }

  // send mail with defined transport object
  await transporter.sendMail(message)

}

export default mailHelper