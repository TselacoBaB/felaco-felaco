import { supabase } from "@/integrations/supabase/client";

/**
 * Upload a file to the felaco-xyz bucket in Supabase Storage.
 * @param {File} file - The file to upload
 * @param {string} creatorId - The user/creator ID for path namespacing
 * @returns {Promise<{ path: string, publicUrl: string | null } | null>}
 */
export async function uploadFile(file: File, creatorId: string) {
  const safeFileName = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
  const { data, error } = await supabase.storage
    .from('felaco-xyz')
    .upload(safeFileName, file);

  if (error) {
    console.error('Upload failed:', error.message);
    return null;
  }

  const { data: publicUrlData } = supabase.storage
    .from('felaco-xyz')
    .getPublicUrl(safeFileName);

  return {
    path: safeFileName,
    publicUrl: publicUrlData?.publicUrl || null,
  };
}
