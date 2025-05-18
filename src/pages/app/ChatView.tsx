import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../../integrations/supabase/client";
import type { MessageRow } from "../../integrations/supabase/types";
import EmojiPicker from "../../components/EmojiPicker";
import MediaUpload from "../../components/MediaUpload";

const ChatView = () => {
  const { userId } = useParams();
  const [messages, setMessages] = useState<MessageRow[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [showEmoji, setShowEmoji] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch current user ID once
  useEffect(() => {
    supabase.auth.getUser().then((user) => {
      setCurrentUserId(user.data.user?.id || null);
    });
  }, []);

  // Fetch messages and subscribe to realtime updates
  useEffect(() => {
    let isMounted = true;
    let subscription: ReturnType<typeof supabase.channel> | null = null;
    const fetchMessages = async () => {
      setLoading(true);
      setError(null);
      if (!currentUserId || !userId) {
        setMessages([]);
        setLoading(false);
        return;
      }
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .or(`and(sender_id.eq.${currentUserId},receiver_id.eq.${userId}),and(sender_id.eq.${userId},receiver_id.eq.${currentUserId})`)
        .order("created_at", { ascending: true });
      if (!isMounted) return;
      if (error) {
        setMessages([]);
        setError("Failed to load messages.");
      } else {
        setMessages((data as MessageRow[]) || []);
      }
      setLoading(false);
      // Subscribe to realtime updates using supabase-js v2 API
      subscription = supabase
        .channel('messages:chat:' + [currentUserId, userId].sort().join('-'))
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'messages' },
          (payload: { new: unknown }) => {
            const msg = payload.new as MessageRow;
            if (
              (msg.sender_id === currentUserId && msg.receiver_id === userId) ||
              (msg.sender_id === userId && msg.receiver_id === currentUserId)
            ) {
              setMessages((prev) => {
                const exists = prev.some((m) => m.id === msg.id);
                if (!exists) return [...prev, msg];
                return prev;
              });
            }
          }
        )
        .subscribe();
    };
    fetchMessages();
    return () => {
      isMounted = false;
      if (subscription) supabase.removeChannel(subscription);
    };
  }, [userId, currentUserId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Send a new message (text or media)
  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setError(null);
    if (!input.trim() || !currentUserId || !userId) {
      setSending(false);
      return;
    }
    const { error } = await supabase.from("messages").insert({
      sender_id: currentUserId,
      receiver_id: userId,
      content: input,
      media_url: null,
      message_type: "text",
      seen: false,
    });
    if (error) setError("Failed to send message.");
    setInput("");
    setSending(false);
  };

  // Handle emoji select
  const handleEmojiSelect = (emoji: { native?: string; colons?: string }) => {
    setInput((prev) => prev + (emoji.native || emoji.colons || ""));
    setShowEmoji(false);
  };

  // Handle media upload
  const handleMediaUpload = async (file: File) => {
    setSending(true);
    setError(null);
    if (!currentUserId || !userId) {
      setSending(false);
      return;
    }
    // Upload to Supabase Storage (assumes 'chat-media' bucket exists)
    const fileExt = file.name.split('.').pop();
    const filePath = `${currentUserId}/${Date.now()}.${fileExt}`;
    const { data: uploadData, error: uploadError } = await supabase.storage.from('chat-media').upload(filePath, file);
    if (uploadError) {
      setError("Failed to upload media.");
      setSending(false);
      return;
    }
    const mediaUrl = supabase.storage.from('chat-media').getPublicUrl(filePath).data.publicUrl;
    const { error: msgError } = await supabase.from("messages").insert({
      sender_id: currentUserId,
      receiver_id: userId,
      content: '',
      media_url: mediaUrl,
      message_type: file.type.startsWith('video') ? 'video' : 'image',
      seen: false,
    });
    if (msgError) setError("Failed to send media message.");
    setSending(false);
  };

  // Delete a message
  const handleDeleteMessage = async (msgId: string) => {
    setError(null);
    const { error } = await supabase.from("messages").delete().eq("id", msgId);
    if (error) setError("Failed to delete message.");
  };

  return (
    <div className="flex flex-col h-[80vh] max-w-2xl mx-auto border rounded-lg bg-white shadow">
      <div className="flex-1 overflow-y-auto p-4">
        {loading ? (
          <div className="text-center text-gray-400">Loading...</div>
        ) : error ? (
          <div className="text-center text-red-500">{error}</div>
        ) : messages.length === 0 ? (
          <div className="text-center text-gray-400">No messages yet.</div>
        ) : (
          messages.map((msg) => {
            const isMine = msg.sender_id === currentUserId;
            const canDelete = isMine && (Date.now() - new Date(msg.created_at).getTime() < 60 * 60 * 1000);
            return (
              <div
                key={msg.id}
                className={`mb-2 flex ${isMine ? "justify-end" : "justify-start"}`}
              >
                <div className={`rounded-lg px-4 py-2 max-w-xs break-words relative ${isMine ? "bg-felaco-purple text-white" : "bg-gray-200 text-gray-900"}`}>
                  {msg.message_type === "text" && msg.content}
                  {msg.message_type === "image" && msg.media_url && (
                    <img src={msg.media_url} alt="media" className="max-w-[200px] rounded-lg" />
                  )}
                  {msg.message_type === "video" && msg.media_url && (
                    <video src={msg.media_url} controls className="max-w-[200px] rounded-lg" />
                  )}
                  <div className="text-xs text-gray-400 mt-1 text-right">{new Date(msg.created_at).toLocaleTimeString()}</div>
                  {canDelete && (
                    <button
                      onClick={() => handleDeleteMessage(msg.id)}
                      className="absolute top-1 right-1 text-xs text-red-400 hover:text-red-600 bg-white/70 rounded p-1"
                      title="Delete message"
                    >
                      🗑️
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={sendMessage} className="flex items-center border-t p-2 gap-2 bg-gray-50">
        <button type="button" onClick={() => setShowEmoji((v) => !v)} className="bg-gray-100 rounded-full p-2 hover:bg-gray-200" title="Emoji">
          <span role="img" aria-label="emoji">😊</span>
        </button>
        {showEmoji && (
          <div className="absolute bottom-20 left-4 z-50">
            <EmojiPicker onSelect={handleEmojiSelect} />
          </div>
        )}
        <MediaUpload onUpload={handleMediaUpload} />
        <input
          className="flex-1 rounded-full border px-4 py-2 focus:outline-none"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          disabled={sending}
        />
        <button type="submit" className="bg-felaco-purple text-white rounded-full px-4 py-2 font-semibold" disabled={sending || !input.trim()}>
          Send
        </button>
      </form>
    </div>
  );
};

export default ChatView;
