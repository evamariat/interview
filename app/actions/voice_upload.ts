'use server';
import { createServerClient } from '@/utils/supabase/server';

export async function uploadVoice(formData: FormData) {
  const supabase = await createServerClient();
  const file = formData.get('audio') as File;
  const roomId = formData.get('roomId') as string;

  // Unikaalne path
  const fileExt = file.name.split('.').pop();
  const filePath = `voice-messages/${crypto.randomUUID()}.${fileExt}`;

  // Üleslaadimine
  const { error: uploadError } = await supabase.storage
    .from('voice-messages')
    .upload(filePath, file, { contentType: file.type });

  if (uploadError) throw uploadError;

  // Metaandmed DB-sse
  const { data: user } = await supabase.auth.getUser();
  const { error: insertError } = await supabase
    .from('voice_messages')
    .insert({
      chat_room_id: roomId,
      author_id: user.user?.id,
      file_path: filePath,
    });

  if (insertError) throw insertError;

  // Public URL
  const { data: { publicUrl } } = supabase.storage
    .from('voice-messages')
    .getPublicUrl(filePath);

  return publicUrl;
}