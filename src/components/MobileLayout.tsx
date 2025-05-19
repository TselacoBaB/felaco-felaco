import { ReactNode, useEffect, useState } from "react";
import BottomNav from "./BottomNav";
import { useLocation } from "react-router-dom";

interface MobileLayoutProps {
  children: ReactNode;
}

const MobileLayout = ({ children }: MobileLayoutProps) => {
  const location = useLocation();
  const [isPageTransitioning, setIsPageTransitioning] = useState(false);
  const [swipeDirection, setSwipeDirection] = useState<"left" | "right" | null>(null);
  const [startX, setStartX] = useState(0);

  // Handle page transitions
  useEffect(() => {
    // Log page view for analytics
    console.log('Page view:', location.pathname);
    
    // Add page transition effect
    setIsPageTransitioning(true);
    
    // Determine swipe direction based on navigation history
    const paths = sessionStorage.getItem('navigationPaths');
    if (paths) {
      const pathsArray = JSON.parse(paths);
      if (pathsArray.length >= 2 && pathsArray[pathsArray.length - 2] === location.pathname) {
        setSwipeDirection('right'); // Going back
      } else {
        setSwipeDirection('left'); // Going forward
      }
      
      // Update paths array
      const newPaths = [...pathsArray.slice(-4), location.pathname];
      sessionStorage.setItem('navigationPaths', JSON.stringify(newPaths));
    } else {
      // First navigation
      sessionStorage.setItem('navigationPaths', JSON.stringify([location.pathname]));
      setSwipeDirection('left');
    }
    
    const timer = setTimeout(() => {
      setIsPageTransitioning(false);
    }, 300);
    
    return () => clearTimeout(timer);
  }, [location]);

  // Touch gesture handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    setStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const endX = e.changedTouches[0].clientX;
    const diffX = endX - startX;
    
    // If swipe is significant enough (more than 100px)
    if (Math.abs(diffX) > 100) {
      if (diffX > 0) {
        // Swiped right, go back
        window.history.back();
      } else {
        // Swiped left - could implement forward navigation
        // or specific app behavior here
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <main className="flex-1 w-full flex justify-center">
        <div className="w-full max-w-4xl px-4 sm:px-4 md:px-8 lg:px-8 xl:px-8" style={{ width: '80%' }}>
          {children}
        </div>
      </main>
      <BottomNav />
    </div>
  );
};

export default MobileLayout;
