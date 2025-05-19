import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";

const Settings = () => {
  const { signOut } = useAuth();

  return (
    <div className="flex justify-center w-full min-h-screen bg-gray-50">
      <div className="w-full max-w-4xl px-4 sm:px-4 md:px-8 lg:px-8 xl:px-8" style={{ width: '80%' }}>
        <div className="max-w-lg mx-auto p-6">
          <h1 className="text-2xl font-bold mb-6">Settings</h1>
          {/* Add more settings here as needed */}
          <div className="mt-8">
            <Button variant="destructive" onClick={signOut} className="w-full">
              Log Out
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
