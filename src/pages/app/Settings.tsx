import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";

const Settings = () => {
  const { signOut } = useAuth();

  return (
    <div className="max-w-lg mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>
      {/* Add more settings here as needed */}
      <div className="mt-8">
        <Button variant="destructive" onClick={signOut} className="w-full">
          Log Out
        </Button>
      </div>
    </div>
  );
};

export default Settings;
