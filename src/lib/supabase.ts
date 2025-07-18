
import { createClient } from '@supabase/supabase-js'

// Configuración con las variables proporcionadas
const supabaseUrl = 'https://medzlgbjunwtlvglgnhp.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1lZHpsZ2JqdW53dGx2Z2xnbmhwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE4MTk5OTYsImV4cCI6MjA2NzM5NTk5Nn0.K6_Ec7ENnCa9QoidhU9gVib7X5tkT-t7WfTRP3xeZgw'

// Crear cliente de Supabase con manejo de errores mejorado
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  }
})

// Verificar conexión inicial
console.log('🔥 Supabase configurado correctamente:', {
  url: supabaseUrl,
  keyPrefix: supabaseAnonKey.substring(0, 20) + '...'
})

// Datos mockeados para fallback
export const mockData = {
  usuarios: [
    {
      id: '1',
      codigo: 'ADMIN001',
      password_hash: 'Temp123*',
      nombre: 'Administrador',
      rol: 'gerente' as const,
      activo: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: '2',
      codigo: 'VEND001',
      password_hash: 'Temp456*',
      nombre: 'Vendedor',
      rol: 'vendedor' as const,
      activo: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: '3',
      codigo: 'FLOR001',
      password_hash: 'Delivery789*',
      nombre: 'Delivery 1',
      rol: 'delivery' as const,
      activo: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: '4',
      codigo: 'MARK001',
      password_hash: 'Market321*',
      nombre: 'Marketing',
      rol: 'marketing' as const,
      activo: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ],
  productos: [
    {
      id: '1',
      nombre: 'Ramo de Rosas Rojas',
      descripcion: 'Hermoso ramo de 12 rosas rojas',
      precio: 45.00,
      categoria: 'ramos',
      stock: 10,
      imagen_url: null,
      personalizable: true,
      activo: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ],
  pedidos: []
}

// Función para autenticación - ahora importada desde auth.ts
import { authenticateUser as authUser } from './auth'
export const authenticateUser = authUser

// Tipos para TypeScript (mantenidos igual)
export type Database = {
  public: {
    Tables: {
      usuarios: {
        Row: {
          id: string
          codigo: string
          password_hash: string
          nombre: string
          rol: 'gerente' | 'vendedor' | 'delivery' | 'marketing'
          activo: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          codigo: string
          password_hash: string
          nombre: string
          rol: 'gerente' | 'vendedor' | 'delivery' | 'marketing'
          activo?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          codigo?: string
          password_hash?: string
          nombre?: string
          rol?: 'gerente' | 'vendedor' | 'delivery' | 'marketing'
          activo?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      productos: {
        Row: {
          id: string
          nombre: string
          descripcion: string | null
          precio: number
          categoria: string
          stock: number
          imagen_url: string | null
          personalizable: boolean
          activo: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          nombre: string
          descripcion?: string | null
          precio: number
          categoria: string
          stock?: number
          imagen_url?: string | null
          personalizable?: boolean
          activo?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          nombre?: string
          descripcion?: string | null
          precio?: number
          categoria?: string
          stock?: number
          imagen_url?: string | null
          personalizable?: boolean
          activo?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      pedidos: {
        Row: {
          id: string
          numero_pedido: string
          cliente_id: string | null
          estado: 'pendiente' | 'confirmado' | 'preparando' | 'en_delivery' | 'entregado' | 'cancelado'
          total: number
          metodo_pago: string | null
          comprobante_pago: string | null
          notas: string | null
          fecha_entrega: string | null
          hora_entrega: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          numero_pedido: string
          cliente_id?: string | null
          estado?: 'pendiente' | 'confirmado' | 'preparando' | 'en_delivery' | 'entregado' | 'cancelado'
          total: number
          metodo_pago?: string | null
          comprobante_pago?: string | null
          notas?: string | null
          fecha_entrega?: string | null
          hora_entrega?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          numero_pedido?: string
          cliente_id?: string | null
          estado?: 'pendiente' | 'confirmado' | 'preparando' | 'en_delivery' | 'entregado' | 'cancelado'
          total?: number
          metodo_pago?: string | null
          comprobante_pago?: string | null
          notas?: string | null
          fecha_entrega?: string | null
          hora_entrega?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
