
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import CountdownTimer from "@/components/CountdownTimer";
import CreatorApplicationForm from "@/components/CreatorApplicationForm";
import VerificationUpload from "@/components/VerificationUpload";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Step, StepComplete, StepDescription, StepItem, Stepper, StepTitle } from "@/components/ui/stepper";

const CreatorApplication = () => {
  const { user, loading, userProfile } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("info");
  const [formState, setFormState] = useState<{
    personal: boolean;
    verification: boolean;
    agreement: boolean;
  }>({
    personal: false,
    verification: false,
    agreement: false,
  });
  const [applicationStatus, setApplicationStatus] = useState<string | null>(null);
  
  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }

    // Check if user already has a pending application
    const checkApplicationStatus = async () => {
      if (user) {
        const { data, error } = await supabase
          .from("creator_applications")
          .select("status")
          .eq("user_id", user.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        if (data && !error) {
          setApplicationStatus(data.status);
        }
      }
    };

    checkApplicationStatus();
  }, [user, loading, navigate]);

  const handleStepComplete = (step: string, completed: boolean) => {
    setFormState(prev => ({
      ...prev,
      [step]: completed
    }));
  };

  // If application is pending or approved, show status
  if (applicationStatus) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-gray-100 px-4 py-12">
        <div className="max-w-md mx-auto text-center">
          <div className="bg-white rounded-xl shadow-md p-8">
            <div className="mb-6">
              {applicationStatus === "pending" ? (
                <div className="mx-auto w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-500"><path d="M12 2v4"/><path d="M12 18v4"/><path d="M4.93 4.93l2.83 2.83"/><path d="M16.24 16.24l2.83 2.83"/><path d="M2 12h4"/><path d="M18 12h4"/><path d="M4.93 19.07l2.83-2.83"/><path d="M16.24 7.76l2.83-2.83"/></svg>
                </div>
              ) : (
                <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                </div>
              )}
            </div>
            
            <h2 className="text-2xl font-bold mb-4">
              {applicationStatus === "pending" 
                ? "Application Under Review" 
                : "Application Approved!"}
            </h2>
            
            <p className="text-gray-600 mb-6">
              {applicationStatus === "pending"
                ? "Our team is currently reviewing your creator application. This typically takes 1-3 business days."
                : "Congratulations! Your creator application has been approved. You now have access to creator features."}
            </p>
            
            <button 
              onClick={() => navigate("/app")}
              className="w-full py-3 px-6 rounded-lg bg-felaco-purple text-white font-medium hover:bg-felaco-purple/90 transition-colors"
            >
              {applicationStatus === "pending" 
                ? "Return to App" 
                : "Start Creating"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-100">
      <div className="max-w-4xl mx-auto px-4 py-12 md:py-24">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Join Our Creator Program</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Apply to become a content creator on Felaco and start earning by sharing your content with your audience.
          </p>
        </div>
        
        <div className="mb-12">
          <CountdownTimer />
        </div>
        
        <Stepper 
          className="max-w-lg mx-auto mb-8" 
          activeStep={
            activeTab === "info" ? 0 : 
            activeTab === "verification" ? 1 : 
            activeTab === "agreement" ? 2 : 0
          }
        >
          <StepItem>
            <Step className={formState.personal ? "bg-green-500" : ""}>
              {formState.personal && <StepComplete />}
            </Step>
            <div className="mt-2">
              <StepTitle>Personal Information</StepTitle>
              <StepDescription>Profile and contact details</StepDescription>
            </div>
          </StepItem>
          
          <StepItem>
            <Step className={formState.verification ? "bg-green-500" : ""}>
              {formState.verification && <StepComplete />}
            </Step>
            <div className="mt-2">
              <StepTitle>Verification</StepTitle>
              <StepDescription>ID and face verification</StepDescription>
            </div>
          </StepItem>
          
          <StepItem>
            <Step className={formState.agreement ? "bg-green-500" : ""}>
              {formState.agreement && <StepComplete />}
            </Step>
            <div className="mt-2">
              <StepTitle>Agreement</StepTitle>
              <StepDescription>Terms and conditions</StepDescription>
            </div>
          </StepItem>
        </Stepper>
        
        <Card className="max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle>Creator Application</CardTitle>
            <CardDescription>
              Complete all sections to submit your application. Our team will review it within 1-3 business days.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="info">Information</TabsTrigger>
                <TabsTrigger value="verification">Verification</TabsTrigger>
                <TabsTrigger value="agreement">Agreement</TabsTrigger>
              </TabsList>
              <TabsContent value="info">
                <CreatorApplicationForm 
                  onComplete={(completed) => handleStepComplete('personal', completed)}
                  onNext={() => setActiveTab('verification')} 
                />
              </TabsContent>
              <TabsContent value="verification">
                <VerificationUpload
                  onComplete={(completed) => handleStepComplete('verification', completed)} 
                  onNext={() => setActiveTab('agreement')}
                  onBack={() => setActiveTab('info')}
                />
              </TabsContent>
              <TabsContent value="agreement">
                <CreatorAgreement 
                  onComplete={(completed) => handleStepComplete('agreement', completed)} 
                  onBack={() => setActiveTab('verification')}
                  isFormComplete={formState.personal && formState.verification}
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreatorApplication;
