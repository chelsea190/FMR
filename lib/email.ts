import nodemailer from 'nodemailer';

export async function sendOtpEmail(email: string, otp: string) {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.log(`OTP for ${email}: ${otp}`);
    return;
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
  });

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Your FindMeRx verification code',
    text: `Your FindMeRx code is ${otp}. It expires in 10 minutes.`,
  });
}
