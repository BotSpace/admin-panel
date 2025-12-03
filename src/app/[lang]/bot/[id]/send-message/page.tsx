import { redirect } from "next/navigation";

export default async function SendMessagePage({ 
  params 
}: { 
  params: Promise<{ id: string; lang: string }> 
}) {
  const { id } = await params;
  redirect(`/bot/${id}/send-message/send-new-message`);
}
