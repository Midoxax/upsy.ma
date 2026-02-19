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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      client_matching_requests: {
        Row: {
          budget_max: number | null
          created_at: string | null
          email: string
          id: string
          languages_preferred: string[]
          location_city: string | null
          name: string
          notes: string | null
          phone: string | null
          prefers_online: boolean | null
          specialty_needed: string
          updated_at: string | null
        }
        Insert: {
          budget_max?: number | null
          created_at?: string | null
          email: string
          id?: string
          languages_preferred?: string[]
          location_city?: string | null
          name: string
          notes?: string | null
          phone?: string | null
          prefers_online?: boolean | null
          specialty_needed: string
          updated_at?: string | null
        }
        Update: {
          budget_max?: number | null
          created_at?: string | null
          email?: string
          id?: string
          languages_preferred?: string[]
          location_city?: string | null
          name?: string
          notes?: string | null
          phone?: string | null
          prefers_online?: boolean | null
          specialty_needed?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "client_matching_requests_specialty_needed_fkey"
            columns: ["specialty_needed"]
            isOneToOne: false
            referencedRelation: "specialties"
            referencedColumns: ["id"]
          },
        ]
      }
      contact_submissions: {
        Row: {
          created_at: string
          email: string
          id: string
          message: string
          name: string
          phone: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          message: string
          name: string
          phone?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          message?: string
          name?: string
          phone?: string | null
        }
        Relationships: []
      }
      languages: {
        Row: {
          created_at: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      leads: {
        Row: {
          client_email: string
          client_name: string
          client_phone: string | null
          concerns: string
          created_at: string | null
          id: string
          preferences: string | null
          psychologist_id: string
          status: string
          updated_at: string | null
        }
        Insert: {
          client_email: string
          client_name: string
          client_phone?: string | null
          concerns: string
          created_at?: string | null
          id?: string
          preferences?: string | null
          psychologist_id: string
          status?: string
          updated_at?: string | null
        }
        Update: {
          client_email?: string
          client_name?: string
          client_phone?: string | null
          concerns?: string
          created_at?: string | null
          id?: string
          preferences?: string | null
          psychologist_id?: string
          status?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "leads_psychologist_id_fkey"
            columns: ["psychologist_id"]
            isOneToOne: false
            referencedRelation: "psychologist_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      proposal_requests: {
        Row: {
          contact_name: string
          created_at: string
          email: string
          id: string
          message: string | null
          organization_name: string
          organization_size: string | null
          phone: string | null
          service_interest: string
          status: string
          updated_at: string
        }
        Insert: {
          contact_name: string
          created_at?: string
          email: string
          id?: string
          message?: string | null
          organization_name: string
          organization_size?: string | null
          phone?: string | null
          service_interest: string
          status?: string
          updated_at?: string
        }
        Update: {
          contact_name?: string
          created_at?: string
          email?: string
          id?: string
          message?: string | null
          organization_name?: string
          organization_size?: string | null
          phone?: string | null
          service_interest?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      psychologist_applications: {
        Row: {
          accreditation_number: string | null
          created_at: string | null
          email: string
          full_name: string
          id: string
          notes: string | null
          phone: string | null
          qualifications: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          status: string
          submitted_at: string | null
          updated_at: string | null
        }
        Insert: {
          accreditation_number?: string | null
          created_at?: string | null
          email: string
          full_name: string
          id?: string
          notes?: string | null
          phone?: string | null
          qualifications?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          submitted_at?: string | null
          updated_at?: string | null
        }
        Update: {
          accreditation_number?: string | null
          created_at?: string | null
          email?: string
          full_name?: string
          id?: string
          notes?: string | null
          phone?: string | null
          qualifications?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          submitted_at?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      psychologist_languages: {
        Row: {
          language_id: string
          psychologist_id: string
        }
        Insert: {
          language_id: string
          psychologist_id: string
        }
        Update: {
          language_id?: string
          psychologist_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "psychologist_languages_language_id_fkey"
            columns: ["language_id"]
            isOneToOne: false
            referencedRelation: "languages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "psychologist_languages_psychologist_id_fkey"
            columns: ["psychologist_id"]
            isOneToOne: false
            referencedRelation: "psychologist_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      psychologist_profiles: {
        Row: {
          bio: string | null
          calendly_url: string | null
          city: string | null
          created_at: string | null
          full_name: string
          hourly_rate_mad: number | null
          id: string
          is_accredited: boolean | null
          is_published: boolean | null
          offers_in_person: boolean | null
          offers_online: boolean | null
          photo_url: string | null
          slug: string
          updated_at: string | null
        }
        Insert: {
          bio?: string | null
          calendly_url?: string | null
          city?: string | null
          created_at?: string | null
          full_name: string
          hourly_rate_mad?: number | null
          id: string
          is_accredited?: boolean | null
          is_published?: boolean | null
          offers_in_person?: boolean | null
          offers_online?: boolean | null
          photo_url?: string | null
          slug: string
          updated_at?: string | null
        }
        Update: {
          bio?: string | null
          calendly_url?: string | null
          city?: string | null
          created_at?: string | null
          full_name?: string
          hourly_rate_mad?: number | null
          id?: string
          is_accredited?: boolean | null
          is_published?: boolean | null
          offers_in_person?: boolean | null
          offers_online?: boolean | null
          photo_url?: string | null
          slug?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      psychologist_specialties: {
        Row: {
          psychologist_id: string
          specialty_id: string
        }
        Insert: {
          psychologist_id: string
          specialty_id: string
        }
        Update: {
          psychologist_id?: string
          specialty_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "psychologist_specialties_psychologist_id_fkey"
            columns: ["psychologist_id"]
            isOneToOne: false
            referencedRelation: "psychologist_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "psychologist_specialties_specialty_id_fkey"
            columns: ["specialty_id"]
            isOneToOne: false
            referencedRelation: "specialties"
            referencedColumns: ["id"]
          },
        ]
      }
      specialties: {
        Row: {
          created_at: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          created_at: string | null
          ends_at: string | null
          id: string
          plan_type: string
          psychologist_id: string
          starts_at: string | null
          status: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          ends_at?: string | null
          id?: string
          plan_type?: string
          psychologist_id: string
          starts_at?: string | null
          status?: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          ends_at?: string | null
          id?: string
          plan_type?: string
          psychologist_id?: string
          starts_at?: string | null
          status?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_psychologist_id_fkey"
            columns: ["psychologist_id"]
            isOneToOne: true
            referencedRelation: "psychologist_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      create_admin_user: {
        Args: { _email: string; _password: string }
        Returns: Json
      }
      generate_slug: { Args: { id: string; name: string }; Returns: string }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      search_psychologists: {
        Args: {
          p_city?: string
          p_in_person?: boolean
          p_languages?: string[]
          p_max_price?: number
          p_min_price?: number
          p_online?: boolean
          p_page?: number
          p_page_size?: number
          p_specialties?: string[]
        }
        Returns: {
          bio: string
          calendly_url: string
          city: string
          created_at: string
          full_name: string
          hourly_rate_mad: number
          id: string
          is_accredited: boolean
          is_published: boolean
          offers_in_person: boolean
          offers_online: boolean
          photo_url: string
          slug: string
          total_count: number
          updated_at: string
        }[]
      }
    }
    Enums: {
      app_role: "admin" | "psychologist" | "user"
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
      app_role: ["admin", "psychologist", "user"],
    },
  },
} as const
