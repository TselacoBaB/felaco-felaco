
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import CountdownTimer from "@/components/CountdownTimer";

type Application = {
  id: string;
  status: string;
  created_at: string;
};

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [application, setApplication] = useState<Application | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchApplication();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchApplication = async () => {
    try {
      const { data, error } = await supabase
        .from("creator_applications")
        .select("id, status, created_at")
        .eq("user_id", user?.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      setApplication(data);
    } catch (error) {
      console.error("Error fetching application:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleApplyClick = () => {
    navigate("/creator-application");
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  };

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h2 className="text-2xl font-bold mb-2 md:mb-0">Welcome, {user?.email}</h2>
        <Button variant="outline" onClick={signOut}>Sign Out</Button>
      </div>

      <div className="mb-8">
        <CountdownTimer />
      </div>
      
      {application ? (
        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold mb-2">Your Creator Application</h3>
          <div className="flex items-center gap-2 mb-4">
            <span className="text-sm text-gray-600">Status:</span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              application.status === "pending" 
                ? "bg-yellow-100 text-yellow-700" 
                : application.status === "approved" 
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
            }`}>
              {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
            </span>
          </div>
          <p className="text-sm text-gray-600">
            Submitted on {formatDate(application.created_at)}
          </p>
        </div>
      ) : (
        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold mb-2">Become a Creator</h3>
          <p className="text-gray-600 mb-4">
            Apply to become a content creator on Felaco and start monetizing your content.
          </p>
          <Button onClick={handleApplyClick} className="cta-button">Apply Now</Button>
        </div>
      )}

      <div className="border-t pt-6 mt-6">
        <h3 className="text-lg font-semibold mb-4">Platform Launch</h3>
        <p className="text-gray-600">
          Felaco is launching on May 18, 2025. Get ready to connect with your audience 
          and start earning from your content!
        </p>
      </div>
    </div>
  );
};

export default Dashboard;
