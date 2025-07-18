
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import * as bcrypt from "https://deno.land/x/bcrypt@v0.4.1/mod.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Contraseñas iniciales seguras
    const usuarios = [
      { codigo: 'ADMIN001', password: 'Temp123*' },
      { codigo: 'VEND001', password: 'Temp456*' },
      { codigo: 'FLOR001', password: 'Delivery789*' },
      { codigo: 'FLOR002', password: 'Delivery555*' },
      { codigo: 'MARK001', password: 'Market321*' }
    ]

    // Hashear y actualizar contraseñas
    for (const user of usuarios) {
      const hashedPassword = await bcrypt.hash(user.password, 10)
      
      const { error } = await supabase
        .from('usuarios')
        .update({ password_hash: hashedPassword })
        .eq('codigo', user.codigo)

      if (error) {
        console.error(`Error updating ${user.codigo}:`, error)
      }
    }

    return new Response(
      JSON.stringify({ success: true, message: 'Contraseñas inicializadas correctamente' }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})
