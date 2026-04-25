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
      accreditation_decisions: {
        Row: {
          application_id: string
          created_at: string
          decided_by: string | null
          decision: string
          id: string
          level_assigned: string | null
          metadata: Json | null
          reason: string | null
        }
        Insert: {
          application_id: string
          created_at?: string
          decided_by?: string | null
          decision: string
          id?: string
          level_assigned?: string | null
          metadata?: Json | null
          reason?: string | null
        }
        Update: {
          application_id?: string
          created_at?: string
          decided_by?: string | null
          decision?: string
          id?: string
          level_assigned?: string | null
          metadata?: Json | null
          reason?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "accreditation_decisions_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "psychologist_applications"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_chat_history: {
        Row: {
          content: string
          conversation_id: string
          created_at: string | null
          id: string
          role: string
          user_id: string
        }
        Insert: {
          content: string
          conversation_id: string
          created_at?: string | null
          id?: string
          role: string
          user_id: string
        }
        Update: {
          content?: string
          conversation_id?: string
          created_at?: string | null
          id?: string
          role?: string
          user_id?: string
        }
        Relationships: []
      }
      ai_conversations: {
        Row: {
          created_at: string | null
          id: string
          title: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          title?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          title?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      ai_messages: {
        Row: {
          content: string
          conversation_id: string
          created_at: string | null
          id: string
          role: string
        }
        Insert: {
          content: string
          conversation_id: string
          created_at?: string | null
          id?: string
          role: string
        }
        Update: {
          content?: string
          conversation_id?: string
          created_at?: string | null
          id?: string
          role?: string
        }
        Relationships: [
          {
            foreignKeyName: "ai_messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "ai_conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      anamnesis_reminders: {
        Row: {
          anamnesis_id: string | null
          booking_id: string | null
          channel: string
          client_id: string
          created_at: string
          due_at: string
          error_message: string | null
          id: string
          sent_at: string | null
          status: string
        }
        Insert: {
          anamnesis_id?: string | null
          booking_id?: string | null
          channel?: string
          client_id: string
          created_at?: string
          due_at: string
          error_message?: string | null
          id?: string
          sent_at?: string | null
          status?: string
        }
        Update: {
          anamnesis_id?: string | null
          booking_id?: string | null
          channel?: string
          client_id?: string
          created_at?: string
          due_at?: string
          error_message?: string | null
          id?: string
          sent_at?: string | null
          status?: string
        }
        Relationships: []
      }
      assessment_questions: {
        Row: {
          assessment_id: string
          created_at: string | null
          dimension: string | null
          id: string
          options: Json | null
          order_index: number
          question_text: string
          question_type: string
        }
        Insert: {
          assessment_id: string
          created_at?: string | null
          dimension?: string | null
          id?: string
          options?: Json | null
          order_index?: number
          question_text: string
          question_type?: string
        }
        Update: {
          assessment_id?: string
          created_at?: string | null
          dimension?: string | null
          id?: string
          options?: Json | null
          order_index?: number
          question_text?: string
          question_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "assessment_questions_assessment_id_fkey"
            columns: ["assessment_id"]
            isOneToOne: false
            referencedRelation: "assessments"
            referencedColumns: ["id"]
          },
        ]
      }
      assessment_results: {
        Row: {
          answers: Json
          assessment_id: string
          completed_at: string | null
          created_at: string | null
          id: string
          interpretation: string | null
          scores: Json | null
          total_score: number | null
          user_id: string
        }
        Insert: {
          answers?: Json
          assessment_id: string
          completed_at?: string | null
          created_at?: string | null
          id?: string
          interpretation?: string | null
          scores?: Json | null
          total_score?: number | null
          user_id: string
        }
        Update: {
          answers?: Json
          assessment_id?: string
          completed_at?: string | null
          created_at?: string | null
          id?: string
          interpretation?: string | null
          scores?: Json | null
          total_score?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "assessment_results_assessment_id_fkey"
            columns: ["assessment_id"]
            isOneToOne: false
            referencedRelation: "assessments"
            referencedColumns: ["id"]
          },
        ]
      }
      assessments: {
        Row: {
          category: string
          created_at: string | null
          description: string | null
          estimated_minutes: number
          id: string
          is_published: boolean | null
          question_count: number
          title: string
        }
        Insert: {
          category?: string
          created_at?: string | null
          description?: string | null
          estimated_minutes?: number
          id?: string
          is_published?: boolean | null
          question_count?: number
          title: string
        }
        Update: {
          category?: string
          created_at?: string | null
          description?: string | null
          estimated_minutes?: number
          id?: string
          is_published?: boolean | null
          question_count?: number
          title?: string
        }
        Relationships: []
      }
      athlete_profiles: {
        Row: {
          coach_id: string | null
          confidence_score: number | null
          created_at: string | null
          focus_score: number | null
          id: string
          mental_readiness_score: number | null
          position: string | null
          resilience_score: number | null
          sport: string | null
          team: string | null
          updated_at: string | null
        }
        Insert: {
          coach_id?: string | null
          confidence_score?: number | null
          created_at?: string | null
          focus_score?: number | null
          id: string
          mental_readiness_score?: number | null
          position?: string | null
          resilience_score?: number | null
          sport?: string | null
          team?: string | null
          updated_at?: string | null
        }
        Update: {
          coach_id?: string | null
          confidence_score?: number | null
          created_at?: string | null
          focus_score?: number | null
          id?: string
          mental_readiness_score?: number | null
          position?: string | null
          resilience_score?: number | null
          sport?: string | null
          team?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      athlete_training_sessions: {
        Row: {
          athlete_id: string
          completed: boolean | null
          completed_at: string | null
          created_at: string | null
          duration_minutes: number | null
          id: string
          metrics: Json | null
          notes: string | null
          scheduled_at: string | null
          session_type: string
          title: string
        }
        Insert: {
          athlete_id: string
          completed?: boolean | null
          completed_at?: string | null
          created_at?: string | null
          duration_minutes?: number | null
          id?: string
          metrics?: Json | null
          notes?: string | null
          scheduled_at?: string | null
          session_type: string
          title: string
        }
        Update: {
          athlete_id?: string
          completed?: boolean | null
          completed_at?: string | null
          created_at?: string | null
          duration_minutes?: number | null
          id?: string
          metrics?: Json | null
          notes?: string | null
          scheduled_at?: string | null
          session_type?: string
          title?: string
        }
        Relationships: []
      }
      audit_log: {
        Row: {
          action: string
          created_at: string
          id: string
          metadata: Json | null
          resource_id: string | null
          resource_type: string
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string
          id?: string
          metadata?: Json | null
          resource_id?: string | null
          resource_type: string
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          id?: string
          metadata?: Json | null
          resource_id?: string | null
          resource_type?: string
          user_id?: string | null
        }
        Relationships: []
      }
      availability_slots: {
        Row: {
          created_at: string | null
          day_of_week: number
          end_time: string
          id: string
          is_active: boolean | null
          is_available: boolean
          psychologist_id: string
          session_duration_minutes: number | null
          start_time: string
        }
        Insert: {
          created_at?: string | null
          day_of_week: number
          end_time: string
          id?: string
          is_active?: boolean | null
          is_available?: boolean
          psychologist_id: string
          session_duration_minutes?: number | null
          start_time: string
        }
        Update: {
          created_at?: string | null
          day_of_week?: number
          end_time?: string
          id?: string
          is_active?: boolean | null
          is_available?: boolean
          psychologist_id?: string
          session_duration_minutes?: number | null
          start_time?: string
        }
        Relationships: [
          {
            foreignKeyName: "availability_slots_psychologist_id_fkey"
            columns: ["psychologist_id"]
            isOneToOne: false
            referencedRelation: "psychologist_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      bookings: {
        Row: {
          amount_mad: number | null
          created_at: string | null
          decline_reason: string | null
          duration_minutes: number
          id: string
          patient_email: string | null
          patient_id: string
          patient_notes: string | null
          payment_status: string | null
          proposal_expires_at: string | null
          proposal_token: string | null
          proposed_by: string | null
          psychologist_id: string
          scheduled_at: string
          session_type: string
          status: string
          updated_at: string | null
          video_room_id: string | null
        }
        Insert: {
          amount_mad?: number | null
          created_at?: string | null
          decline_reason?: string | null
          duration_minutes?: number
          id?: string
          patient_email?: string | null
          patient_id: string
          patient_notes?: string | null
          payment_status?: string | null
          proposal_expires_at?: string | null
          proposal_token?: string | null
          proposed_by?: string | null
          psychologist_id: string
          scheduled_at: string
          session_type?: string
          status?: string
          updated_at?: string | null
          video_room_id?: string | null
        }
        Update: {
          amount_mad?: number | null
          created_at?: string | null
          decline_reason?: string | null
          duration_minutes?: number
          id?: string
          patient_email?: string | null
          patient_id?: string
          patient_notes?: string | null
          payment_status?: string | null
          proposal_expires_at?: string | null
          proposal_token?: string | null
          proposed_by?: string | null
          psychologist_id?: string
          scheduled_at?: string
          session_type?: string
          status?: string
          updated_at?: string | null
          video_room_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bookings_psychologist_id_fkey"
            columns: ["psychologist_id"]
            isOneToOne: false
            referencedRelation: "psychologist_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      certificates: {
        Row: {
          certificate_number: string
          certificate_type: Database["public"]["Enums"]["certificate_type"]
          created_at: string | null
          description: string | null
          id: string
          issued_at: string
          metadata: Json | null
          recipient_name: string
          reference_id: string | null
          title: string
          user_id: string
        }
        Insert: {
          certificate_number?: string
          certificate_type: Database["public"]["Enums"]["certificate_type"]
          created_at?: string | null
          description?: string | null
          id?: string
          issued_at?: string
          metadata?: Json | null
          recipient_name: string
          reference_id?: string | null
          title: string
          user_id: string
        }
        Update: {
          certificate_number?: string
          certificate_type?: Database["public"]["Enums"]["certificate_type"]
          created_at?: string | null
          description?: string | null
          id?: string
          issued_at?: string
          metadata?: Json | null
          recipient_name?: string
          reference_id?: string | null
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      client_anamneses: {
        Row: {
          booking_id: string | null
          client_id: string
          completed_at: string | null
          consent_at: string | null
          consent_given: boolean
          created_at: string
          goals: Json
          history_family: Json
          history_personal: Json
          id: string
          identity: Json
          lifestyle: Json
          medical: Json
          presenting_complaint: Json
          psychologist_id: string | null
          reviewed_at: string | null
          risk_screening: Json
          status: string
          updated_at: string
        }
        Insert: {
          booking_id?: string | null
          client_id: string
          completed_at?: string | null
          consent_at?: string | null
          consent_given?: boolean
          created_at?: string
          goals?: Json
          history_family?: Json
          history_personal?: Json
          id?: string
          identity?: Json
          lifestyle?: Json
          medical?: Json
          presenting_complaint?: Json
          psychologist_id?: string | null
          reviewed_at?: string | null
          risk_screening?: Json
          status?: string
          updated_at?: string
        }
        Update: {
          booking_id?: string | null
          client_id?: string
          completed_at?: string | null
          consent_at?: string | null
          consent_given?: boolean
          created_at?: string
          goals?: Json
          history_family?: Json
          history_personal?: Json
          id?: string
          identity?: Json
          lifestyle?: Json
          medical?: Json
          presenting_complaint?: Json
          psychologist_id?: string | null
          reviewed_at?: string | null
          risk_screening?: Json
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
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
      course_enrollments: {
        Row: {
          completed_at: string | null
          completed_modules: string[] | null
          course_id: string
          created_at: string | null
          id: string
          progress_percent: number | null
          started_at: string | null
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          completed_modules?: string[] | null
          course_id: string
          created_at?: string | null
          id?: string
          progress_percent?: number | null
          started_at?: string | null
          user_id: string
        }
        Update: {
          completed_at?: string | null
          completed_modules?: string[] | null
          course_id?: string
          created_at?: string | null
          id?: string
          progress_percent?: number | null
          started_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "course_enrollments_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      course_modules: {
        Row: {
          content: string | null
          course_id: string
          created_at: string | null
          duration_minutes: number | null
          id: string
          order_index: number
          title: string
          video_url: string | null
        }
        Insert: {
          content?: string | null
          course_id: string
          created_at?: string | null
          duration_minutes?: number | null
          id?: string
          order_index?: number
          title: string
          video_url?: string | null
        }
        Update: {
          content?: string | null
          course_id?: string
          created_at?: string | null
          duration_minutes?: number | null
          id?: string
          order_index?: number
          title?: string
          video_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "course_modules_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      courses: {
        Row: {
          category: string
          created_at: string | null
          description: string | null
          difficulty_level: string | null
          duration_hours: number | null
          id: string
          is_published: boolean | null
          learning_path: string
          slug: string
          thumbnail_url: string | null
          title: string
        }
        Insert: {
          category?: string
          created_at?: string | null
          description?: string | null
          difficulty_level?: string | null
          duration_hours?: number | null
          id?: string
          is_published?: boolean | null
          learning_path?: string
          slug: string
          thumbnail_url?: string | null
          title: string
        }
        Update: {
          category?: string
          created_at?: string | null
          description?: string | null
          difficulty_level?: string | null
          duration_hours?: number | null
          id?: string
          is_published?: boolean | null
          learning_path?: string
          slug?: string
          thumbnail_url?: string | null
          title?: string
        }
        Relationships: []
      }
      documents: {
        Row: {
          created_at: string | null
          document_type: string
          file_name: string | null
          file_size_bytes: number | null
          file_url: string | null
          id: string
          metadata: Json | null
          mime_type: string | null
          psychologist_id: string | null
          session_id: string | null
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          document_type?: string
          file_name?: string | null
          file_size_bytes?: number | null
          file_url?: string | null
          id?: string
          metadata?: Json | null
          mime_type?: string | null
          psychologist_id?: string | null
          session_id?: string | null
          title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          document_type?: string
          file_name?: string | null
          file_size_bytes?: number | null
          file_url?: string | null
          id?: string
          metadata?: Json | null
          mime_type?: string | null
          psychologist_id?: string | null
          session_id?: string | null
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "documents_psychologist_id_fkey"
            columns: ["psychologist_id"]
            isOneToOne: false
            referencedRelation: "psychologist_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documents_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      edge_rate_limits: {
        Row: {
          count: number
          key: string
          window_start: string
        }
        Insert: {
          count?: number
          key: string
          window_start?: string
        }
        Update: {
          count?: number
          key?: string
          window_start?: string
        }
        Relationships: []
      }
      gamification_badges: {
        Row: {
          created_at: string | null
          criteria: Json | null
          description: string | null
          description_fr: string | null
          icon: string | null
          name: string
          name_fr: string | null
          rarity: string
          slug: string
          xp_reward: number
        }
        Insert: {
          created_at?: string | null
          criteria?: Json | null
          description?: string | null
          description_fr?: string | null
          icon?: string | null
          name: string
          name_fr?: string | null
          rarity?: string
          slug: string
          xp_reward?: number
        }
        Update: {
          created_at?: string | null
          criteria?: Json | null
          description?: string | null
          description_fr?: string | null
          icon?: string | null
          name?: string
          name_fr?: string | null
          rarity?: string
          slug?: string
          xp_reward?: number
        }
        Relationships: []
      }
      gamification_levels: {
        Row: {
          color: string
          created_at: string | null
          level: number
          name: string
          name_fr: string | null
          xp_required: number
        }
        Insert: {
          color?: string
          created_at?: string | null
          level: number
          name: string
          name_fr?: string | null
          xp_required?: number
        }
        Update: {
          color?: string
          created_at?: string | null
          level?: number
          name?: string
          name_fr?: string | null
          xp_required?: number
        }
        Relationships: []
      }
      growth_leads: {
        Row: {
          consent_marketing: boolean
          converted_user_id: string | null
          created_at: string
          email: string
          full_name: string | null
          id: string
          ip_hash: string | null
          locale: string | null
          nurture_stage: string | null
          phone: string | null
          score_breakdown: Json | null
          score_total: number | null
          source: string
          updated_at: string
          user_agent: string | null
        }
        Insert: {
          consent_marketing?: boolean
          converted_user_id?: string | null
          created_at?: string
          email: string
          full_name?: string | null
          id?: string
          ip_hash?: string | null
          locale?: string | null
          nurture_stage?: string | null
          phone?: string | null
          score_breakdown?: Json | null
          score_total?: number | null
          source?: string
          updated_at?: string
          user_agent?: string | null
        }
        Update: {
          consent_marketing?: boolean
          converted_user_id?: string | null
          created_at?: string
          email?: string
          full_name?: string | null
          id?: string
          ip_hash?: string | null
          locale?: string | null
          nurture_stage?: string | null
          phone?: string | null
          score_breakdown?: Json | null
          score_total?: number | null
          source?: string
          updated_at?: string
          user_agent?: string | null
        }
        Relationships: []
      }
      journal_entries: {
        Row: {
          content: string
          created_at: string | null
          id: string
          mood_tag: string | null
          prompt: string | null
          tags: string[] | null
          title: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          mood_tag?: string | null
          prompt?: string | null
          tags?: string[] | null
          title?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          mood_tag?: string | null
          prompt?: string | null
          tags?: string[] | null
          title?: string | null
          updated_at?: string | null
          user_id?: string
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
      mood_entries: {
        Row: {
          created_at: string | null
          energy_level: number | null
          id: string
          mood_score: number
          notes: string | null
          recorded_at: string | null
          stress_level: number | null
          tags: string[] | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          energy_level?: number | null
          id?: string
          mood_score: number
          notes?: string | null
          recorded_at?: string | null
          stress_level?: number | null
          tags?: string[] | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          energy_level?: number | null
          id?: string
          mood_score?: number
          notes?: string | null
          recorded_at?: string | null
          stress_level?: number | null
          tags?: string[] | null
          user_id?: string
        }
        Relationships: []
      }
      org_aggregate_reports: {
        Row: {
          created_at: string
          id: string
          metadata: Json | null
          org_id: string
          page_count: number | null
          period_end: string | null
          period_start: string | null
          report_type: string
          requested_by: string
          status: string
          storage_path: string | null
          title: string
        }
        Insert: {
          created_at?: string
          id?: string
          metadata?: Json | null
          org_id: string
          page_count?: number | null
          period_end?: string | null
          period_start?: string | null
          report_type: string
          requested_by: string
          status?: string
          storage_path?: string | null
          title: string
        }
        Update: {
          created_at?: string
          id?: string
          metadata?: Json | null
          org_id?: string
          page_count?: number | null
          period_end?: string | null
          period_start?: string | null
          report_type?: string
          requested_by?: string
          status?: string
          storage_path?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "org_aggregate_reports_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organization_accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      org_pulse_responses: {
        Row: {
          id: string
          mood_score: number
          org_id: string
          sentiment_text: string | null
          stress_level: number
          submission_token: string
          submitted_at: string
          survey_id: string
          workload_level: number
        }
        Insert: {
          id?: string
          mood_score: number
          org_id: string
          sentiment_text?: string | null
          stress_level: number
          submission_token: string
          submitted_at?: string
          survey_id: string
          workload_level: number
        }
        Update: {
          id?: string
          mood_score?: number
          org_id?: string
          sentiment_text?: string | null
          stress_level?: number
          submission_token?: string
          submitted_at?: string
          survey_id?: string
          workload_level?: number
        }
        Relationships: [
          {
            foreignKeyName: "org_pulse_responses_survey_id_fkey"
            columns: ["survey_id"]
            isOneToOne: false
            referencedRelation: "org_pulse_surveys"
            referencedColumns: ["id"]
          },
        ]
      }
      org_pulse_surveys: {
        Row: {
          created_at: string
          created_by: string
          description: string | null
          ends_at: string | null
          id: string
          org_id: string
          starts_at: string | null
          status: string
          title: string
        }
        Insert: {
          created_at?: string
          created_by: string
          description?: string | null
          ends_at?: string | null
          id?: string
          org_id: string
          starts_at?: string | null
          status?: string
          title: string
        }
        Update: {
          created_at?: string
          created_by?: string
          description?: string | null
          ends_at?: string | null
          id?: string
          org_id?: string
          starts_at?: string | null
          status?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "org_pulse_surveys_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organization_accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      organization_accounts: {
        Row: {
          billing_address: string | null
          billing_cycle: string | null
          city: string | null
          contact_email: string
          contact_phone: string | null
          country: string | null
          created_at: string | null
          ice: string | null
          id: string
          if_number: string | null
          industry: string | null
          logo_url: string | null
          monthly_price_mad: number | null
          name: string
          owner_id: string
          pdf_logo_url: string | null
          pdf_primary_color: string | null
          pdf_signature_label: string | null
          plan_type: string
          rc_number: string | null
          seats_total: number
          seats_used: number
          size_range: string | null
          subscription_status: string
          updated_at: string | null
          website: string | null
        }
        Insert: {
          billing_address?: string | null
          billing_cycle?: string | null
          city?: string | null
          contact_email: string
          contact_phone?: string | null
          country?: string | null
          created_at?: string | null
          ice?: string | null
          id?: string
          if_number?: string | null
          industry?: string | null
          logo_url?: string | null
          monthly_price_mad?: number | null
          name: string
          owner_id: string
          pdf_logo_url?: string | null
          pdf_primary_color?: string | null
          pdf_signature_label?: string | null
          plan_type?: string
          rc_number?: string | null
          seats_total?: number
          seats_used?: number
          size_range?: string | null
          subscription_status?: string
          updated_at?: string | null
          website?: string | null
        }
        Update: {
          billing_address?: string | null
          billing_cycle?: string | null
          city?: string | null
          contact_email?: string
          contact_phone?: string | null
          country?: string | null
          created_at?: string | null
          ice?: string | null
          id?: string
          if_number?: string | null
          industry?: string | null
          logo_url?: string | null
          monthly_price_mad?: number | null
          name?: string
          owner_id?: string
          pdf_logo_url?: string | null
          pdf_primary_color?: string | null
          pdf_signature_label?: string | null
          plan_type?: string
          rc_number?: string | null
          seats_total?: number
          seats_used?: number
          size_range?: string | null
          subscription_status?: string
          updated_at?: string | null
          website?: string | null
        }
        Relationships: []
      }
      organization_applications: {
        Row: {
          approved_org_id: string | null
          city: string | null
          contact_email: string
          contact_name: string
          contact_phone: string | null
          country: string | null
          created_at: string
          desired_seats: number | null
          ice: string | null
          id: string
          if_number: string | null
          industry: string | null
          message: string | null
          organization_name: string
          rc_number: string | null
          review_notes: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          size_range: string | null
          status: string
          updated_at: string
          use_case: string | null
          user_id: string | null
          website: string | null
        }
        Insert: {
          approved_org_id?: string | null
          city?: string | null
          contact_email: string
          contact_name: string
          contact_phone?: string | null
          country?: string | null
          created_at?: string
          desired_seats?: number | null
          ice?: string | null
          id?: string
          if_number?: string | null
          industry?: string | null
          message?: string | null
          organization_name: string
          rc_number?: string | null
          review_notes?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          size_range?: string | null
          status?: string
          updated_at?: string
          use_case?: string | null
          user_id?: string | null
          website?: string | null
        }
        Update: {
          approved_org_id?: string | null
          city?: string | null
          contact_email?: string
          contact_name?: string
          contact_phone?: string | null
          country?: string | null
          created_at?: string
          desired_seats?: number | null
          ice?: string | null
          id?: string
          if_number?: string | null
          industry?: string | null
          message?: string | null
          organization_name?: string
          rc_number?: string | null
          review_notes?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          size_range?: string | null
          status?: string
          updated_at?: string
          use_case?: string | null
          user_id?: string | null
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "organization_applications_approved_org_id_fkey"
            columns: ["approved_org_id"]
            isOneToOne: false
            referencedRelation: "organization_accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      organization_diagnostics: {
        Row: {
          completed_at: string | null
          conducted_by: string | null
          created_at: string | null
          diagnostic_type: string
          id: string
          organization_id: string
          recommendations: string | null
          results: Json | null
          status: string | null
        }
        Insert: {
          completed_at?: string | null
          conducted_by?: string | null
          created_at?: string | null
          diagnostic_type: string
          id?: string
          organization_id: string
          recommendations?: string | null
          results?: Json | null
          status?: string | null
        }
        Update: {
          completed_at?: string | null
          conducted_by?: string | null
          created_at?: string | null
          diagnostic_type?: string
          id?: string
          organization_id?: string
          recommendations?: string | null
          results?: Json | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "organization_diagnostics_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organization_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      organization_invoices: {
        Row: {
          created_at: string | null
          due_date: string | null
          id: string
          invoice_number: string
          notes: string | null
          org_id: string
          paid_at: string | null
          period_end: string
          period_start: string
          seats_billed: number
          status: string
          subtotal_mad: number
          tax_mad: number | null
          tax_rate: number | null
          total_mad: number | null
          unit_price_mad: number
        }
        Insert: {
          created_at?: string | null
          due_date?: string | null
          id?: string
          invoice_number: string
          notes?: string | null
          org_id: string
          paid_at?: string | null
          period_end: string
          period_start: string
          seats_billed: number
          status?: string
          subtotal_mad: number
          tax_mad?: number | null
          tax_rate?: number | null
          total_mad?: number | null
          unit_price_mad: number
        }
        Update: {
          created_at?: string | null
          due_date?: string | null
          id?: string
          invoice_number?: string
          notes?: string | null
          org_id?: string
          paid_at?: string | null
          period_end?: string
          period_start?: string
          seats_billed?: number
          status?: string
          subtotal_mad?: number
          tax_mad?: number | null
          tax_rate?: number | null
          total_mad?: number | null
          unit_price_mad?: number
        }
        Relationships: [
          {
            foreignKeyName: "organization_invoices_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organization_accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      organization_members: {
        Row: {
          email: string
          full_name: string | null
          id: string
          invite_token: string | null
          invited_at: string | null
          joined_at: string | null
          org_id: string
          role: string
          sessions_limit: number | null
          sessions_used: number | null
          status: string
          user_id: string | null
        }
        Insert: {
          email: string
          full_name?: string | null
          id?: string
          invite_token?: string | null
          invited_at?: string | null
          joined_at?: string | null
          org_id: string
          role?: string
          sessions_limit?: number | null
          sessions_used?: number | null
          status?: string
          user_id?: string | null
        }
        Update: {
          email?: string
          full_name?: string | null
          id?: string
          invite_token?: string | null
          invited_at?: string | null
          joined_at?: string | null
          org_id?: string
          role?: string
          sessions_limit?: number | null
          sessions_used?: number | null
          status?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "organization_members_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organization_accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      organization_profiles: {
        Row: {
          admin_user_id: string
          burnout_risk_index: number | null
          city: string | null
          created_at: string | null
          employee_count: number | null
          engagement_score: number | null
          id: string
          industry: string | null
          logo_url: string | null
          name: string
          updated_at: string | null
          wellbeing_score: number | null
        }
        Insert: {
          admin_user_id: string
          burnout_risk_index?: number | null
          city?: string | null
          created_at?: string | null
          employee_count?: number | null
          engagement_score?: number | null
          id?: string
          industry?: string | null
          logo_url?: string | null
          name: string
          updated_at?: string | null
          wellbeing_score?: number | null
        }
        Update: {
          admin_user_id?: string
          burnout_risk_index?: number | null
          city?: string | null
          created_at?: string | null
          employee_count?: number | null
          engagement_score?: number | null
          id?: string
          industry?: string | null
          logo_url?: string | null
          name?: string
          updated_at?: string | null
          wellbeing_score?: number | null
        }
        Relationships: []
      }
      payment_payouts: {
        Row: {
          commission_mad: number
          created_at: string
          gross_mad: number
          id: string
          net_mad: number
          notes: string | null
          paid_at: string | null
          payout_method: string | null
          payout_reference: string | null
          period_end: string
          period_start: string
          psychologist_id: string
          status: string
          transaction_count: number
          updated_at: string
          vat_mad: number
        }
        Insert: {
          commission_mad?: number
          created_at?: string
          gross_mad?: number
          id?: string
          net_mad?: number
          notes?: string | null
          paid_at?: string | null
          payout_method?: string | null
          payout_reference?: string | null
          period_end: string
          period_start: string
          psychologist_id: string
          status?: string
          transaction_count?: number
          updated_at?: string
          vat_mad?: number
        }
        Update: {
          commission_mad?: number
          created_at?: string
          gross_mad?: number
          id?: string
          net_mad?: number
          notes?: string | null
          paid_at?: string | null
          payout_method?: string | null
          payout_reference?: string | null
          period_end?: string
          period_start?: string
          psychologist_id?: string
          status?: string
          transaction_count?: number
          updated_at?: string
          vat_mad?: number
        }
        Relationships: []
      }
      payment_transactions: {
        Row: {
          amount_mad: number
          booking_id: string
          commission_mad: number
          created_at: string
          currency: string
          failure_reason: string | null
          id: string
          net_to_psychologist_mad: number
          paid_at: string | null
          patient_id: string
          provider: string
          provider_metadata: Json | null
          provider_payment_id: string | null
          psychologist_id: string
          refunded_at: string | null
          status: string
          transaction_type: string
          updated_at: string
          vat_mad: number
        }
        Insert: {
          amount_mad: number
          booking_id: string
          commission_mad?: number
          created_at?: string
          currency?: string
          failure_reason?: string | null
          id?: string
          net_to_psychologist_mad?: number
          paid_at?: string | null
          patient_id: string
          provider?: string
          provider_metadata?: Json | null
          provider_payment_id?: string | null
          psychologist_id: string
          refunded_at?: string | null
          status?: string
          transaction_type: string
          updated_at?: string
          vat_mad?: number
        }
        Update: {
          amount_mad?: number
          booking_id?: string
          commission_mad?: number
          created_at?: string
          currency?: string
          failure_reason?: string | null
          id?: string
          net_to_psychologist_mad?: number
          paid_at?: string | null
          patient_id?: string
          provider?: string
          provider_metadata?: Json | null
          provider_payment_id?: string | null
          psychologist_id?: string
          refunded_at?: string | null
          status?: string
          transaction_type?: string
          updated_at?: string
          vat_mad?: number
        }
        Relationships: []
      }
      platform_pricing_config: {
        Row: {
          commission_rate: number
          created_at: string
          currency: string
          deposit_percentage: number
          id: string
          is_active: boolean
          max_session_price_mad: number
          min_session_price_mad: number
          notes: string | null
          updated_at: string
          updated_by: string | null
          vat_rate: number
        }
        Insert: {
          commission_rate?: number
          created_at?: string
          currency?: string
          deposit_percentage?: number
          id?: string
          is_active?: boolean
          max_session_price_mad?: number
          min_session_price_mad?: number
          notes?: string | null
          updated_at?: string
          updated_by?: string | null
          vat_rate?: number
        }
        Update: {
          commission_rate?: number
          created_at?: string
          currency?: string
          deposit_percentage?: number
          id?: string
          is_active?: boolean
          max_session_price_mad?: number
          min_session_price_mad?: number
          notes?: string | null
          updated_at?: string
          updated_by?: string | null
          vat_rate?: number
        }
        Relationships: []
      }
      platform_pricing_history: {
        Row: {
          change_reason: string | null
          changed_at: string
          changed_by: string | null
          commission_rate: number
          config_id: string
          currency: string
          deposit_percentage: number
          id: string
          max_session_price_mad: number
          min_session_price_mad: number
          vat_rate: number
        }
        Insert: {
          change_reason?: string | null
          changed_at?: string
          changed_by?: string | null
          commission_rate: number
          config_id: string
          currency: string
          deposit_percentage: number
          id?: string
          max_session_price_mad: number
          min_session_price_mad: number
          vat_rate: number
        }
        Update: {
          change_reason?: string | null
          changed_at?: string
          changed_by?: string | null
          commission_rate?: number
          config_id?: string
          currency?: string
          deposit_percentage?: number
          id?: string
          max_session_price_mad?: number
          min_session_price_mad?: number
          vat_rate?: number
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          city: string | null
          created_at: string | null
          date_of_birth: string | null
          full_name: string | null
          id: string
          is_suspended: boolean
          phone: string | null
          suspended_at: string | null
          suspended_reason: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          city?: string | null
          created_at?: string | null
          date_of_birth?: string | null
          full_name?: string | null
          id: string
          is_suspended?: boolean
          phone?: string | null
          suspended_at?: string | null
          suspended_reason?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          city?: string | null
          created_at?: string | null
          date_of_birth?: string | null
          full_name?: string | null
          id?: string
          is_suspended?: boolean
          phone?: string | null
          suspended_at?: string | null
          suspended_reason?: string | null
          updated_at?: string | null
        }
        Relationships: []
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
      provisioning_attempts: {
        Row: {
          admin_user_id: string | null
          already_provisioned: boolean
          application_id: string
          created_at: string
          duration_ms: number | null
          error_code: string | null
          error_message: string | null
          id: string
          reused_existing_user: boolean
          status: string
          steps: Json
          user_id: string | null
        }
        Insert: {
          admin_user_id?: string | null
          already_provisioned?: boolean
          application_id: string
          created_at?: string
          duration_ms?: number | null
          error_code?: string | null
          error_message?: string | null
          id?: string
          reused_existing_user?: boolean
          status: string
          steps?: Json
          user_id?: string | null
        }
        Update: {
          admin_user_id?: string | null
          already_provisioned?: boolean
          application_id?: string
          created_at?: string
          duration_ms?: number | null
          error_code?: string | null
          error_message?: string | null
          id?: string
          reused_existing_user?: boolean
          status?: string
          steps?: Json
          user_id?: string | null
        }
        Relationships: []
      }
      psychologist_applications: {
        Row: {
          accreditation_level: string
          accreditation_number: string | null
          auto_check_flags: Json | null
          auto_check_status: string | null
          auto_checked_at: string | null
          bio_long: string | null
          bio_short: string | null
          city: string | null
          country: string | null
          created_at: string | null
          date_of_birth: string | null
          desired_hourly_rate_mad: number | null
          doc_auto_entrepreneur_url: string | null
          doc_cin_url: string | null
          doc_cv_url: string | null
          doc_diploma_url: string | null
          doc_insurance_url: string | null
          doc_license_morocco_url: string | null
          doc_order_registration_url: string | null
          doc_rib_url: string | null
          doc_specialty_certs_urls: string[] | null
          document_urls: string[] | null
          email: string
          full_name: string
          gender: string | null
          id: string
          intro_video_url: string | null
          languages: string[] | null
          notes: string | null
          offers_in_person: boolean | null
          offers_online: boolean | null
          phone: string | null
          photo_url: string | null
          populations_served: string[] | null
          preferred_locale: string
          qualifications: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          revision_notes: string | null
          revision_requested_at: string | null
          specialties_requested: string[] | null
          status: string
          submitted_at: string | null
          suggested_level: string | null
          therapy_approaches_requested: string[] | null
          updated_at: string | null
          user_id: string | null
          years_experience: number | null
        }
        Insert: {
          accreditation_level?: string
          accreditation_number?: string | null
          auto_check_flags?: Json | null
          auto_check_status?: string | null
          auto_checked_at?: string | null
          bio_long?: string | null
          bio_short?: string | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          date_of_birth?: string | null
          desired_hourly_rate_mad?: number | null
          doc_auto_entrepreneur_url?: string | null
          doc_cin_url?: string | null
          doc_cv_url?: string | null
          doc_diploma_url?: string | null
          doc_insurance_url?: string | null
          doc_license_morocco_url?: string | null
          doc_order_registration_url?: string | null
          doc_rib_url?: string | null
          doc_specialty_certs_urls?: string[] | null
          document_urls?: string[] | null
          email: string
          full_name: string
          gender?: string | null
          id?: string
          intro_video_url?: string | null
          languages?: string[] | null
          notes?: string | null
          offers_in_person?: boolean | null
          offers_online?: boolean | null
          phone?: string | null
          photo_url?: string | null
          populations_served?: string[] | null
          preferred_locale?: string
          qualifications?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          revision_notes?: string | null
          revision_requested_at?: string | null
          specialties_requested?: string[] | null
          status?: string
          submitted_at?: string | null
          suggested_level?: string | null
          therapy_approaches_requested?: string[] | null
          updated_at?: string | null
          user_id?: string | null
          years_experience?: number | null
        }
        Update: {
          accreditation_level?: string
          accreditation_number?: string | null
          auto_check_flags?: Json | null
          auto_check_status?: string | null
          auto_checked_at?: string | null
          bio_long?: string | null
          bio_short?: string | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          date_of_birth?: string | null
          desired_hourly_rate_mad?: number | null
          doc_auto_entrepreneur_url?: string | null
          doc_cin_url?: string | null
          doc_cv_url?: string | null
          doc_diploma_url?: string | null
          doc_insurance_url?: string | null
          doc_license_morocco_url?: string | null
          doc_order_registration_url?: string | null
          doc_rib_url?: string | null
          doc_specialty_certs_urls?: string[] | null
          document_urls?: string[] | null
          email?: string
          full_name?: string
          gender?: string | null
          id?: string
          intro_video_url?: string | null
          languages?: string[] | null
          notes?: string | null
          offers_in_person?: boolean | null
          offers_online?: boolean | null
          phone?: string | null
          photo_url?: string | null
          populations_served?: string[] | null
          preferred_locale?: string
          qualifications?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          revision_notes?: string | null
          revision_requested_at?: string | null
          specialties_requested?: string[] | null
          status?: string
          submitted_at?: string | null
          suggested_level?: string | null
          therapy_approaches_requested?: string[] | null
          updated_at?: string | null
          user_id?: string | null
          years_experience?: number | null
        }
        Relationships: []
      }
      psychologist_encryption_keys: {
        Row: {
          created_at: string
          id: string
          psychologist_id: string
          rotated_at: string | null
          vault_secret_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          psychologist_id: string
          rotated_at?: string | null
          vault_secret_id: string
        }
        Update: {
          created_at?: string
          id?: string
          psychologist_id?: string
          rotated_at?: string | null
          vault_secret_id?: string
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
          accreditation_level: string | null
          bio: string | null
          calendly_url: string | null
          city: string | null
          created_at: string | null
          deposit_percentage: number
          full_name: string
          gender: string | null
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
          accreditation_level?: string | null
          bio?: string | null
          calendly_url?: string | null
          city?: string | null
          created_at?: string | null
          deposit_percentage?: number
          full_name: string
          gender?: string | null
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
          accreditation_level?: string | null
          bio?: string | null
          calendly_url?: string | null
          city?: string | null
          created_at?: string | null
          deposit_percentage?: number
          full_name?: string
          gender?: string | null
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
      psychologist_therapy_approaches: {
        Row: {
          psychologist_id: string
          therapy_approach_id: string
        }
        Insert: {
          psychologist_id: string
          therapy_approach_id: string
        }
        Update: {
          psychologist_id?: string
          therapy_approach_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "psychologist_therapy_approaches_psychologist_id_fkey"
            columns: ["psychologist_id"]
            isOneToOne: false
            referencedRelation: "psychologist_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "psychologist_therapy_approaches_therapy_approach_id_fkey"
            columns: ["therapy_approach_id"]
            isOneToOne: false
            referencedRelation: "therapy_approaches"
            referencedColumns: ["id"]
          },
        ]
      }
      referrals: {
        Row: {
          code: string
          created_at: string
          id: string
          referee_email: string | null
          referee_user_id: string | null
          referrer_id: string
          reward_granted_at: string | null
          status: string
          updated_at: string
        }
        Insert: {
          code: string
          created_at?: string
          id?: string
          referee_email?: string | null
          referee_user_id?: string | null
          referrer_id: string
          reward_granted_at?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          code?: string
          created_at?: string
          id?: string
          referee_email?: string | null
          referee_user_id?: string | null
          referrer_id?: string
          reward_granted_at?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      reviews: {
        Row: {
          client_id: string
          comment: string | null
          created_at: string | null
          id: string
          psychologist_id: string
          rating: number
          session_id: string
        }
        Insert: {
          client_id: string
          comment?: string | null
          created_at?: string | null
          id?: string
          psychologist_id: string
          rating: number
          session_id: string
        }
        Update: {
          client_id?: string
          comment?: string | null
          created_at?: string | null
          id?: string
          psychologist_id?: string
          rating?: number
          session_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reviews_psychologist_id_fkey"
            columns: ["psychologist_id"]
            isOneToOne: false
            referencedRelation: "psychologist_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: true
            referencedRelation: "sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      session_events: {
        Row: {
          booking_id: string | null
          created_at: string
          event_type: string
          id: string
          metadata: Json | null
          session_id: string | null
          user_id: string
        }
        Insert: {
          booking_id?: string | null
          created_at?: string
          event_type: string
          id?: string
          metadata?: Json | null
          session_id?: string | null
          user_id: string
        }
        Update: {
          booking_id?: string | null
          created_at?: string
          event_type?: string
          id?: string
          metadata?: Json | null
          session_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "session_events_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "session_events_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings_with_details"
            referencedColumns: ["id"]
          },
        ]
      }
      session_notes: {
        Row: {
          content: string
          created_at: string | null
          encrypted_content: string | null
          encryption_key_id: string | null
          id: string
          is_private: boolean | null
          note_type: string | null
          psychologist_id: string
          session_id: string
          updated_at: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          encrypted_content?: string | null
          encryption_key_id?: string | null
          id?: string
          is_private?: boolean | null
          note_type?: string | null
          psychologist_id: string
          session_id: string
          updated_at?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          encrypted_content?: string | null
          encryption_key_id?: string | null
          id?: string
          is_private?: boolean | null
          note_type?: string | null
          psychologist_id?: string
          session_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "session_notes_psychologist_id_fkey"
            columns: ["psychologist_id"]
            isOneToOne: false
            referencedRelation: "psychologist_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "session_notes_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      sessions: {
        Row: {
          client_id: string
          created_at: string | null
          date_time: string
          duration_minutes: number
          id: string
          notes: string | null
          psychologist_id: string
          session_type: string
          status: string
          updated_at: string | null
          video_room_id: string | null
        }
        Insert: {
          client_id: string
          created_at?: string | null
          date_time: string
          duration_minutes?: number
          id?: string
          notes?: string | null
          psychologist_id: string
          session_type?: string
          status?: string
          updated_at?: string | null
          video_room_id?: string | null
        }
        Update: {
          client_id?: string
          created_at?: string | null
          date_time?: string
          duration_minutes?: number
          id?: string
          notes?: string | null
          psychologist_id?: string
          session_type?: string
          status?: string
          updated_at?: string | null
          video_room_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sessions_psychologist_id_fkey"
            columns: ["psychologist_id"]
            isOneToOne: false
            referencedRelation: "psychologist_profiles"
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
      therapy_approaches: {
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
      translation_overrides: {
        Row: {
          id: string
          locale: string
          translation_key: string
          translation_value: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          id?: string
          locale: string
          translation_key: string
          translation_value: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          id?: string
          locale?: string
          translation_key?: string
          translation_value?: string
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      user_badges: {
        Row: {
          badge_slug: string
          earned_at: string | null
          id: string
          user_id: string
        }
        Insert: {
          badge_slug: string
          earned_at?: string | null
          id?: string
          user_id: string
        }
        Update: {
          badge_slug?: string
          earned_at?: string | null
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_badges_badge_slug_fkey"
            columns: ["badge_slug"]
            isOneToOne: false
            referencedRelation: "gamification_badges"
            referencedColumns: ["slug"]
          },
        ]
      }
      user_progress: {
        Row: {
          created_at: string | null
          last_activity_at: string | null
          streak_best: number
          streak_days: number
          updated_at: string | null
          user_id: string
          xp_this_week: number
          xp_total: number
        }
        Insert: {
          created_at?: string | null
          last_activity_at?: string | null
          streak_best?: number
          streak_days?: number
          updated_at?: string | null
          user_id: string
          xp_this_week?: number
          xp_total?: number
        }
        Update: {
          created_at?: string | null
          last_activity_at?: string | null
          streak_best?: number
          streak_days?: number
          updated_at?: string | null
          user_id?: string
          xp_this_week?: number
          xp_total?: number
        }
        Relationships: []
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
      wellness_programs: {
        Row: {
          created_at: string | null
          description: string | null
          duration_weeks: number | null
          id: string
          is_active: boolean | null
          org_id: string
          program_type: string
          psychologist_id: string | null
          sessions_included: number | null
          title: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          duration_weeks?: number | null
          id?: string
          is_active?: boolean | null
          org_id: string
          program_type?: string
          psychologist_id?: string | null
          sessions_included?: number | null
          title: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          duration_weeks?: number | null
          id?: string
          is_active?: boolean | null
          org_id?: string
          program_type?: string
          psychologist_id?: string | null
          sessions_included?: number | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "wellness_programs_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organization_accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wellness_programs_psychologist_id_fkey"
            columns: ["psychologist_id"]
            isOneToOne: false
            referencedRelation: "psychologist_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      admin_platform_stats: {
        Row: {
          accredited_psychologists: number | null
          active_psychologists: number | null
          bookings_last_30d: number | null
          completed_sessions: number | null
          new_users_last_30d: number | null
          pending_bookings: number | null
          total_bookings: number | null
          total_gross_revenue_mad: number | null
          total_platform_revenue_mad: number | null
          total_users: number | null
          upcoming_sessions: number | null
        }
        Relationships: []
      }
      bookings_with_details: {
        Row: {
          amount_mad: number | null
          created_at: string | null
          duration_minutes: number | null
          id: string | null
          patient_id: string | null
          patient_name: string | null
          patient_notes: string | null
          payment_status: string | null
          psychologist_id: string | null
          psychologist_name: string | null
          scheduled_at: string | null
          session_type: string | null
          status: string | null
          updated_at: string | null
          video_room_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bookings_psychologist_id_fkey"
            columns: ["psychologist_id"]
            isOneToOne: false
            referencedRelation: "psychologist_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      org_usage_summary: {
        Row: {
          active_members: number | null
          avg_sessions_per_member: number | null
          org_id: string | null
          pending_invites: number | null
          sessions_completed: number | null
          sessions_this_month: number | null
          total_sessions_booked: number | null
        }
        Relationships: [
          {
            foreignKeyName: "organization_members_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organization_accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      public_review_ratings: {
        Row: {
          created_at: string | null
          psychologist_id: string | null
          rating: number | null
        }
        Insert: {
          created_at?: string | null
          psychologist_id?: string | null
          rating?: number | null
        }
        Update: {
          created_at?: string | null
          psychologist_id?: string | null
          rating?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "reviews_psychologist_id_fkey"
            columns: ["psychologist_id"]
            isOneToOne: false
            referencedRelation: "psychologist_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      admin_assign_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: Json
      }
      admin_cancel_booking: {
        Args: { _booking_id: string; _reason?: string }
        Returns: Json
      }
      admin_delete_profile: { Args: { _user_id: string }; Returns: Json }
      admin_force_signout: { Args: { _user_id: string }; Returns: Json }
      admin_hide_review: {
        Args: { _reason?: string; _review_id: string }
        Returns: Json
      }
      admin_list_users: {
        Args: { _limit?: number; _search?: string }
        Returns: {
          avatar_url: string
          city: string
          created_at: string
          full_name: string
          id: string
          is_suspended: boolean
          phone: string
          roles: string[]
        }[]
      }
      admin_list_users_rich: {
        Args: { _limit?: number; _search?: string }
        Returns: {
          avatar_url: string
          city: string
          created_at: string
          email: string
          email_confirmed_at: string
          full_name: string
          id: string
          is_suspended: boolean
          last_sign_in_at: string
          phone: string
          roles: string[]
          suspended_reason: string
        }[]
      }
      admin_log_password_reset: {
        Args: { _email: string; _user_id: string }
        Returns: Json
      }
      admin_refund_booking: {
        Args: { _booking_id: string; _reason?: string }
        Returns: Json
      }
      admin_revoke_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: Json
      }
      admin_set_user_suspended: {
        Args: { _reason?: string; _suspended: boolean; _user_id: string }
        Returns: Json
      }
      admin_update_booking_status: {
        Args: { _booking_id: string; _new_status: string }
        Returns: Json
      }
      admin_user_activity: { Args: { _user_id: string }; Returns: Json }
      check_and_increment_rate_limit: {
        Args: { _key: string; _max: number; _window_seconds: number }
        Returns: boolean
      }
      check_proposal_slot: {
        Args: { _duration: number; _psy: string; _start: string }
        Returns: Json
      }
      compute_mps: { Args: { _user_id: string }; Returns: Json }
      create_admin_user: {
        Args: { _email: string; _password: string }
        Returns: Json
      }
      generate_referral_code: { Args: never; Returns: string }
      generate_slug: { Args: { id: string; name: string }; Returns: string }
      get_available_slots: {
        Args: { p_date: string; p_psychologist_id: string }
        Returns: {
          is_available: boolean
          slot_start: string
        }[]
      }
      get_booking_by_token: {
        Args: { _token: string }
        Returns: {
          duration_minutes: number
          id: string
          patient_notes: string
          proposal_expires_at: string
          psychologist_id: string
          scheduled_at: string
          session_type: string
          status: string
        }[]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      inspect_provisioning_state: {
        Args: { _application_id: string }
        Returns: Json
      }
      invite_org_member: {
        Args: {
          p_email: string
          p_name?: string
          p_org_id: string
          p_role?: string
          p_sessions_limit?: number
        }
        Returns: string
      }
      org_pulse_aggregate: {
        Args: { _org_id: string; _survey_id?: string }
        Returns: Json
      }
      replace_availability_for_day: {
        Args: { _day: number; _ranges: Json }
        Returns: undefined
      }
      resolve_referral_code: {
        Args: { _code: string }
        Returns: {
          code: string
          referrer_id: string
          status: string
        }[]
      }
      respond_to_proposal: {
        Args: { _action: string; _reason?: string; _token: string }
        Returns: Json
      }
      search_psychologists:
        | {
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
        | {
            Args: {
              p_availability?: string
              p_city?: string
              p_gender?: string
              p_in_person?: boolean
              p_languages?: string[]
              p_max_price?: number
              p_min_price?: number
              p_online?: boolean
              p_page?: number
              p_page_size?: number
              p_specialties?: string[]
              p_therapy_approaches?: string[]
            }
            Returns: {
              bio: string
              calendly_url: string
              city: string
              created_at: string
              full_name: string
              gender: string
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
      app_role:
        | "admin"
        | "psychologist"
        | "user"
        | "athlete"
        | "coach"
        | "organization"
      certificate_type:
        | "course_completion"
        | "assessment_completion"
        | "psychologist_accreditation"
        | "mooc_training"
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
      app_role: [
        "admin",
        "psychologist",
        "user",
        "athlete",
        "coach",
        "organization",
      ],
      certificate_type: [
        "course_completion",
        "assessment_completion",
        "psychologist_accreditation",
        "mooc_training",
      ],
    },
  },
} as const
