export const generateOTP = (): number => {
  // Generate 6 digit otp
  let randomNumber = Math.floor(100000 + Math.random() * 900000)
  if (randomNumber.toString().length < 6) {
    randomNumber = parseInt(randomNumber.toString() + 0)
  }
  return randomNumber
}
