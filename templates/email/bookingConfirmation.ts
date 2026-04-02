export function bookingConfirmationHtml({
  brand = 'Tropigo',
  bookingRef,
  tourName,
  date,
  quantity,
  total,
  currency = 'MUR',
  supportEmail = 'support@example.com',
}: {
  brand?: string
  bookingRef: string
  tourName: string
  date: string
  quantity: number
  total: number
  currency?: string
  supportEmail?: string
}) {
  return `
  <div style="font-family:Arial,sans-serif;background:#fbf9f4;padding:24px;color:#1b1c19;">
    <div style="max-width:640px;margin:0 auto;background:#ffffff;border:1px solid #e4e2dd;border-radius:16px;overflow:hidden;">
      <div style="background:#001e40;color:#ffffff;padding:20px 24px;">
        <div style="letter-spacing:0.2em;font-weight:700;">${brand.toUpperCase()}</div>
      </div>
      <div style="padding:24px;">
        <h1 style="margin:0 0 8px 0;font-size:22px;color:#001e40;">Booking Confirmed</h1>
        <p style="margin:0 0 16px 0;color:#43474f;">Reference <strong>${bookingRef}</strong></p>
        <div style="border:1px solid #e4e2dd;border-radius:12px;padding:16px;margin-bottom:16px;">
          <div style="font-weight:700;color:#001e40;">${tourName}</div>
          <div style="color:#43474f;margin-top:4px;">Date: ${date}</div>
          <div style="color:#43474f;">Guests: ${quantity}</div>
          <div style="margin-top:8px;font-weight:700;color:#001e40;">Total: ${currency} ${Number(total).toLocaleString()}</div>
        </div>
        <p style="color:#43474f;">Thank you for booking with ${brand}. Our team will follow up with any additional details.</p>
        <p style="color:#43474f;">Need help? Contact us at <a href="mailto:${supportEmail}">${supportEmail}</a>.</p>
      </div>
      <div style="padding:16px 24px;border-top:1px solid #e4e2dd;color:#737780;font-size:12px;">© ${new Date().getFullYear()} ${brand}</div>
    </div>
  </div>`
}

