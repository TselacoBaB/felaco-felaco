import { useEffect, useState, useRef } from "react";
import { supabase } from "../../integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { RealtimeChannel } from '@supabase/supabase-js';

interface Conversation {
  id: string;
  name: string;
  message: string;
  time: string;
  unread: number;
}

const Messages = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const subscriptionRef = useRef<RealtimeChannel | null>(null);

  useEffect(() => {
    let isMounted = true;
    const fetchConversations = async () => {
      setLoading(true);
      setError(null);
      try {
        const user = await supabase.auth.getUser();
        const userId = user.data.user?.id;
        if (!userId) {
          setConversations([]);
          setLoading(false);
          setError("Not logged in");
          return;
        }
        const { data, error } = await supabase.rpc('get_user_conversations', { user_id: userId });
        if (!isMounted) return;
        if (error) {
          setConversations([]);
          setError(error.message || "Failed to load conversations");
        } else {
          setConversations((data as Conversation[]) || []);
        }
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Unknown error");
        }
        setConversations([]);
      }
      setLoading(false);
    };
    fetchConversations();

    // Real-time subscription for new messages/conversations
    const subscribeToMessages = async () => {
      const user = await supabase.auth.getUser();
      const userId = user.data.user?.id;
      if (!userId) return;
      // Listen to new messages in the messages table
      subscriptionRef.current = supabase
        .channel('messages-listen')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'messages' }, (payload) => {
          // Refetch conversations on any message change
          fetchConversations();
        })
        .subscribe();
    };
    subscribeToMessages();

    return () => {
      isMounted = false;
      if (subscriptionRef.current) {
        supabase.removeChannel(subscriptionRef.current);
      }
    };
  }, []);

  return (
    <div className="px-4 py-6">
      <header className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Messages</h1>
        <button className="text-felaco-purple">
          {/* Compose new message button */}
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
      {error && <div className="text-center text-red-500 py-2">{error}</div>}
      {loading ? (
        <div className="text-center py-8 text-gray-400">Loading...</div>
      ) : (
        <div className="space-y-4">
          {conversations.length === 0 ? (
            <div className="text-center text-gray-400">No conversations yet.</div>
          ) : (
            conversations
              .filter((convo) =>
                convo.name?.toLowerCase().includes(searchQuery.toLowerCase())
              )
              .map((convo) => (
                <div
                  key={convo.id}
                  className="flex items-center gap-3 cursor-pointer hover:bg-gray-100 rounded-lg px-2 py-2 transition"
                  onClick={() => convo.id && navigate(`/app/messages/${convo.id}`)}
                >
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
              ))
          )}
        </div>
      )}
    </div>
  );
};

export default Messages;
