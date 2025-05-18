// Ozow payment integration logic
// In production, sensitive actions should be handled server-side!
import { paymentGateways } from "./config";

export function isOzowEnabled() {
  return paymentGateways.ozow.enabled;
}

export function getOzowConfig() {
  return paymentGateways.ozow;
}

// Example: Generate payment request payload (to be sent to backend or Ozow API)
export function createOzowPaymentRequest({ amount, userId, reference }) {
  const config = getOzowConfig();
  return {
    merchantCode: config.merchantCode,
    amount,
    userId,
    reference,
    // Add more fields as required by Ozow API
  };
}

// Add more Ozow-related functions as needed
