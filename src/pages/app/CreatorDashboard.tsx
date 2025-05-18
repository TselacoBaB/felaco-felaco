
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const CreatorDashboard = () => {
  const navigate = useNavigate();
  const { userProfile } = useAuth();
  const [activeTab, setActiveTab] = useState("content");

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Creator Dashboard</h1>
        <Button 
          variant="outline"
          size="sm"
          onClick={() => navigate('/app/creator-analytics')}
        >
          Analytics
        </Button>
      </div>
      
      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <Card>
          <CardHeader className="p-3">
            <CardTitle className="text-sm text-gray-500">Total Fans</CardTitle>
          </CardHeader>
          <CardContent className="p-3 pt-0">
            <p className="text-2xl font-bold">0</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="p-3">
            <CardTitle className="text-sm text-gray-500">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent className="p-3 pt-0">
            <p className="text-2xl font-bold">$0.00</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="p-3">
            <CardTitle className="text-sm text-gray-500">Content Posts</CardTitle>
          </CardHeader>
          <CardContent className="p-3 pt-0">
            <p className="text-2xl font-bold">0</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="p-3">
            <CardTitle className="text-sm text-gray-500">Live Sessions</CardTitle>
          </CardHeader>
          <CardContent className="p-3 pt-0">
            <p className="text-2xl font-bold">0</p>
          </CardContent>
        </Card>
      </div>
      
      {/* Creator Wallet Summary */}
      <Card className="mb-6">
        <CardHeader className="p-4 pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg">Wallet Balance</CardTitle>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate('/app/creator-wallet')}
            >
              View Details
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-4 pt-2">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-3xl font-bold">$0.00</p>
              <p className="text-xs text-gray-500">Available for withdrawal</p>
            </div>
            <Button>Withdraw</Button>
          </div>
        </CardContent>
      </Card>
      
      {/* Content Management */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="sales">Sales</TabsTrigger>
          <TabsTrigger value="fans">Fans</TabsTrigger>
        </TabsList>
        
        <TabsContent value="content">
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col items-center justify-center py-8">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-300 mb-3"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M12 9v6"/><path d="M9 12h6"/></svg>
                <p className="text-center text-gray-500 mb-4">You haven't created any content yet</p>
                <Button onClick={() => navigate('/app/upload/post')}>Create Content</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="sales">
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col items-center justify-center py-8">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-300 mb-3"><path d="M21 11V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h6"/><path d="m12 12 4 10 1.7-4.3L22 16Z"/></svg>
                <p className="text-center text-gray-500">No sales data available yet</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="fans">
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col items-center justify-center py-8">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-300 mb-3"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                <p className="text-center text-gray-500">No fans yet</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Quick Actions */}
      <h2 className="text-lg font-medium mb-3">Quick Actions</h2>
      <div className="grid grid-cols-2 gap-3">
        <Button 
          className="h-auto py-4 flex flex-col items-center justify-center"
          variant="outline"
          onClick={() => navigate('/app/upload/post')}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mb-2"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M12 9v6"/><path d="M9 12h6"/></svg>
          <span>New Post</span>
        </Button>
        
        <Button
          className="h-auto py-4 flex flex-col items-center justify-center"
          variant="outline"
          onClick={() => navigate('/app/upload/live')}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mb-2"><path d="m22 8-6 4 6 4V8Z"/><rect width="14" height="12" x="2" y="6" rx="2" ry="2"/></svg>
          <span>Go Live</span>
        </Button>
        
        <Button
          className="h-auto py-4 flex flex-col items-center justify-center"
          variant="outline"
          onClick={() => navigate('/app/creator-analytics')}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mb-2"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg>
          <span>Analytics</span>
        </Button>
        
        <Button
          className="h-auto py-4 flex flex-col items-center justify-center"
          variant="outline"
          onClick={() => navigate('/app/creator-wallet')}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mb-2"><path d="M2 18a1 1 0 0 0 1 1h18a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v2z"/><path d="M20 15V8a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v7"/><path d="M2 15h20"/></svg>
          <span>Wallet</span>
        </Button>
      </div>
    </div>
  );
};

export default CreatorDashboard;
