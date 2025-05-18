
import { useEffect, useState } from "react";
import { Clock } from "lucide-react";

const CountdownTimer = () => {
  const targetDate = new Date("2025-05-18T23:00:00Z");
  const [timeRemaining, setTimeRemaining] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const difference = targetDate.getTime() - now.getTime();
      
      if (difference <= 0) {
        clearInterval(interval);
        setTimeRemaining({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);
      
      setTimeRemaining({ days, hours, minutes, seconds });
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 w-full max-w-3xl mx-auto">
      <div className="flex items-center gap-2 mb-4">
        <Clock className="text-felaco-purple h-5 w-5" />
        <h3 className="text-lg font-semibold">Launch Countdown</h3>
      </div>
      
      <div className="grid grid-cols-4 gap-2 text-center">
        <div className="bg-gradient-to-br from-felaco-purple/10 to-felaco-blue/10 p-3 rounded-lg">
          <div className="text-3xl md:text-4xl font-bold text-felaco-purple">{timeRemaining.days}</div>
          <div className="text-xs md:text-sm text-gray-600">Days</div>
        </div>
        
        <div className="bg-gradient-to-br from-felaco-purple/10 to-felaco-blue/10 p-3 rounded-lg">
          <div className="text-3xl md:text-4xl font-bold text-felaco-purple">{timeRemaining.hours}</div>
          <div className="text-xs md:text-sm text-gray-600">Hours</div>
        </div>
        
        <div className="bg-gradient-to-br from-felaco-purple/10 to-felaco-blue/10 p-3 rounded-lg">
          <div className="text-3xl md:text-4xl font-bold text-felaco-purple">{timeRemaining.minutes}</div>
          <div className="text-xs md:text-sm text-gray-600">Minutes</div>
        </div>
        
        <div className="bg-gradient-to-br from-felaco-purple/10 to-felaco-blue/10 p-3 rounded-lg">
          <div className="text-3xl md:text-4xl font-bold text-felaco-purple">{timeRemaining.seconds}</div>
          <div className="text-xs md:text-sm text-gray-600">Seconds</div>
        </div>
      </div>
      
      <p className="text-center text-sm text-gray-600 mt-4">
        Until official launch on May 18, 2025 at 23:00 UTC
      </p>
    </div>
  );
};

export default CountdownTimer;
