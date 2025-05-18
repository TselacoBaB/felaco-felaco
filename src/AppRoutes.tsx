import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import MobileLayout from "./components/MobileLayout";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Home from "./pages/app/Home";
import Explore from "./pages/app/Explore";
import Messages from "./pages/app/Messages";
import Profile from "./pages/app/Profile";
import PostUpload from "./pages/app/upload/Post";
import StoryUpload from "./pages/app/upload/Story";
import ReelUpload from "./pages/app/upload/Reel";
import LiveStream from "./pages/app/upload/Live";
import CreatorApplication from "./pages/CreatorApplication";
import CreatorProfile from "./pages/app/CreatorProfile";
import CreatorDashboard from "./pages/app/CreatorDashboard";
import CreatorAnalytics from "./pages/app/CreatorAnalytics";
import CreatorWallet from "./pages/app/CreatorWallet";
import Settings from "./pages/app/Settings";
import NotFound from "./pages/NotFound";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/creator-application" element={<CreatorApplication />} />
      
      {/* Protected Mobile App Routes */}
      <Route path="/app" element={
        <ProtectedRoute>
          <MobileLayout>
            <Home />
          </MobileLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/app/explore" element={
        <ProtectedRoute>
          <MobileLayout>
            <Explore />
          </MobileLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/app/messages" element={
        <ProtectedRoute>
          <MobileLayout>
            <Messages />
          </MobileLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/app/profile" element={
        <ProtectedRoute>
          <MobileLayout>
            <Profile />
          </MobileLayout>
        </ProtectedRoute>
      } />
      
      {/* Creator Profile Viewing Route */}
      <Route path="/app/creator/:username" element={
        <ProtectedRoute>
          <MobileLayout>
            <CreatorProfile />
          </MobileLayout>
        </ProtectedRoute>
      } />
      
      {/* Upload Routes */}
      <Route path="/app/upload/post" element={
        <ProtectedRoute>
          <PostUpload />
        </ProtectedRoute>
      } />
      
      <Route path="/app/upload/story" element={
        <ProtectedRoute>
          <StoryUpload />
        </ProtectedRoute>
      } />
      
      <Route path="/app/upload/reel" element={
        <ProtectedRoute>
          <ReelUpload />
        </ProtectedRoute>
      } />
      
      <Route path="/app/upload/live" element={
        <ProtectedRoute requiredRole="creator">
          <LiveStream />
        </ProtectedRoute>
      } />
      
      {/* Creator Dashboard Routes */}
      <Route path="/app/creator-dashboard" element={
        <ProtectedRoute requiredRole="creator">
          <MobileLayout>
            <CreatorDashboard />
          </MobileLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/app/creator-analytics" element={
        <ProtectedRoute requiredRole="creator">
          <MobileLayout>
            <CreatorAnalytics />
          </MobileLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/app/creator-wallet" element={
        <ProtectedRoute requiredRole="creator">
          <MobileLayout>
            <CreatorWallet />
          </MobileLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/app/settings" element={
        <ProtectedRoute>
          <MobileLayout>
            <Settings />
          </MobileLayout>
        </ProtectedRoute>
      } />
      
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
