// This file contains configuration for payment gateways.
// Sensitive keys should be loaded from environment variables in production!

export const paymentGateways = {
  ozow: {
    enabled: import.meta.env.VITE_OZOW_ENABLED === "true", // Toggle from super admin panel in the future
    name: import.meta.env.VITE_OZOW_NAME || "Ozow Payment Gateway",
    merchantCode: import.meta.env.VITE_OZOW_MERCHANT_CODE || "",
    defaultBankAccount: import.meta.env.VITE_OZOW_DEFAULT_BANK_ACCOUNT || "",
    timeZone: import.meta.env.VITE_OZOW_TIME_ZONE || "",
    privateKey: import.meta.env.VITE_OZOW_PRIVATE_KEY || "",
    apiKey: import.meta.env.VITE_OZOW_API_KEY || "",
    payoutsApiKey: import.meta.env.VITE_OZOW_PAYOUTS_API_KEY || "",
    companyRegNumber: import.meta.env.VITE_OZOW_COMPANY_REG_NUMBER || "",
    // Add other fields as needed, always using environment variables
  },
  // Add more gateways here in the future, using the same pattern
};
