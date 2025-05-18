
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const applicationSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  displayName: z.string().min(2, "Display name must be at least 2 characters"),
  contentType: z.string().min(3, "Please select a content type"),
  experience: z.string().min(10, "Please provide more details about your experience"),
  socialLinks: z.string().optional(),
  birthDate: z.string().refine(
    (date) => {
      // Check if user is at least 18 years old
      const eighteenYearsAgo = new Date();
      eighteenYearsAgo.setFullYear(eighteenYearsAgo.getFullYear() - 18);
      return new Date(date) <= eighteenYearsAgo;
    },
    {
      message: "You must be at least 18 years old to apply as a creator",
    }
  ),
});

type ApplicationFormValues = z.infer<typeof applicationSchema>;

interface CreatorApplicationFormProps {
  onComplete: (completed: boolean) => void;
  onNext: () => void;
}

const CreatorApplicationForm = ({ onComplete, onNext }: CreatorApplicationFormProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [existingData, setExistingData] = useState<Partial<ApplicationFormValues> | null>(null);

  const form = useForm<ApplicationFormValues>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      fullName: "",
      displayName: "",
      contentType: "",
      experience: "",
      socialLinks: "",
      birthDate: "",
    },
  });

  useEffect(() => {
    // Check if user already has application data
    const fetchExistingData = async () => {
      if (user) {
        const { data, error } = await supabase
          .from("creator_applications")
          .select("*")
          .eq("user_id", user.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        // Also fetch profile data
        const { data: profileData } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        if (data && !error) {
          setExistingData({
            fullName: data.full_name,
            contentType: data.content_type,
            experience: data.experience,
            socialLinks: data.social_links ? Object.entries(data.social_links)
              .map(([platform, url]) => `${platform}: ${url}`)
              .join('\n') 
              : "",
          });

          form.reset({
            fullName: data.full_name,
            displayName: profileData?.username || "",
            contentType: data.content_type,
            experience: data.experience,
            socialLinks: data.social_links ? Object.entries(data.social_links)
              .map(([platform, url]) => `${platform}: ${url}`)
              .join('\n') 
              : "",
            birthDate: "",  // Reset to empty as we don't store this after verification
          });
        } else if (profileData) {
          // If no application data but profile data exists
          form.reset({
            fullName: profileData.full_name || "",
            displayName: profileData.username || "",
            contentType: "",
            experience: "",
            socialLinks: "",
            birthDate: "",
          });
        }
      }
    };

    fetchExistingData();
  }, [user, form]);

  const onSubmit = async (data: ApplicationFormValues) => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to apply",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Parse social links into JSON object
      const socialLinksObj = {};
      if (data.socialLinks) {
        data.socialLinks.split('\n').forEach(link => {
          const parts = link.split(':');
          if (parts.length === 2) {
            const platform = parts[0].trim();
            const url = parts[1].trim();
            if (platform && url) {
              socialLinksObj[platform] = url;
            }
          }
        });
      }

      // Save the form data - don't complete submission yet
      const { error } = await supabase.from("creator_applications").upsert({
        user_id: user.id,
        full_name: data.fullName,
        content_type: data.contentType,
        experience: data.experience,
        social_links: socialLinksObj,
        status: "draft",
      });

      if (error) throw error;

      // Update the profile with display name
      await supabase
        .from("profiles")
        .update({
          full_name: data.fullName,
          username: data.displayName,
        })
        .eq("id", user.id);

      toast({
        title: "Information saved",
        description: "Your information has been saved. Please continue to verification.",
      });
      
      // Mark this step as complete
      onComplete(true);
      
      // Move to next step
      onNext();
    } catch (error: any) {
      toast({
        title: "Error saving information",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg">
      <h2 className="text-2xl font-bold mb-6">Personal Information</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Legal Name</FormLabel>
                <FormControl>
                  <Input placeholder="Your full legal name" {...field} />
                </FormControl>
                <FormDescription>
                  Must match your ID documentation
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="displayName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Display Name / Username</FormLabel>
                <FormControl>
                  <Input placeholder="Your public creator name" {...field} />
                </FormControl>
                <FormDescription>
                  This will be visible to your followers
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="birthDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date of Birth</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormDescription>
                  You must be at least 18 years old
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="contentType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Content Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your primary content type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="art">Art & Illustration</SelectItem>
                    <SelectItem value="photography">Photography</SelectItem>
                    <SelectItem value="fitness">Fitness</SelectItem>
                    <SelectItem value="music">Music</SelectItem>
                    <SelectItem value="dance">Dance</SelectItem>
                    <SelectItem value="lifestyle">Lifestyle</SelectItem>
                    <SelectItem value="adult">Adult Content</SelectItem>
                    <SelectItem value="gaming">Gaming</SelectItem>
                    <SelectItem value="education">Education & Tutorials</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="experience"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Experience</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Tell us about your experience creating content" 
                    className="min-h-32"
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="socialLinks"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Social Media Links</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Instagram: https://instagram.com/yourusername
Twitter: https://twitter.com/yourusername" 
                    className="min-h-24"
                    {...field} 
                  />
                </FormControl>
                <FormDescription>
                  Enter each platform and link on a separate line, separated by a colon.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="flex justify-end">
            <Button type="submit" className="bg-felaco-purple hover:bg-felaco-purple/90" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save & Continue"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default CreatorApplicationForm;
