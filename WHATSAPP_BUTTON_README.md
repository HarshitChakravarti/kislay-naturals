# WhatsApp Floating Button

A responsive, accessible WhatsApp floating button that stays fixed in the bottom-right corner of the screen.

## Features

✅ **Fixed Positioning**: Stays in bottom-right corner even when scrolling  
✅ **WhatsApp Brand Colors**: Uses official WhatsApp green (#25D366)  
✅ **Responsive Design**: Works perfectly on mobile and desktop  
✅ **Hover Effects**: Smooth scale animation and tooltip  
✅ **Accessibility**: Keyboard navigation and screen reader support  
✅ **Customizable**: Easy to modify phone number, message, and styling  
✅ **Performance**: Lightweight with smooth animations  

## Quick Setup

1. **Update your WhatsApp number** in `src/config/whatsapp.ts`:
   ```typescript
   phoneNumber: "919876543210", // Replace with your actual number
   ```

2. **Customize the default message**:
   ```typescript
   defaultMessage: "Hi! I'd like to know more about Kislay Naturals products.",
   ```

3. **The button is already integrated** into your main layout and will appear on all pages.

## Configuration Options

### Basic Settings (`src/config/whatsapp.ts`)

```typescript
export const whatsappConfig = {
  phoneNumber: "919876543210",        // Your WhatsApp number
  defaultMessage: "Custom message",   // Pre-filled message
  buttonSize: 50,                     // Button size in pixels
  tooltipText: "Chat with us!",       // Hover tooltip text
  animation: {
    duration: 300,                    // Animation duration (ms)
    scale: 1.1,                      // Hover scale factor
  }
};
```

### Advanced Customization

You can also pass props directly to the component:

```tsx
<WhatsAppButton 
  phoneNumber="919876543210"
  message="Custom message here"
  size={60}
/>
```

## Styling

The button uses Tailwind CSS classes and includes:

- **Position**: `fixed bottom-6 right-6` (bottom-right corner)
- **Size**: Configurable (default: 50px × 50px)
- **Colors**: WhatsApp green (#25D366) with shadow
- **Animations**: Smooth hover scale and transitions
- **Responsive**: Adjusts position on mobile devices

## Mobile Optimization

- Automatically adjusts position for mobile screens
- Touch-friendly sizing
- Optimized for mobile browsers

## Accessibility Features

- Keyboard navigation support (Enter/Space keys)
- Screen reader friendly with proper ARIA labels
- Focus indicators for keyboard users
- Semantic HTML structure

## Browser Support

- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## Troubleshooting

### Button not visible?
- Check if the component is imported in your layout
- Verify z-index isn't being overridden
- Ensure no CSS conflicts

### WhatsApp not opening?
- Verify phone number format (country code + number, no spaces)
- Check if WhatsApp is installed on mobile devices
- Test the generated URL manually

### Styling issues?
- Check Tailwind CSS is properly configured
- Verify no conflicting CSS rules
- Use browser dev tools to inspect element

## Customization Examples

### Change Button Size
```typescript
// In config file
buttonSize: 60, // Larger button

// Or pass as prop
<WhatsAppButton size={60} />
```

### Custom Message
```typescript
// In config file
defaultMessage: "Hi! I'm interested in your products.",

// Or pass as prop
<WhatsAppButton message="Custom message here" />
```

### Different Phone Number
```typescript
// In config file
phoneNumber: "1234567890",

// Or pass as prop
<WhatsAppButton phoneNumber="1234567890" />
```

## Integration Notes

- The button is automatically added to all pages via the main layout
- No additional imports needed on individual pages
- Works with Next.js routing and page transitions
- Compatible with your existing Redux and Auth context setup

## Support

If you need help customizing the button or encounter any issues, check:
1. The configuration file for correct settings
2. Browser console for any JavaScript errors
3. Network tab to ensure WhatsApp URLs are generated correctly 