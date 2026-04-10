import { Resend } from 'resend'

export function getResend() {
  const key = process.env.RESEND_API_KEY
  if (!key) throw new Error('RESEND_API_KEY environment variable is not set')
  return new Resend(key)
}

export const EMAIL_FROM = process.env.RESEND_FROM_EMAIL ?? 'Tropigo <hello@tropigo.mu>'
export const EMAIL_REPLY_TO = process.env.RESEND_REPLY_TO ?? 'hello@tropigo.mu'
