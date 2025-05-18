
import { useAuth } from "@/contexts/AuthContext";

const Home = () => {
  const { user } = useAuth();
  
  return (
    <div className="px-4 py-6">
      <header className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold gradient-text">Felaco</h1>
        <div className="flex items-center gap-4">
          <button className="text-gray-800">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-heart"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
          </button>
          <button className="text-gray-800">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-message-circle"><path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z"/></svg>
          </button>
        </div>
      </header>
      
      <div className="mb-6 overflow-x-auto">
        <div className="flex gap-4 pb-2">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div key={item} className="flex flex-col items-center">
              <div className="h-16 w-16 rounded-full bg-gradient-to-br from-felaco-purple to-felaco-blue p-0.5">
                <div className="h-full w-full rounded-full border-2 border-white bg-gray-100"></div>
              </div>
              <span className="mt-1 text-xs">User {item}</span>
            </div>
          ))}
        </div>
      </div>
      
      <div className="space-y-6">
        {[1, 2, 3].map((post) => (
          <div key={post} className="rounded-lg border border-gray-200 bg-white">
            <div className="flex items-center gap-2 p-3">
              <div className="h-8 w-8 rounded-full bg-gray-300"></div>
              <div>
                <p className="font-medium">username{post}</p>
                <p className="text-xs text-gray-500">Location</p>
              </div>
              <button className="ml-auto text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-more-horizontal"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>
              </button>
            </div>
            <div className="aspect-square w-full bg-gray-200"></div>
            <div className="p-3">
              <div className="flex items-center justify-between mb-2">
                <div className="flex gap-4">
                  <button>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-heart"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
                  </button>
                  <button>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-message-circle"><path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z"/></svg>
                  </button>
                  <button>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-send"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>
                  </button>
                </div>
                <button>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-bookmark"><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/></svg>
                </button>
              </div>
              <p className="text-sm font-medium">123 likes</p>
              <p className="mt-1 text-sm">
                <span className="font-medium">username{post}</span> This is a post caption with some text content...
              </p>
              <p className="mt-1 text-xs text-gray-500">View all 24 comments</p>
              <p className="mt-1 text-xs text-gray-400">2 HOURS AGO</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
