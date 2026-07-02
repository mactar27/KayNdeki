export async function sendSMS(to: string, message: string) {
  const accountSid = process.env.TWILIO_ACCOUNT_SID
  const authToken = process.env.TWILIO_AUTH_TOKEN
  const fromNumber = process.env.TWILIO_PHONE_NUMBER

  if (!accountSid || !authToken || !fromNumber) {
    console.log("----------------------------------------")
    console.log(`📱 MOCK SMS (Twilio non configuré)`)
    console.log(`À : ${to}`)
    console.log(`Message : ${message}`)
    console.log("----------------------------------------")
    return true
  }

  try {
    const response = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${Buffer.from(`${accountSid}:${authToken}`).toString("base64")}`,
        },
        body: new URLSearchParams({
          To: to,
          From: fromNumber,
          Body: message,
        }),
      }
    )

    if (!response.ok) {
      const error = await response.text()
      console.error("Erreur Twilio:", error)
      return false
    }

    return true
  } catch (error) {
    console.error("Erreur lors de l'envoi du SMS:", error)
    return false
  }
}
