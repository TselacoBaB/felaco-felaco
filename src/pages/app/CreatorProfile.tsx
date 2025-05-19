import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

// Define a type for the creator profile
interface CreatorProfileType {
  id: string;
  username: string;
  full_name?: string;
  avatar_url?: string;
  cover_image?: string;
  bio?: string;
  is_creator: boolean;
}

const CreatorProfile = () => {
  const { username } = useParams();
  const { toast } = useToast();
  const { user } = useAuth();
  const [creator, setCreator] = useState<CreatorProfileType | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    const fetchCreator = async () => {
      try {
        // Fetch the creator profile by username
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("username", username)
          .eq("is_creator", true)
          .single();

        if (error || !data) throw error || new Error("No creator found");
        setCreator(data as CreatorProfileType);

        // Check if the current user is following this creator
        if (user) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const { data: followData } = await (supabase as any)
            .from("follows")
            .select("*")
            .eq("follower_id", user.id)
            .eq("following_id", data.id)
            .maybeSingle();

          setIsFollowing(!!followData);
        }
      } catch (error) {
        console.error("Error fetching creator:", error);
        toast({
          title: "Error",
          description: "Failed to load creator profile",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    if (username) {
      fetchCreator();
    }
  }, [username, user, toast]);

  const handleFollow = async () => {
    if (!user || !creator) return;
    try {
      if (isFollowing) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await (supabase as any)
          .from("follows")
          .delete()
          .eq("follower_id", user.id)
          .eq("following_id", creator.id);
        setIsFollowing(false);
        toast({
          title: "Unfollowed",
          description: `You unfollowed ${creator.full_name || creator.username}`,
        });
      } else {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await (supabase as any)
          .from("follows")
          .insert({
            follower_id: user.id,
            following_id: creator.id,
          });
        setIsFollowing(true);
        toast({
          title: "Following",
          description: `You are now following ${creator.full_name || creator.username}`,
        });
      }
    } catch (error) {
      console.error("Error updating follow status:", error);
      toast({
        title: "Error",
        description: "Failed to update follow status",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="p-4">
        <Skeleton className="h-40 w-full rounded-xl mb-4" />
        <div className="flex mb-6">
          <Skeleton className="h-24 w-24 rounded-full mr-4" />
          <div className="flex-1">
            <Skeleton className="h-6 w-3/4 mb-2" />
            <Skeleton className="h-4 w-1/2 mb-2" />
            <Skeleton className="h-10 w-32" />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {[...Array(9)].map((_, i) => (
            <Skeleton key={i} className="aspect-square rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (!creator) {
    return (
      <div className="p-4 text-center">
        <h1 className="text-2xl font-bold mb-4">Creator Not Found</h1>
        <p className="text-gray-600">
          The creator profile you're looking for doesn't exist or may have been removed.
        </p>
      </div>
    );
  }

  return (
    <div className="flex justify-center w-full">
      <div className="w-full max-w-4xl px-4 sm:px-4 md:px-8 lg:px-8 xl:px-8" style={{ width: '80%' }}>
        {/* Cover Image */}
        <div className="relative h-40 bg-gradient-to-r from-felaco-purple to-felaco-blue">
          {creator.cover_image && (
            <img 
              src={creator.cover_image}
              alt="Cover"
              className="w-full h-full object-cover"
            />
          )}
        </div>
        {/* Profile Info */}
        <div className="relative px-4 pb-4">
          <div className="flex items-end -mt-12">
            <div className="h-24 w-24 rounded-full border-4 border-white bg-white overflow-hidden">
              {creator.avatar_url ? (
                <img 
                  src={creator.avatar_url} 
                  alt={creator.username} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-felaco-purple text-white text-xl font-bold">
                  {(creator.username?.charAt(0) || "").toUpperCase()}
                </div>
              )}
            </div>
            <div className="flex-1 ml-4 pb-2">
              <h1 className="text-xl font-bold">
                {creator.full_name || creator.username}
              </h1>
              <p className="text-gray-600">@{creator.username}</p>
            </div>
          </div>
          <div className="flex items-center justify-between mt-4">
            <div className="flex space-x-4">
              <div className="text-center">
                <div className="font-bold">0</div>
                <div className="text-xs text-gray-600">Posts</div>
              </div>
              <div className="text-center">
                <div className="font-bold">0</div>
                <div className="text-xs text-gray-600">Followers</div>
              </div>
              <div className="text-center">
                <div className="font-bold">0</div>
                <div className="text-xs text-gray-600">Following</div>
              </div>
            </div>
            <Button
              variant={isFollowing ? "outline" : "default"}
              className={isFollowing ? "border-felaco-purple text-felaco-purple" : "bg-felaco-purple"}
              onClick={handleFollow}
            >
              {isFollowing ? "Following" : "Follow"}
            </Button>
          </div>
          <div className="mt-4">
            <h2 className="font-medium mb-1">About</h2>
            <p className="text-sm text-gray-600">
              {creator.bio || "This creator hasn't added a bio yet."}
            </p>
          </div>
        </div>
        {/* Content Tabs (to be implemented) */}
        <div className="mt-4 px-4">
          <div className="grid grid-cols-3 gap-1">
            {[...Array(9)].map((_, i) => (
              <div key={i} className="aspect-square bg-gray-100 rounded-lg"></div>
            ))}
          </div>
          <div className="text-center mt-8 py-8 text-gray-500">
            <p>No content available yet.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatorProfile;
