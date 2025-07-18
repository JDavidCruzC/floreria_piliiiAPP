
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

    const { codigo, password, tipoLogin } = await req.json()

    // Buscar usuario por código
    const { data: usuario, error } = await supabase
      .from('usuarios')
      .select('*')
      .eq('codigo', codigo)
      .single()

    if (error || !usuario) {
      return new Response(
        JSON.stringify({ error: 'Credenciales incorrectas' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 401 
        }
      )
    }

    // Verificar si el usuario está activo
    if (!usuario.activo) {
      return new Response(
        JSON.stringify({ error: 'Usuario desactivado' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 403 
        }
      )
    }

    // Verificar contraseña (manejar tanto hashes como contraseñas temporales)
    let passwordValid = false;
    
    if (usuario.password_hash.startsWith('$2b$')) {
      // Contraseña hasheada
      passwordValid = await bcrypt.compare(password, usuario.password_hash)
    } else {
      // Contraseña temporal (para migración)
      passwordValid = password === usuario.password_hash
      
      // Si es válida, hashear y actualizar
      if (passwordValid) {
        const hashedPassword = await bcrypt.hash(password, 10)
        await supabase
          .from('usuarios')
          .update({ password_hash: hashedPassword })
          .eq('id', usuario.id)
      }
    }

    if (!passwordValid) {
      return new Response(
        JSON.stringify({ error: 'Credenciales incorrectas' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 401 
        }
      )
    }

    // Verificar permisos según tipo de login
    const rutasPermitidas = {
      admin: ['gerente'],
      delivery: ['delivery'],
      vendedor: ['vendedor'],
      marketing: ['marketing']
    }

    if (!rutasPermitidas[tipoLogin as keyof typeof rutasPermitidas]?.includes(usuario.rol)) {
      return new Response(
        JSON.stringify({ error: 'Acceso no autorizado para este rol' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 403 
        }
      )
    }

    // Registrar acceso en auditoría
    await supabase
      .from('auditoria')
      .insert({
        usuario_id: usuario.id,
        accion: 'LOGIN',
        tabla_afectada: 'usuarios',
        registro_id: usuario.id,
        datos_nuevos: { tipo_login: tipoLogin, timestamp: new Date().toISOString() }
      })

    // Retornar datos del usuario (sin contraseña)
    const { password_hash, ...usuarioSeguro } = usuario

    return new Response(
      JSON.stringify({ 
        success: true, 
        usuario: usuarioSeguro,
        rutas: {
          gerente: "/admin/panel",
          delivery: "/delivery/panel",
          vendedor: "/admin/panel",
          marketing: "/admin/panel"
        }
      }),
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
