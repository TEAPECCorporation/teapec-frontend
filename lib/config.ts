// Environment variables configuration
export const config = {
  supabase: {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL || "YOUR_SUPABASE_URL",
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "YOUR_SUPABASE_ANON_KEY",
  },
  api: {
    backendUrl: process.env.NEXT_PUBLIC_FASTAPI_BACKEND_URL || "http://localhost:8000",
  },
  app: {
    name: "Sentinel XDR",
  },
}
