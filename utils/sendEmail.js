const nodemailer = require("nodemailer");
const hbs = require('nodemailer-express-handlebars')
const path = require('path')


// for production from actual web server
const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: process.env.EMAIL_SECURE,
    auth: {
      user: process.env.EMAIL_HOST_USER,
      pass: process.env.EMAIL_HOST_PASSWORD,
    }
  });



  // point to the template folder
const handlebarOptions = {
    viewEngine: {
        partialsDir: path.resolve('./views/'),
        defaultLayout: false,
    },
    viewPath: path.resolve('./views/'),
};

// use a template file with nodemailer
transporter.use('compile', hbs(handlebarOptions))


  let sendEmailNotification=async (email,name,subject,params)=>{
    try {
        // Send email
        let currentDateTime= new Date().toLocaleString()
        const info = await transporter.sendMail({
          from: '"imar 👻" <developer@thechildrengreenbook.net>', // sender address
          template: "email",    // Name of the template file email.handlebars in view directory
          to: email, // list of receivers
          subject:subject, // Subject line
         context: {
            name: name,
            params: params,
          },
        });
      
        console.log("Message sent: %s", info.messageId);
        // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>


    } catch (error) {
        console.log("Error occurred while sending email: ", error.message);
    }
  }


  module.exports = {sendEmailNotification};