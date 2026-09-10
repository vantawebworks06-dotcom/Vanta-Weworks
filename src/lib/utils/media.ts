/**
 * Builds a public URL for a file stored in the Supabase "media" storage
 * bucket (see supabase/migrations/*_storage_media_bucket.sql). Bucket is
 * public, so no signing/auth is needed to read it.
 */
export function getMediaUrl(path: string | null | undefined): string | null {
  if (!path) return null;
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!supabaseUrl) return null;
  return `${supabaseUrl}/storage/v1/object/public/media/${path}`;
}
