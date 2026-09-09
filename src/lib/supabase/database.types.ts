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
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      contact_submissions: {
        Row: {
          budget_range: string | null
          company: string | null
          created_at: string
          email: string
          id: string
          is_handled: boolean
          message: string
          name: string
          phone: string | null
          preferred_timeline: string | null
          service_interested: string | null
          website_url: string | null
        }
        Insert: {
          budget_range?: string | null
          company?: string | null
          created_at?: string
          email: string
          id?: string
          is_handled?: boolean
          message: string
          name: string
          phone?: string | null
          preferred_timeline?: string | null
          service_interested?: string | null
          website_url?: string | null
        }
        Update: {
          budget_range?: string | null
          company?: string | null
          created_at?: string
          email?: string
          id?: string
          is_handled?: boolean
          message?: string
          name?: string
          phone?: string | null
          preferred_timeline?: string | null
          service_interested?: string | null
          website_url?: string | null
        }
        Relationships: []
      }
      faq_items: {
        Row: {
          answer: string
          category: string | null
          created_at: string
          display_order: number
          id: string
          is_published: boolean
          question: string
          updated_at: string
        }
        Insert: {
          answer: string
          category?: string | null
          created_at?: string
          display_order?: number
          id?: string
          is_published?: boolean
          question: string
          updated_at?: string
        }
        Update: {
          answer?: string
          category?: string | null
          created_at?: string
          display_order?: number
          id?: string
          is_published?: boolean
          question?: string
          updated_at?: string
        }
        Relationships: []
      }
      generated_concepts: {
        Row: {
          created_at: string
          id: string
          image_path: string
          visualization_request_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          image_path: string
          visualization_request_id: string
        }
        Update: {
          created_at?: string
          id?: string
          image_path?: string
          visualization_request_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "generated_concepts_visualization_request_id_fkey"
            columns: ["visualization_request_id"]
            isOneToOne: false
            referencedRelation: "visualization_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      leads: {
        Row: {
          business: string | null
          created_at: string
          email: string
          id: string
          is_handled: boolean
          name: string
          phone: string | null
          project_description: string | null
          visualization_request_id: string | null
        }
        Insert: {
          business?: string | null
          created_at?: string
          email: string
          id?: string
          is_handled?: boolean
          name: string
          phone?: string | null
          project_description?: string | null
          visualization_request_id?: string | null
        }
        Update: {
          business?: string | null
          created_at?: string
          email?: string
          id?: string
          is_handled?: boolean
          name?: string
          phone?: string | null
          project_description?: string | null
          visualization_request_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "leads_visualization_request_id_fkey"
            columns: ["visualization_request_id"]
            isOneToOne: false
            referencedRelation: "visualization_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      portfolio_items: {
        Row: {
          client_name: string | null
          content: string | null
          cover_image_path: string | null
          created_at: string
          display_order: number
          id: string
          industry: string | null
          is_placeholder: boolean
          is_published: boolean
          project_url: string | null
          results: string | null
          services_provided: string[]
          slug: string
          summary: string | null
          technologies: string[]
          title: string
          updated_at: string
        }
        Insert: {
          client_name?: string | null
          content?: string | null
          cover_image_path?: string | null
          created_at?: string
          display_order?: number
          id?: string
          industry?: string | null
          is_placeholder?: boolean
          is_published?: boolean
          project_url?: string | null
          results?: string | null
          services_provided?: string[]
          slug: string
          summary?: string | null
          technologies?: string[]
          title: string
          updated_at?: string
        }
        Update: {
          client_name?: string | null
          content?: string | null
          cover_image_path?: string | null
          created_at?: string
          display_order?: number
          id?: string
          industry?: string | null
          is_placeholder?: boolean
          is_published?: boolean
          project_url?: string | null
          results?: string | null
          services_provided?: string[]
          slug?: string
          summary?: string | null
          technologies?: string[]
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      posts: {
        Row: {
          author_id: string | null
          content: string
          cover_image_path: string | null
          created_at: string
          excerpt: string | null
          id: string
          is_published: boolean
          published_at: string | null
          slug: string
          title: string
          updated_at: string
        }
        Insert: {
          author_id?: string | null
          content: string
          cover_image_path?: string | null
          created_at?: string
          excerpt?: string | null
          id?: string
          is_published?: boolean
          published_at?: string | null
          slug: string
          title: string
          updated_at?: string
        }
        Update: {
          author_id?: string | null
          content?: string
          cover_image_path?: string | null
          created_at?: string
          excerpt?: string | null
          id?: string
          is_published?: boolean
          published_at?: string | null
          slug?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "posts_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          full_name: string | null
          id: string
          role: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id: string
          role?: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          role?: string
          updated_at?: string
        }
        Relationships: []
      }
      services: {
        Row: {
          created_at: string
          description: string | null
          display_order: number
          icon: string | null
          id: string
          is_published: boolean
          slug: string
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          display_order?: number
          icon?: string | null
          id?: string
          is_published?: boolean
          slug: string
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          display_order?: number
          icon?: string | null
          id?: string
          is_published?: boolean
          slug?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      testimonials: {
        Row: {
          avatar_url: string | null
          client_name: string
          client_title: string | null
          company: string | null
          created_at: string
          display_order: number
          id: string
          is_placeholder: boolean
          is_published: boolean
          quote: string
          rating: number
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          client_name: string
          client_title?: string | null
          company?: string | null
          created_at?: string
          display_order?: number
          id?: string
          is_placeholder?: boolean
          is_published?: boolean
          quote: string
          rating?: number
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          client_name?: string
          client_title?: string | null
          company?: string | null
          created_at?: string
          display_order?: number
          id?: string
          is_placeholder?: boolean
          is_published?: boolean
          quote?: string
          rating?: number
          updated_at?: string
        }
        Relationships: []
      }
      visualization_requests: {
        Row: {
          colors: string | null
          created_at: string
          description: string
          error_message: string | null
          features: string | null
          id: string
          industry: string | null
          prompt_used: string | null
          status: string
          style: string | null
          target_audience: string | null
        }
        Insert: {
          colors?: string | null
          created_at?: string
          description: string
          error_message?: string | null
          features?: string | null
          id?: string
          industry?: string | null
          prompt_used?: string | null
          status?: string
          style?: string | null
          target_audience?: string | null
        }
        Update: {
          colors?: string | null
          created_at?: string
          description?: string
          error_message?: string | null
          features?: string | null
          id?: string
          industry?: string | null
          prompt_used?: string | null
          status?: string
          style?: string | null
          target_audience?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_admin: { Args: never; Returns: boolean }
    }
    Enums: {
      [_ in never]: never
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
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {},
  },
} as const
