
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface VerificationUploadProps {
  onComplete: (completed: boolean) => void;
  onNext: () => void;
  onBack: () => void;
}

const VerificationUpload = ({ onComplete, onNext, onBack }: VerificationUploadProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [idFile, setIdFile] = useState<File | null>(null);
  const [idPreview, setIdPreview] = useState<string | null>(null);
  const [selfieFile, setSelfieFile] = useState<File | null>(null);
  const [selfiePreview, setSelfiePreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({
    id: false,
    selfie: false
  });

  // Handle ID file selection
  const handleIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setIdFile(file);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setIdPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle selfie file selection
  const handleSelfieChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelfieFile(file);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelfiePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle file upload
  const handleUpload = async () => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to upload verification documents",
        variant: "destructive",
      });
      return;
    }

    if (!idFile || !selfieFile) {
      toast({
        title: "Missing files",
        description: "Please upload both your ID and a selfie",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);

    try {
      // Upload ID document
      const idFileName = `${user.id}/id-verification-${Date.now()}`;
      const { error: idError } = await supabase.storage
        .from("verification")
        .upload(idFileName, idFile);

      if (idError) throw new Error(`Error uploading ID: ${idError.message}`);
      setUploadProgress(prev => ({ ...prev, id: true }));

      // Upload selfie
      const selfieFileName = `${user.id}/selfie-verification-${Date.now()}`;
      const { error: selfieError } = await supabase.storage
        .from("verification")
        .upload(selfieFileName, selfieFile);

      if (selfieError) throw new Error(`Error uploading selfie: ${selfieError.message}`);
      setUploadProgress(prev => ({ ...prev, selfie: true }));

      // Update application record with verification info
      const { error: updateError } = await supabase
        .from("creator_applications")
        .update({
          id_document_path: idFileName,
          selfie_path: selfieFileName,
        })
        .eq("user_id", user.id)
        .eq("status", "draft");

      if (updateError) throw new Error(`Error updating application: ${updateError.message}`);

      toast({
        title: "Documents uploaded",
        description: "Your verification documents have been uploaded successfully",
      });
      
      // Mark this step as complete
      onComplete(true);
      
      // Move to next step
      onNext();
    } catch (error: any) {
      toast({
        title: "Error uploading documents",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg">
      <h2 className="text-2xl font-bold mb-6">Identity Verification</h2>
      
      <div className="space-y-8">
        <div>
          <h3 className="text-lg font-medium mb-4">Upload ID Document</h3>
          <p className="text-gray-600 mb-4">
            Please upload a high-resolution image of your government-issued ID (passport, driver's license, etc.).
          </p>
          
          <Card className="border-dashed">
            <CardContent className="p-4">
              {idPreview ? (
                <div className="relative">
                  <img src={idPreview} alt="ID Preview" className="w-full max-h-60 object-contain rounded" />
                  <button 
                    onClick={() => {
                      setIdFile(null);
                      setIdPreview(null);
                    }}
                    className="absolute top-2 right-2 bg-black/50 text-white rounded-full p-1"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12">
                  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                  <p className="mt-4 text-sm text-gray-500">Click to select your ID document</p>
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={handleIdChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </div>
              )}
              {uploadProgress.id && (
                <div className="mt-2 flex items-center text-green-600">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                  <span className="ml-2 text-sm">Uploaded successfully</span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        <div>
          <h3 className="text-lg font-medium mb-4">Upload Selfie</h3>
          <p className="text-gray-600 mb-4">
            Please upload a clear selfie of yourself holding your ID next to your face.
          </p>
          
          <Card className="border-dashed">
            <CardContent className="p-4">
              {selfiePreview ? (
                <div className="relative">
                  <img src={selfiePreview} alt="Selfie Preview" className="w-full max-h-60 object-contain rounded" />
                  <button 
                    onClick={() => {
                      setSelfieFile(null);
                      setSelfiePreview(null);
                    }}
                    className="absolute top-2 right-2 bg-black/50 text-white rounded-full p-1"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12">
                  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400"><rect width="18" height="18" x="3" y="3" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
                  <p className="mt-4 text-sm text-gray-500">Click to select your selfie with ID</p>
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={handleSelfieChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </div>
              )}
              {uploadProgress.selfie && (
                <div className="mt-2 flex items-center text-green-600">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                  <span className="ml-2 text-sm">Uploaded successfully</span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={onBack}
          >
            Back
          </Button>
          <Button 
            onClick={handleUpload} 
            disabled={!idFile || !selfieFile || uploading}
            className="bg-felaco-purple hover:bg-felaco-purple/90"
          >
            {uploading ? "Uploading..." : "Upload & Continue"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default VerificationUpload;
