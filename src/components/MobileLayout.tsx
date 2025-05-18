
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
    <div 
      className="flex min-h-screen flex-col bg-white"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <main 
        className={`flex-1 pb-16 transition-all duration-300 ease-in-out ${
          isPageTransitioning 
            ? 'opacity-0 ' + (swipeDirection === 'left' ? 'translate-x-6' : '-translate-x-6')
            : 'opacity-100 translate-x-0'
        }`}
      >
        {children}
      </main>
      <BottomNav />
    </div>
  );
};

export default MobileLayout;
