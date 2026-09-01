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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      blog_posts: {
        Row: {
          author_name: string | null
          content: string | null
          created_at: string
          excerpt: string | null
          featured_image_url: string | null
          id: string
          long_tail_queries: string[] | null
          meta_description: string | null
          published_at: string | null
          seo_keywords: string[] | null
          slug: string
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          author_name?: string | null
          content?: string | null
          created_at?: string
          excerpt?: string | null
          featured_image_url?: string | null
          id?: string
          long_tail_queries?: string[] | null
          meta_description?: string | null
          published_at?: string | null
          seo_keywords?: string[] | null
          slug: string
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          author_name?: string | null
          content?: string | null
          created_at?: string
          excerpt?: string | null
          featured_image_url?: string | null
          id?: string
          long_tail_queries?: string[] | null
          meta_description?: string | null
          published_at?: string | null
          seo_keywords?: string[] | null
          slug?: string
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      campaign_schedules: {
        Row: {
          approved: boolean | null
          campaign_id: string
          created_at: string | null
          dispatched: boolean | null
          email_template_id: string
          id: string
          scheduled_at: string
          sequence_order: number
          timezone: string | null
        }
        Insert: {
          approved?: boolean | null
          campaign_id: string
          created_at?: string | null
          dispatched?: boolean | null
          email_template_id: string
          id?: string
          scheduled_at: string
          sequence_order: number
          timezone?: string | null
        }
        Update: {
          approved?: boolean | null
          campaign_id?: string
          created_at?: string | null
          dispatched?: boolean | null
          email_template_id?: string
          id?: string
          scheduled_at?: string
          sequence_order?: number
          timezone?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "campaign_schedules_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "email_campaigns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "campaign_schedules_email_template_id_fkey"
            columns: ["email_template_id"]
            isOneToOne: false
            referencedRelation: "email_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      campaign_target_customers: {
        Row: {
          campaign_id: string
          created_at: string | null
          customer_id: string
          id: string
        }
        Insert: {
          campaign_id: string
          created_at?: string | null
          customer_id: string
          id?: string
        }
        Update: {
          campaign_id?: string
          created_at?: string | null
          customer_id?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "campaign_target_customers_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "email_campaigns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "campaign_target_customers_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      campaign_target_groups: {
        Row: {
          campaign_id: string
          created_at: string | null
          group_id: string
          id: string
        }
        Insert: {
          campaign_id: string
          created_at?: string | null
          group_id: string
          id?: string
        }
        Update: {
          campaign_id?: string
          created_at?: string | null
          group_id?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "campaign_target_groups_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "email_campaigns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "campaign_target_groups_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "customer_groups"
            referencedColumns: ["id"]
          },
        ]
      }
      customer_events: {
        Row: {
          created_at: string | null
          customer_id: string
          event_data: Json | null
          event_type: string
          id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          customer_id: string
          event_data?: Json | null
          event_type: string
          id?: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          customer_id?: string
          event_data?: Json | null
          event_type?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "customer_events_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customer_events_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      customer_group_memberships: {
        Row: {
          created_at: string | null
          customer_id: string
          group_id: string
          id: string
        }
        Insert: {
          created_at?: string | null
          customer_id: string
          group_id: string
          id?: string
        }
        Update: {
          created_at?: string | null
          customer_id?: string
          group_id?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "customer_group_memberships_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customer_group_memberships_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "customer_groups"
            referencedColumns: ["id"]
          },
        ]
      }
      customer_groups: {
        Row: {
          color: string | null
          created_at: string | null
          description: string | null
          id: string
          name: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          color?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          color?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "customer_groups_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      customers: {
        Row: {
          consent: boolean | null
          created_at: string | null
          custom_fields: Json | null
          email: string
          id: string
          name: string | null
          tags: string[] | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          consent?: boolean | null
          created_at?: string | null
          custom_fields?: Json | null
          email: string
          id?: string
          name?: string | null
          tags?: string[] | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          consent?: boolean | null
          created_at?: string | null
          custom_fields?: Json | null
          email?: string
          id?: string
          name?: string | null
          tags?: string[] | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "customers_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      email_campaigns: {
        Row: {
          created_at: string | null
          id: string
          name: string
          status: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
          status?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
          status?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "email_campaigns_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      email_sends: {
        Row: {
          clicked: boolean | null
          customer_id: string
          id: string
          opened: boolean | null
          sent_at: string | null
          template_id: string
          user_id: string
        }
        Insert: {
          clicked?: boolean | null
          customer_id: string
          id?: string
          opened?: boolean | null
          sent_at?: string | null
          template_id: string
          user_id: string
        }
        Update: {
          clicked?: boolean | null
          customer_id?: string
          id?: string
          opened?: boolean | null
          sent_at?: string | null
          template_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "email_sends_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "email_sends_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "email_templates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "email_sends_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      email_templates: {
        Row: {
          campaign_id: string
          content: string
          created_at: string | null
          id: string
          sequence_order: number
          subject: string
          user_id: string
        }
        Insert: {
          campaign_id: string
          content: string
          created_at?: string | null
          id?: string
          sequence_order: number
          subject: string
          user_id: string
        }
        Update: {
          campaign_id?: string
          content?: string
          created_at?: string | null
          id?: string
          sequence_order?: number
          subject?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "email_templates_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "email_campaigns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "email_templates_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      faqs: {
        Row: {
          answer: string
          category: string | null
          created_at: string
          id: string
          is_active: boolean
          question: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          answer: string
          category?: string | null
          created_at?: string
          id?: string
          is_active?: boolean
          question: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          answer?: string
          category?: string | null
          created_at?: string
          id?: string
          is_active?: boolean
          question?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string | null
          email: string
          id: string
        }
        Insert: {
          created_at?: string | null
          email: string
          id: string
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
        }
        Relationships: []
      }
      sender_identities: {
        Row: {
          created_at: string | null
          dkim_verified: boolean | null
          domain: string | null
          from_email: string
          from_name: string
          id: string
          spf_verified: boolean | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          dkim_verified?: boolean | null
          domain?: string | null
          from_email: string
          from_name: string
          id?: string
          spf_verified?: boolean | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          dkim_verified?: boolean | null
          domain?: string | null
          from_email?: string
          from_name?: string
          id?: string
          spf_verified?: boolean | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "sender_identities_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      suppressions: {
        Row: {
          created_at: string | null
          email: string
          id: string
          reason: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          reason: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          reason?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "suppressions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      community_moderation_events: {
        Row: {
          action: string
          actor_id: string | null
          created_at: string
          id: string
          new_status: string | null
          notes: string | null
          previous_status: string | null
          publication_id: string | null
          submission_id: string | null
        }
        Insert: {
          action: string
          actor_id?: string | null
          created_at?: string
          id?: string
          new_status?: string | null
          notes?: string | null
          previous_status?: string | null
          publication_id?: string | null
          submission_id?: string | null
        }
        Update: {
          action?: string
          actor_id?: string | null
          created_at?: string
          id?: string
          new_status?: string | null
          notes?: string | null
          previous_status?: string | null
          publication_id?: string | null
          submission_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "community_moderation_events_publication_id_fkey"
            columns: ["publication_id"]
            isOneToOne: false
            referencedRelation: "community_publications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "community_moderation_events_submission_id_fkey"
            columns: ["submission_id"]
            isOneToOne: false
            referencedRelation: "community_submissions"
            referencedColumns: ["id"]
          },
        ]
      }
      community_publication_media: {
        Row: {
          alt_text: string
          caption: string | null
          created_at: string
          height: number | null
          id: string
          is_primary: boolean
          media_type: Database["public"]["Enums"]["community_media_type"]
          poster_path: string | null
          publication_id: string
          public_storage_path: string
          sort_order: number
          transcript: string | null
          width: number | null
        }
        Insert: {
          alt_text?: string
          caption?: string | null
          created_at?: string
          height?: number | null
          id?: string
          is_primary?: boolean
          media_type: Database["public"]["Enums"]["community_media_type"]
          poster_path?: string | null
          publication_id: string
          public_storage_path: string
          sort_order?: number
          transcript?: string | null
          width?: number | null
        }
        Update: {
          alt_text?: string
          caption?: string | null
          created_at?: string
          height?: number | null
          id?: string
          is_primary?: boolean
          media_type?: Database["public"]["Enums"]["community_media_type"]
          poster_path?: string | null
          publication_id?: string
          public_storage_path?: string
          sort_order?: number
          transcript?: string | null
          width?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "community_publication_media_publication_id_fkey"
            columns: ["publication_id"]
            isOneToOne: false
            referencedRelation: "community_publications"
            referencedColumns: ["id"]
          },
        ]
      }
      community_publications: {
        Row: {
          approved_social_handle: string | null
          archived_at: string | null
          category: Database["public"]["Enums"]["community_category"]
          created_at: string
          edited_story: string
          featured: boolean
          flowers_used: string | null
          has_video: boolean
          id: string
          og_image_path: string | null
          project_title: string
          public_display_name: string
          publication_status: Database["public"]["Enums"]["community_publication_status"]
          published_at: string | null
          related_product_url: string | null
          related_resource_slug: string | null
          seo_description: string | null
          seo_title: string | null
          slug: string
          source_type: string
          stage: Database["public"]["Enums"]["community_stage"]
          submission_id: string
          updated_at: string
          verified_hwabelle_customer: boolean
          video_caption_provided: boolean
        }
        Insert: {
          approved_social_handle?: string | null
          archived_at?: string | null
          category: Database["public"]["Enums"]["community_category"]
          created_at?: string
          edited_story: string
          featured?: boolean
          flowers_used?: string | null
          has_video?: boolean
          id?: string
          og_image_path?: string | null
          project_title: string
          public_display_name: string
          publication_status?: Database["public"]["Enums"]["community_publication_status"]
          published_at?: string | null
          related_product_url?: string | null
          related_resource_slug?: string | null
          seo_description?: string | null
          seo_title?: string | null
          slug: string
          source_type?: string
          stage: Database["public"]["Enums"]["community_stage"]
          submission_id: string
          updated_at?: string
          verified_hwabelle_customer?: boolean
          video_caption_provided?: boolean
        }
        Update: {
          approved_social_handle?: string | null
          archived_at?: string | null
          category?: Database["public"]["Enums"]["community_category"]
          created_at?: string
          edited_story?: string
          featured?: boolean
          flowers_used?: string | null
          has_video?: boolean
          id?: string
          og_image_path?: string | null
          project_title?: string
          public_display_name?: string
          publication_status?: Database["public"]["Enums"]["community_publication_status"]
          published_at?: string | null
          related_product_url?: string | null
          related_resource_slug?: string | null
          seo_description?: string | null
          seo_title?: string | null
          slug?: string
          source_type?: string
          stage?: Database["public"]["Enums"]["community_stage"]
          submission_id?: string
          updated_at?: string
          verified_hwabelle_customer?: boolean
          video_caption_provided?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "community_publications_submission_id_fkey"
            columns: ["submission_id"]
            isOneToOne: false
            referencedRelation: "community_submissions"
            referencedColumns: ["id"]
          },
        ]
      }
      community_rate_limit: {
        Row: {
          id: string
          identifier_hash: string
          request_count: number
          window_start: string
        }
        Insert: {
          id?: string
          identifier_hash: string
          request_count?: number
          window_start?: string
        }
        Update: {
          id?: string
          identifier_hash?: string
          request_count?: number
          window_start?: string
        }
        Relationships: []
      }
      community_submission_media: {
        Row: {
          byte_size: number
          created_at: string
          duration_seconds: number | null
          height: number | null
          id: string
          media_type: Database["public"]["Enums"]["community_media_type"]
          mime_type: string
          original_filename: string | null
          private_storage_path: string
          processing_status: string
          sort_order: number
          submission_id: string
          width: number | null
        }
        Insert: {
          byte_size: number
          created_at?: string
          duration_seconds?: number | null
          height?: number | null
          id?: string
          media_type: Database["public"]["Enums"]["community_media_type"]
          mime_type: string
          original_filename?: string | null
          private_storage_path: string
          processing_status?: string
          sort_order?: number
          submission_id: string
          width?: number | null
        }
        Update: {
          byte_size?: number
          created_at?: string
          duration_seconds?: number | null
          height?: number | null
          id?: string
          media_type?: Database["public"]["Enums"]["community_media_type"]
          mime_type?: string
          original_filename?: string | null
          private_storage_path?: string
          processing_status?: string
          sort_order?: number
          submission_id?: string
          width?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "community_submission_media_submission_id_fkey"
            columns: ["submission_id"]
            isOneToOne: false
            referencedRelation: "community_submissions"
            referencedColumns: ["id"]
          },
        ]
      }
      community_submissions: {
        Row: {
          category: Database["public"]["Enums"]["community_category"]
          consent_timestamp: string
          consent_version: string
          created_at: string
          email: string
          feature_permission: boolean
          first_name: string
          flowers_used: string | null
          id: string
          moderation_status: Database["public"]["Enums"]["community_moderation_status"]
          order_reference: string | null
          original_story: string
          project_title: string
          rights_confirmed: boolean
          social_handle: string | null
          social_tag_permission: boolean
          stage: Database["public"]["Enums"]["community_stage"]
          updated_at: string
          upload_finalized: boolean
          upload_session_expires: string
          upload_session_id: string
        }
        Insert: {
          category: Database["public"]["Enums"]["community_category"]
          consent_timestamp?: string
          consent_version?: string
          created_at?: string
          email: string
          feature_permission?: boolean
          first_name: string
          flowers_used?: string | null
          id?: string
          moderation_status?: Database["public"]["Enums"]["community_moderation_status"]
          order_reference?: string | null
          original_story: string
          project_title: string
          rights_confirmed?: boolean
          social_handle?: string | null
          social_tag_permission?: boolean
          stage: Database["public"]["Enums"]["community_stage"]
          updated_at?: string
          upload_finalized?: boolean
          upload_session_expires?: string
          upload_session_id?: string
        }
        Update: {
          category?: Database["public"]["Enums"]["community_category"]
          consent_timestamp?: string
          consent_version?: string
          created_at?: string
          email?: string
          feature_permission?: boolean
          first_name?: string
          flowers_used?: string | null
          id?: string
          moderation_status?: Database["public"]["Enums"]["community_moderation_status"]
          order_reference?: string | null
          original_story?: string
          project_title?: string
          rights_confirmed?: boolean
          social_handle?: string | null
          social_tag_permission?: boolean
          stage?: Database["public"]["Enums"]["community_stage"]
          updated_at?: string
          upload_finalized?: boolean
          upload_session_expires?: string
          upload_session_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
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
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
      community_category:
        | "weddings"
        | "garden_flowers"
        | "gifts_memorials"
        | "unboxing"
        | "before_after"
        | "in_progress"
        | "finished_piece"
        | "other"
      community_media_type: "image" | "video"
      community_moderation_status:
        | "received"
        | "pending_review"
        | "changes_requested"
        | "approved"
        | "rejected"
        | "published"
        | "archived"
      community_publication_status: "draft" | "published" | "archived"
      community_stage: "unboxing" | "in_progress" | "finished" | "before_after"
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
      app_role: ["admin", "moderator", "user"],
    },
  },
} as const
