// This is a React hook to initiate a wallet top-up via Ozow
// In production, sensitive logic should be handled server-side!
import { createOzowPaymentRequest, isOzowEnabled } from "../paymentGateways/ozow";
import { useState } from "react";

export function useOzowTopup() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paymentUrl, setPaymentUrl] = useState<string | null>(null);

  const startTopup = async (amount: number, userId: string) => {
    setLoading(true);
    setError(null);
    try {
      if (!isOzowEnabled()) throw new Error("Ozow payments are currently disabled.");
      // Generate payment request (should POST to backend in production)
      const reference = `TOPUP-${userId}-${Date.now()}`;
      const payload = createOzowPaymentRequest({ amount, userId, reference });
      // TODO: Send payload to backend to get payment URL
      // For demo, just simulate a payment URL
      setPaymentUrl(`https://pay.ozow.com/demo?ref=${reference}`);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return { startTopup, loading, error, paymentUrl };
}
