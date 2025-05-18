
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

interface CreatorAgreementProps {
  onComplete: (completed: boolean) => void;
  onBack: () => void;
  isFormComplete: boolean;
}

const CreatorAgreement = ({ onComplete, onBack, isFormComplete }: CreatorAgreementProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [agreed, setAgreed] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to submit an application",
        variant: "destructive",
      });
      return;
    }

    if (!agreed) {
      toast({
        title: "Agreement required",
        description: "You must agree to the terms and conditions",
        variant: "destructive",
      });
      return;
    }

    if (!isFormComplete) {
      toast({
        title: "Incomplete application",
        description: "Please complete all previous sections before submitting",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);

    try {
      // Update application status to pending
      const { error } = await supabase
        .from("creator_applications")
        .update({
          status: "pending",
        })
        .eq("user_id", user.id)
        .eq("status", "draft");

      if (error) throw error;

      toast({
        title: "Application submitted",
        description: "Your creator application has been submitted for review",
      });
      
      // Mark this step as complete
      onComplete(true);
      
      // Redirect to application status page
      setTimeout(() => {
        navigate("/creator-application");
      }, 1500);
    } catch (error: any) {
      toast({
        title: "Error submitting application",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg">
      <h2 className="text-2xl font-bold mb-6">Creator Agreement</h2>
      
      <div className="prose max-w-none mb-8">
        <h3>Terms and Conditions</h3>
        <p>
          By agreeing to these terms, you acknowledge that you are at least 18 years of age and are legally able to enter into this agreement.
        </p>
        
        <h4>Content Guidelines</h4>
        <p>
          As a creator on Felaco, you agree to:
        </p>
        <ul>
          <li>Only upload content that you own or have the rights to distribute</li>
          <li>Not upload any illegal content or content featuring individuals under 18 years of age</li>
          <li>Respect copyright laws and intellectual property rights</li>
          <li>Tag all content appropriately with the correct content warnings</li>
          <li>Verify the age of any individuals who appear in your content</li>
        </ul>
        
        <h4>Payment Terms</h4>
        <p>
          Felaco retains 20% of all earnings generated through the platform. Payments are processed on a monthly basis, provided your account has accumulated at least $50 in earnings. You will receive 80% of all subscription fees, tips, and pay-per-view revenue after payment processing fees.
        </p>
        
        <h4>Account Termination</h4>
        <p>
          Felaco reserves the right to terminate your creator account for violations of these terms, illegal activity, or fraudulent behavior. Upon termination, you may lose access to your earnings and content on the platform.
        </p>
        
        <h4>Privacy and Data</h4>
        <p>
          You agree to our Privacy Policy regarding the collection and use of your personal data. Your verification documents will be stored securely and only used for identity verification purposes.
        </p>
      </div>
      
      <div className="flex items-start space-x-3 mb-8">
        <Checkbox id="terms" checked={agreed} onCheckedChange={(checked) => setAgreed(checked === true)} />
        <label htmlFor="terms" className="text-sm leading-tight cursor-pointer">
          I have read and agree to the Creator Terms and Conditions, Privacy Policy, and Content Guidelines. I confirm that I am at least 18 years of age and all information I've provided is accurate.
        </label>
      </div>
      
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={onBack}
        >
          Back
        </Button>
        <Button 
          onClick={handleSubmit} 
          disabled={!agreed || submitting || !isFormComplete}
          className="bg-felaco-purple hover:bg-felaco-purple/90"
        >
          {submitting ? "Submitting..." : "Submit Application"}
        </Button>
      </div>
    </div>
  );
};

export default CreatorAgreement;
