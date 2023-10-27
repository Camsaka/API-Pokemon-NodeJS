var transporter = nodemailer.createTransport({
   service: 'gmail',
   auth: {
      user: "camille.gautier.pro@gmail.com",
      pass: "Carwash56",
   }
 });
 
 var mailOptions = {
   from: 'youremail@gmail.com',
   to: 'wqk35049@zslsz.com',
   subject: 'Sending Email using Node.js',
   text: 'That was easy!'
 };
 
 transporter.sendMail(mailOptions, function(error, info){
   if (error) {
     console.log(error);
   } else {
     console.log('Email sent: ' + info.response);
   }
 });