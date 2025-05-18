// This file will contain shared types for payment gateways

export interface PaymentRequest {
  amount: number;
  userId: string;
  reference: string;
  // Add more fields as needed
}

export interface PaymentGateway {
  enabled: boolean;
  name: string;
  merchantCode: string;
  // ...other fields
}
