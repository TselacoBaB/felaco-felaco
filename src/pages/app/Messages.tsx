
import { useState } from "react";

const Messages = () => {
  const [searchQuery, setSearchQuery] = useState("");
  
  // Mock conversation data (would be fetched from API in a real app)
  const conversations = [
    { id: 1, name: "Jane Cooper", message: "Hey, how are you doing?", time: "2m", unread: 2, avatar: "" },
    { id: 2, name: "Wade Warren", message: "Sounds good!", time: "1h", unread: 0, avatar: "" },
    { id: 3, name: "Esther Howard", message: "I'll send you the files tomorrow", time: "3h", unread: 0, avatar: "" },
    { id: 4, name: "Cameron Williamson", message: "Did you see my latest post?", time: "1d", unread: 1, avatar: "" },
    { id: 5, name: "Brooklyn Simmons", message: "Let's catch up soon!", time: "2d", unread: 0, avatar: "" },
  ];
  
  return (
    <div className="px-4 py-6">
      <header className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Messages</h1>
        <button className="text-felaco-purple">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-edit"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
        </button>
      </header>
      
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
      
      <div className="space-y-4">
        {conversations.map((convo) => (
          <div key={convo.id} className="flex items-center gap-3">
            <div className="relative h-12 w-12 flex-shrink-0">
              <div className="h-full w-full rounded-full bg-gray-300"></div>
              {convo.unread > 0 && (
                <div className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-felaco-purple text-xs text-white">
                  {convo.unread}
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <p className="font-medium">{convo.name}</p>
                <p className="text-xs text-gray-500">{convo.time}</p>
              </div>
              <p className="truncate text-sm text-gray-500">{convo.message}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Messages;
