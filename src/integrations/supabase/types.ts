export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      bill_items: {
        Row: {
          bill_id: string
          created_at: string
          description: string
          extra_charge_id: string | null
          id: string
          is_extra_charge: boolean | null
          parent_item_id: string | null
          quantity: number
          total_price: number
          transfer_id: string | null
          unit_price: number
        }
        Insert: {
          bill_id: string
          created_at?: string
          description: string
          extra_charge_id?: string | null
          id?: string
          is_extra_charge?: boolean | null
          parent_item_id?: string | null
          quantity?: number
          total_price: number
          transfer_id?: string | null
          unit_price: number
        }
        Update: {
          bill_id?: string
          created_at?: string
          description?: string
          extra_charge_id?: string | null
          id?: string
          is_extra_charge?: boolean | null
          parent_item_id?: string | null
          quantity?: number
          total_price?: number
          transfer_id?: string | null
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "bill_items_bill_id_fkey"
            columns: ["bill_id"]
            isOneToOne: false
            referencedRelation: "bills"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bill_items_transfer_id_fkey"
            columns: ["transfer_id"]
            isOneToOne: false
            referencedRelation: "transfers"
            referencedColumns: ["id"]
          },
        ]
      }
      bills: {
        Row: {
          client_id: string
          created_at: string
          date: string
          due_date: string
          id: string
          notes: string | null
          number: string
          status: string
          sub_total: number
          tax_amount: number
          tax_application: string
          tax_rate: number
          total: number
          updated_at: string
          user_id: string
        }
        Insert: {
          client_id: string
          created_at?: string
          date: string
          due_date: string
          id?: string
          notes?: string | null
          number: string
          status?: string
          sub_total: number
          tax_amount: number
          tax_application?: string
          tax_rate: number
          total: number
          updated_at?: string
          user_id: string
        }
        Update: {
          client_id?: string
          created_at?: string
          date?: string
          due_date?: string
          id?: string
          notes?: string | null
          number?: string
          status?: string
          sub_total?: number
          tax_amount?: number
          tax_application?: string
          tax_rate?: number
          total?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bills_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      clients: {
        Row: {
          address: string | null
          created_at: string
          email: string
          id: string
          name: string
          notes: string | null
          phone: string | null
          tax_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          address?: string | null
          created_at?: string
          email: string
          id?: string
          name: string
          notes?: string | null
          phone?: string | null
          tax_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          address?: string | null
          created_at?: string
          email?: string
          id?: string
          name?: string
          notes?: string | null
          phone?: string | null
          tax_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      companies: {
        Row: {
          address: string | null
          created_at: string
          email: string | null
          id: string
          logo: string | null
          name: string
          phone: string | null
          tax_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          address?: string | null
          created_at?: string
          email?: string | null
          id?: string
          logo?: string | null
          name: string
          phone?: string | null
          tax_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          address?: string | null
          created_at?: string
          email?: string | null
          id?: string
          logo?: string | null
          name?: string
          phone?: string | null
          tax_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      expenses: {
        Row: {
          amount: number
          concept: string
          created_at: string
          date: string
          id: string
          transfer_id: string
          user_id: string
        }
        Insert: {
          amount?: number
          concept: string
          created_at?: string
          date: string
          id?: string
          transfer_id: string
          user_id: string
        }
        Update: {
          amount?: number
          concept?: string
          created_at?: string
          date?: string
          id?: string
          transfer_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "expenses_transfer_id_fkey"
            columns: ["transfer_id"]
            isOneToOne: false
            referencedRelation: "transfers"
            referencedColumns: ["id"]
          },
        ]
      }
      extra_charges: {
        Row: {
          created_at: string
          id: string
          name: string
          price: number
          transfer_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          price?: number
          transfer_id: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          price?: number
          transfer_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "extra_charges_transfer_id_fkey"
            columns: ["transfer_id"]
            isOneToOne: false
            referencedRelation: "transfers"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          company_address: string | null
          company_email: string | null
          company_id: string | null
          company_logo: string | null
          company_name: string | null
          company_phone: string | null
          company_tax_id: string | null
          created_at: string
          email: string | null
          first_name: string | null
          id: string
          last_name: string | null
          role: string
          updated_at: string
          user_subtype: string | null
        }
        Insert: {
          company_address?: string | null
          company_email?: string | null
          company_id?: string | null
          company_logo?: string | null
          company_name?: string | null
          company_phone?: string | null
          company_tax_id?: string | null
          created_at?: string
          email?: string | null
          first_name?: string | null
          id: string
          last_name?: string | null
          role?: string
          updated_at?: string
          user_subtype?: string | null
        }
        Update: {
          company_address?: string | null
          company_email?: string | null
          company_id?: string | null
          company_logo?: string | null
          company_name?: string | null
          company_phone?: string | null
          company_tax_id?: string | null
          created_at?: string
          email?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          role?: string
          updated_at?: string
          user_subtype?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      transfers: {
        Row: {
          billed: boolean | null
          client_id: string | null
          collaborator: string | null
          commission: number | null
          commission_type: string | null
          created_at: string
          date: string
          destination: string | null
          discount_type: string | null
          discount_value: number | null
          hours: string | null
          id: string
          origin: string
          payment_method: string | null
          payment_status: string
          price: number
          service_type: string
          time: string | null
          updated_at: string
          user_id: string
          vehicle_id: string | null
        }
        Insert: {
          billed?: boolean | null
          client_id?: string | null
          collaborator?: string | null
          commission?: number | null
          commission_type?: string | null
          created_at?: string
          date: string
          destination?: string | null
          discount_type?: string | null
          discount_value?: number | null
          hours?: string | null
          id?: string
          origin: string
          payment_method?: string | null
          payment_status?: string
          price?: number
          service_type?: string
          time?: string | null
          updated_at?: string
          user_id: string
          vehicle_id?: string | null
        }
        Update: {
          billed?: boolean | null
          client_id?: string | null
          collaborator?: string | null
          commission?: number | null
          commission_type?: string | null
          created_at?: string
          date?: string
          destination?: string | null
          discount_type?: string | null
          discount_value?: number | null
          hours?: string | null
          id?: string
          origin?: string
          payment_method?: string | null
          payment_status?: string
          price?: number
          service_type?: string
          time?: string | null
          updated_at?: string
          user_id?: string
          vehicle_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "transfers_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transfers_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      vehicles: {
        Row: {
          capacity: number | null
          company_id: string | null
          created_at: string
          id: string
          license_plate: string
          make: string
          model: string
          status: string
          updated_at: string
          user_id: string
          vehicle_type: string
          year: number | null
        }
        Insert: {
          capacity?: number | null
          company_id?: string | null
          created_at?: string
          id?: string
          license_plate: string
          make: string
          model: string
          status?: string
          updated_at?: string
          user_id: string
          vehicle_type?: string
          year?: number | null
        }
        Update: {
          capacity?: number | null
          company_id?: string | null
          created_at?: string
          id?: string
          license_plate?: string
          make?: string
          model?: string
          status?: string
          updated_at?: string
          user_id?: string
          vehicle_type?: string
          year?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "vehicles_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: { Args: { _role: string; _user_id: string }; Returns: boolean }
    }
    Enums: {
      bill_status: "draft" | "sent" | "paid" | "cancelled"
      discount_type: "percentage" | "fixed"
      payment_method_enum: "card" | "cash" | "bank_transfer"
      payment_status_enum: "paid" | "pending"
      service_type: "transfer" | "dispo"
      user_role: "admin" | "user"
      vehicle_type: "sedan" | "suv" | "van" | "bus" | "minibus" | "luxury"
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
      bill_status: ["draft", "sent", "paid", "cancelled"],
      discount_type: ["percentage", "fixed"],
      payment_method_enum: ["card", "cash", "bank_transfer"],
      payment_status_enum: ["paid", "pending"],
      service_type: ["transfer", "dispo"],
      user_role: ["admin", "user"],
      vehicle_type: ["sedan", "suv", "van", "bus", "minibus", "luxury"],
    },
  },
} as const
