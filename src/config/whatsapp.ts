// WhatsApp Button Configuration
export const whatsappConfig = {
  // Your WhatsApp phone number (with country code, no + or spaces)
  phoneNumber: "919876543210", // Replace with your actual number
  
  // Default message that will be pre-filled when users click the button
  defaultMessage: "Hi! I'd like to know more about Kislay Naturals products.",
  
  // Button size in pixels
  buttonSize: 50,
  
  // Button position (can be customized if needed)
  position: {
    bottom: "1.5rem", // 6 in Tailwind = 1.5rem
    right: "1.5rem",  // 6 in Tailwind = 1.5rem
  },
  
  // WhatsApp brand color
  brandColor: "#25D366",
  
  // Hover tooltip text
  tooltipText: "Chat with us!",
  
  // Animation settings
  animation: {
    duration: 300, // milliseconds
    scale: 1.1,    // hover scale factor
  }
};

// Example usage:
// import { whatsappConfig } from '@/config/whatsapp';
// 
// <WhatsAppButton 
//   phoneNumber={whatsappConfig.phoneNumber}
//   message={whatsappConfig.defaultMessage}
//   size={whatsappConfig.buttonSize}
// /> 