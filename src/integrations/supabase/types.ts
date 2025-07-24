export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      auditoria: {
        Row: {
          accion: string
          created_at: string | null
          datos_anteriores: Json | null
          datos_nuevos: Json | null
          id: string
          ip_address: unknown | null
          registro_id: string | null
          tabla_afectada: string | null
          usuario_id: string | null
        }
        Insert: {
          accion: string
          created_at?: string | null
          datos_anteriores?: Json | null
          datos_nuevos?: Json | null
          id?: string
          ip_address?: unknown | null
          registro_id?: string | null
          tabla_afectada?: string | null
          usuario_id?: string | null
        }
        Update: {
          accion?: string
          created_at?: string | null
          datos_anteriores?: Json | null
          datos_nuevos?: Json | null
          id?: string
          ip_address?: unknown | null
          registro_id?: string | null
          tabla_afectada?: string | null
          usuario_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "auditoria_usuario_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      clientes_pedidos: {
        Row: {
          created_at: string | null
          direccion: string
          email: string | null
          id: string
          nombre: string
          telefono: string
        }
        Insert: {
          created_at?: string | null
          direccion: string
          email?: string | null
          id?: string
          nombre: string
          telefono: string
        }
        Update: {
          created_at?: string | null
          direccion?: string
          email?: string | null
          id?: string
          nombre?: string
          telefono?: string
        }
        Relationships: []
      }
      configuraciones: {
        Row: {
          clave: string
          created_at: string | null
          descripcion: string | null
          id: string
          updated_at: string | null
          valor: string
        }
        Insert: {
          clave: string
          created_at?: string | null
          descripcion?: string | null
          id?: string
          updated_at?: string | null
          valor: string
        }
        Update: {
          clave?: string
          created_at?: string | null
          descripcion?: string | null
          id?: string
          updated_at?: string | null
          valor?: string
        }
        Relationships: []
      }
      deliveries: {
        Row: {
          created_at: string | null
          estado: Database["public"]["Enums"]["delivery_status"] | null
          fecha_asignacion: string | null
          fecha_entrega: string | null
          fecha_inicio: string | null
          id: string
          notas: string | null
          pedido_id: string | null
          ubicacion_actual: Json | null
          updated_at: string | null
          usuario_delivery_id: string | null
        }
        Insert: {
          created_at?: string | null
          estado?: Database["public"]["Enums"]["delivery_status"] | null
          fecha_asignacion?: string | null
          fecha_entrega?: string | null
          fecha_inicio?: string | null
          id?: string
          notas?: string | null
          pedido_id?: string | null
          ubicacion_actual?: Json | null
          updated_at?: string | null
          usuario_delivery_id?: string | null
        }
        Update: {
          created_at?: string | null
          estado?: Database["public"]["Enums"]["delivery_status"] | null
          fecha_asignacion?: string | null
          fecha_entrega?: string | null
          fecha_inicio?: string | null
          id?: string
          notas?: string | null
          pedido_id?: string | null
          ubicacion_actual?: Json | null
          updated_at?: string | null
          usuario_delivery_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "deliveries_pedido_id_fkey"
            columns: ["pedido_id"]
            isOneToOne: false
            referencedRelation: "pedidos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "deliveries_usuario_delivery_id_fkey"
            columns: ["usuario_delivery_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      pedido_detalles: {
        Row: {
          cantidad: number
          created_at: string | null
          id: string
          pedido_id: string | null
          personalizacion: Json | null
          precio_unitario: number
          producto_id: string | null
        }
        Insert: {
          cantidad: number
          created_at?: string | null
          id?: string
          pedido_id?: string | null
          personalizacion?: Json | null
          precio_unitario: number
          producto_id?: string | null
        }
        Update: {
          cantidad?: number
          created_at?: string | null
          id?: string
          pedido_id?: string | null
          personalizacion?: Json | null
          precio_unitario?: number
          producto_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pedido_detalles_pedido_id_fkey"
            columns: ["pedido_id"]
            isOneToOne: false
            referencedRelation: "pedidos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pedido_detalles_producto_id_fkey"
            columns: ["producto_id"]
            isOneToOne: false
            referencedRelation: "productos"
            referencedColumns: ["id"]
          },
        ]
      }
      pedidos: {
        Row: {
          cliente_id: string | null
          comprobante_pago: string | null
          created_at: string | null
          estado: Database["public"]["Enums"]["order_status"] | null
          fecha_entrega: string | null
          hora_entrega: string | null
          id: string
          metodo_pago: string | null
          notas: string | null
          numero_pedido: string
          total: number
          updated_at: string | null
        }
        Insert: {
          cliente_id?: string | null
          comprobante_pago?: string | null
          created_at?: string | null
          estado?: Database["public"]["Enums"]["order_status"] | null
          fecha_entrega?: string | null
          hora_entrega?: string | null
          id?: string
          metodo_pago?: string | null
          notas?: string | null
          numero_pedido: string
          total: number
          updated_at?: string | null
        }
        Update: {
          cliente_id?: string | null
          comprobante_pago?: string | null
          created_at?: string | null
          estado?: Database["public"]["Enums"]["order_status"] | null
          fecha_entrega?: string | null
          hora_entrega?: string | null
          id?: string
          metodo_pago?: string | null
          notas?: string | null
          numero_pedido?: string
          total?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pedidos_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "clientes_pedidos"
            referencedColumns: ["id"]
          },
        ]
      }
      productos: {
        Row: {
          activo: boolean | null
          categoria: string
          created_at: string | null
          descripcion: string | null
          id: string
          imagen_url: string | null
          nombre: string
          personalizable: boolean | null
          precio: number
          stock: number | null
          updated_at: string | null
        }
        Insert: {
          activo?: boolean | null
          categoria: string
          created_at?: string | null
          descripcion?: string | null
          id?: string
          imagen_url?: string | null
          nombre: string
          personalizable?: boolean | null
          precio: number
          stock?: number | null
          updated_at?: string | null
        }
        Update: {
          activo?: boolean | null
          categoria?: string
          created_at?: string | null
          descripcion?: string | null
          id?: string
          imagen_url?: string | null
          nombre?: string
          personalizable?: boolean | null
          precio?: number
          stock?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      reclamaciones: {
        Row: {
          cliente_email: string | null
          cliente_nombre: string
          cliente_telefono: string | null
          created_at: string | null
          descripcion: string
          estado: string | null
          id: string
          numero_reclamo: string
          pedido_relacionado: string | null
          respuesta: string | null
          tipo_reclamo: string
          updated_at: string | null
          usuario_asignado_id: string | null
        }
        Insert: {
          cliente_email?: string | null
          cliente_nombre: string
          cliente_telefono?: string | null
          created_at?: string | null
          descripcion: string
          estado?: string | null
          id?: string
          numero_reclamo: string
          pedido_relacionado?: string | null
          respuesta?: string | null
          tipo_reclamo: string
          updated_at?: string | null
          usuario_asignado_id?: string | null
        }
        Update: {
          cliente_email?: string | null
          cliente_nombre?: string
          cliente_telefono?: string | null
          created_at?: string | null
          descripcion?: string
          estado?: string | null
          id?: string
          numero_reclamo?: string
          pedido_relacionado?: string | null
          respuesta?: string | null
          tipo_reclamo?: string
          updated_at?: string | null
          usuario_asignado_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reclamaciones_usuario_asignado_id_fkey"
            columns: ["usuario_asignado_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      usuarios: {
        Row: {
          activo: boolean | null
          codigo: string
          created_at: string | null
          id: string
          nombre: string
          password_hash: string
          rol: Database["public"]["Enums"]["user_role"]
          updated_at: string | null
        }
        Insert: {
          activo?: boolean | null
          codigo: string
          created_at?: string | null
          id?: string
          nombre: string
          password_hash: string
          rol: Database["public"]["Enums"]["user_role"]
          updated_at?: string | null
        }
        Update: {
          activo?: boolean | null
          codigo?: string
          created_at?: string | null
          id?: string
          nombre?: string
          password_hash?: string
          rol?: Database["public"]["Enums"]["user_role"]
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      delivery_status: "asignado" | "en_ruta" | "entregado" | "fallido"
      order_status:
        | "pendiente"
        | "confirmado"
        | "preparando"
        | "en_delivery"
        | "entregado"
        | "cancelado"
      user_role: "gerente" | "vendedor" | "delivery" | "marketing"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      delivery_status: ["asignado", "en_ruta", "entregado", "fallido"],
      order_status: [
        "pendiente",
        "confirmado",
        "preparando",
        "en_delivery",
        "entregado",
        "cancelado",
      ],
      user_role: ["gerente", "vendedor", "delivery", "marketing"],
    },
  },
} as const
