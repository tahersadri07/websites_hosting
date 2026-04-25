import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request, { params }: { params: { slug: string } }) {
  const supabase = await createClient();
  
  // Check if a user's logged in
  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    await supabase.auth.signOut();
  }

  // Redirect to the site's home page
  const requestUrl = new URL(request.url);
  return NextResponse.redirect(new URL(`/sites/${params.slug}`, requestUrl.origin));
}
