
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.26.0"

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders })
  }

  try {
    // Create Supabase client with service role
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || ''
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
    
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error("Missing Supabase credentials")
    }
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey)
    
    // Get the request body
    let userId: string | null = null
    
    // Check if this is an admin deleting a user or a user deleting themselves
    const body = await req.json().catch(() => null)
    const authHeader = req.headers.get('Authorization')
    
    if (body && body.userId) {
      // Admin is deleting a user
      userId = body.userId
      console.log("Admin deleting user:", userId)
    } else if (authHeader) {
      // User is deleting themselves
      // Extract the token from the Authorization header
      const token = authHeader.replace('Bearer ', '')
      
      // Verify the JWT and get the user
      const { data: { user }, error: authError } = await supabase.auth.getUser(token)
      
      if (authError || !user) {
        return new Response(
          JSON.stringify({ error: "Invalid token" }),
          { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        )
      }
      
      userId = user.id
      console.log("User deleting their own account:", userId)
    } else {
      return new Response(
        JSON.stringify({ error: "No authorization header or userId provided" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      )
    }
    
    if (!userId) {
      throw new Error("No user ID provided")
    }

    console.log("Starting delete process for user:", userId)

    // Delete user's expenses
    const { error: expensesError } = await supabase
      .from('expenses')
      .delete()
      .eq('user_id', userId)

    if (expensesError) {
      console.log(`Error deleting expenses: ${expensesError.message}`)
    }

    // Delete user's transfers
    const { error: transfersError } = await supabase
      .from('transfers')
      .delete()
      .eq('user_id', userId)

    if (transfersError) {
      console.log(`Error deleting transfers: ${transfersError.message}`)
    }

    // Delete the user's profile
    const { error: profileError } = await supabase
      .from('profiles')
      .delete()
      .eq('id', userId)

    if (profileError) {
      throw new Error(`Error deleting profile: ${profileError.message}`)
    }

    // Delete the user from auth
    const { error: userDeleteError } = await supabase.auth.admin.deleteUser(userId)

    if (userDeleteError) {
      throw new Error(`Error deleting auth user: ${userDeleteError.message}`)
    }

    return new Response(
      JSON.stringify({ success: true, message: "User deleted successfully" }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    )
  } catch (error) {
    console.error("Error in delete-account function:", error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    )
  }
})
