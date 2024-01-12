import twilio, { Twilio } from 'twilio'
import sgMail from '@sendgrid/mail'
import * as constants from './constants.util'

const TWILIO_TO_PHONE_NUMBER = '+380504450145'

// Set SendGrid API key
if (constants.SENDGRID_API_KEY) {
  sgMail.setApiKey(constants.SENDGRID_API_KEY)
}

// Initialize Twilio client
let twilioClient: Twilio
if (constants.TWILIO_ACCOUNT_SID && constants.TWILIO_AUTH_TOKEN) {
  twilioClient = twilio(constants.TWILIO_ACCOUNT_SID, constants.TWILIO_AUTH_TOKEN)
}

export const generateOTP = () => {
  /**
   * Below line is commented because we will in trial mode of twilio only an otp can be sent to
   * specific mobile number configured in twilio panel. Need Paid version in order to uncomment
   */
  // return Math.floor(1000 + Math.random() * 9000)
  return 1234
}

// Helper function to send OTP to a phone using Twilio
export const sendOTPViaSMS = async (phoneNumber, otp) => {
  try {
    const message = await twilioClient.messages.create({
      body: `Your OTP is ${otp}`,
      from: constants.TWILIO_PHONE_NUMBER,
      to: TWILIO_TO_PHONE_NUMBER,
    })
    console.log('Twilio OTP', message)
    return message
  } catch (error) {
    console.error('Error sending OTP via SMS:', error)
    throw new Error('Failed to send OTP via SMS')
  }
}

// Helper function to send OTP to an email using SendGrid
export const sendOTPViaEmail = async () => {
  // try {
  //   const message = {
  //     to: email,
  //     from: constants.SENDGRID_SENDER_EMAIL,
  //     subject: 'OTP Verification',
  //     text: `Your OTP is ${otp}`,
  //   }
  //   await sgMail.send(message)
  //   return message
  //   // return true
  // } catch (error) {
  //   console.error('Error sending OTP via email:', error)
  //   throw error
  // }
  return null
}
