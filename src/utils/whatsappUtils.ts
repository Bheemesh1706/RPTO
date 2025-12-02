export function openWhatsApp(phone: string, name: string): void {
  if (!phone || phone === 'N/A') {
    console.error('Phone number is missing or invalid for WhatsApp.');
    return;
  }

  const cleanPhone = phone.replace(/[^0-9]/g, '');
  const initialMessage = encodeURIComponent(
    `Hello ${name}, I am contacting you from the RPTO regarding your enquiry. How can I help you today?`
  );
  
  window.open(`https://wa.me/${cleanPhone}?text=${initialMessage}`, '_blank');
}

