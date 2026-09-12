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
      departments: {
        Row: {
          code: string
          created_at: string
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          code: string
          created_at?: string
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          code?: string
          created_at?: string
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      electricity_reports: {
        Row: {
          consumption_kwh: number
          cost: number
          created_at: string
          created_by: string
          factory_id: string
          id: string
          report_month: string
          updated_at: string
        }
        Insert: {
          consumption_kwh: number
          cost: number
          created_at?: string
          created_by: string
          factory_id: string
          id?: string
          report_month: string
          updated_at?: string
        }
        Update: {
          consumption_kwh?: number
          cost?: number
          created_at?: string
          created_by?: string
          factory_id?: string
          id?: string
          report_month?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "electricity_reports_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "electricity_reports_factory_fkey"
            columns: ["factory_id"]
            isOneToOne: false
            referencedRelation: "factories"
            referencedColumns: ["id"]
          },
        ]
      }
      factories: {
        Row: {
          created_at: string
          id: string
          location: string | null
          name: string
          short_name: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          location?: string | null
          name: string
          short_name?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          location?: string | null
          name?: string
          short_name?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      factory_members: {
        Row: {
          factory_id: string
          joined_at: string
          role: string
          user_id: string
        }
        Insert: {
          factory_id: string
          joined_at?: string
          role?: string
          user_id: string
        }
        Update: {
          factory_id?: string
          joined_at?: string
          role?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "factory_members_factory_fkey"
            columns: ["factory_id"]
            isOneToOne: false
            referencedRelation: "factories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "factory_members_user_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      factory_partners: {
        Row: {
          created_at: string
          factory_id: string
          partner_id: string
          partner_type: Database["public"]["Enums"]["partner_type"]
        }
        Insert: {
          created_at?: string
          factory_id: string
          partner_id: string
          partner_type: Database["public"]["Enums"]["partner_type"]
        }
        Update: {
          created_at?: string
          factory_id?: string
          partner_id?: string
          partner_type?: Database["public"]["Enums"]["partner_type"]
        }
        Relationships: [
          {
            foreignKeyName: "factory_partners_factory_fkey"
            columns: ["factory_id"]
            isOneToOne: false
            referencedRelation: "factories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "factory_partners_partner_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "partners"
            referencedColumns: ["id"]
          },
        ]
      }
      materials: {
        Row: {
          created_at: string
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      news: {
        Row: {
          category: string | null
          created_at: string
          department_id: string | null
          detail: string | null
          id: string
          image: string | null
          pinned: boolean
          priority: Database["public"]["Enums"]["news_priority"]
          published_at: string | null
          summary: string | null
          title: string
          updated_at: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          department_id?: string | null
          detail?: string | null
          id?: string
          image?: string | null
          pinned?: boolean
          priority?: Database["public"]["Enums"]["news_priority"]
          published_at?: string | null
          summary?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          category?: string | null
          created_at?: string
          department_id?: string | null
          detail?: string | null
          id?: string
          image?: string | null
          pinned?: boolean
          priority?: Database["public"]["Enums"]["news_priority"]
          published_at?: string | null
          summary?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "news_department_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
        ]
      }
      partners: {
        Row: {
          company_name: string
          created_at: string
          id: string
          tax_id: string
          updated_at: string
        }
        Insert: {
          company_name: string
          created_at?: string
          id?: string
          tax_id: string
          updated_at?: string
        }
        Update: {
          company_name?: string
          created_at?: string
          id?: string
          tax_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          birth_date: string
          created_at: string | null
          first_name: string
          id: string
          last_name: string
          phone: string
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          birth_date: string
          created_at?: string | null
          first_name: string
          id: string
          last_name: string
          phone: string
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          birth_date?: string
          created_at?: string | null
          first_name?: string
          id?: string
          last_name?: string
          phone?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      transactions: {
        Row: {
          amount: number
          created_at: string
          created_by: string
          factory_id: string
          id: string
          material_id: string
          partner_id: string
          transaction_date: string
          type: Database["public"]["Enums"]["transaction_type"]
          updated_at: string
          weight_kg: number
        }
        Insert: {
          amount: number
          created_at?: string
          created_by: string
          factory_id: string
          id?: string
          material_id: string
          partner_id: string
          transaction_date: string
          type: Database["public"]["Enums"]["transaction_type"]
          updated_at?: string
          weight_kg: number
        }
        Update: {
          amount?: number
          created_at?: string
          created_by?: string
          factory_id?: string
          id?: string
          material_id?: string
          partner_id?: string
          transaction_date?: string
          type?: Database["public"]["Enums"]["transaction_type"]
          updated_at?: string
          weight_kg?: number
        }
        Relationships: [
          {
            foreignKeyName: "transactions_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_factory_fkey"
            columns: ["factory_id"]
            isOneToOne: false
            referencedRelation: "factories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_material_fkey"
            columns: ["material_id"]
            isOneToOne: false
            referencedRelation: "materials"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_partner_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "partners"
            referencedColumns: ["id"]
          },
        ]
      }
      water_reports: {
        Row: {
          consumption_m3: number
          cost: number
          created_at: string
          created_by: string
          factory_id: string
          id: string
          report_month: string
          updated_at: string
        }
        Insert: {
          consumption_m3: number
          cost: number
          created_at?: string
          created_by: string
          factory_id: string
          id?: string
          report_month: string
          updated_at?: string
        }
        Update: {
          consumption_m3?: number
          cost?: number
          created_at?: string
          created_by?: string
          factory_id?: string
          id?: string
          report_month?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "water_reports_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "water_reports_factory_fkey"
            columns: ["factory_id"]
            isOneToOne: false
            referencedRelation: "factories"
            referencedColumns: ["id"]
          },
        ]
      }
      workforce_reports: {
        Row: {
          created_at: string
          created_by: string
          factory_id: string
          headcount: number
          id: string
          report_month: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by: string
          factory_id: string
          headcount: number
          id?: string
          report_month: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string
          factory_id?: string
          headcount?: number
          id?: string
          report_month?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "workforce_reports_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workforce_reports_factory_fkey"
            columns: ["factory_id"]
            isOneToOne: false
            referencedRelation: "factories"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_factory_member: { Args: { fid: string }; Returns: boolean }
    }
    Enums: {
      news_priority: "urgent" | "high" | "normal" | "info"
      partner_type: "purchase" | "sale" | "both"
      transaction_type: "buy" | "sell"
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
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
      news_priority: ["urgent", "high", "normal", "info"],
      partner_type: ["purchase", "sale", "both"],
      transaction_type: ["buy", "sell"],
    },
  },
} as const
