import nodemailer from 'nodemailer';
import config from '../config';

// Create and export the email transporter
export const transporter = nodemailer.createTransport({
  host: config.email_host,
  port: Number(config.email_port) || 587, // Default port for non-secure connections
  secure: config.NODE_ENV === 'production', // Use true if port is 465 (secure)
  auth: {
    user: config.email_user,
    pass: config.email_pass,
  },
});
