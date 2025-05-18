
import { useState } from "react";

const Explore = () => {
  const [searchQuery, setSearchQuery] = useState("");
  
  // Mock grid data (would be fetched from API in a real app)
  const gridItems = Array.from({ length: 24 }, (_, i) => i + 1);
  
  return (
    <div className="px-4 py-6">
      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search"
            className="w-full rounded-lg border border-gray-300 bg-gray-100 py-2 pl-10 pr-4 text-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-1">
        {gridItems.map((item) => (
          <div
            key={item}
            className="aspect-square w-full bg-gray-200"
          ></div>
        ))}
      </div>
    </div>
  );
};

export default Explore;
