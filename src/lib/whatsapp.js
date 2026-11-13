// WhatsApp chat link for the phone number shown on the site, with an
// optional pre-filled first message.
export const waLink = (phone, text) =>
  `https://wa.me/${String(phone || '').replace(/\D/g, '')}${text ? `?text=${encodeURIComponent(text)}` : ''}`
