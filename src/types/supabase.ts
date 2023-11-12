export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  graphql_public: {
    Tables: {
      [_ in never]: never;
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      graphql: {
        Args: {
          operationName?: string;
          query?: string;
          variables?: Json;
          extensions?: Json;
        };
        Returns: Json;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
  public: {
    Tables: {
      tb_accesses: {
        Row: {
          created_at: string;
          id: string;
          name: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          name: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          name?: string;
        };
        Relationships: [];
      };
      tb_addresses: {
        Row: {
          attended_id: string;
          city_id: string;
          complement: string | null;
          created_at: string;
          id: string;
          neighborhood: string;
          number: string;
          street: string;
          zip_code: string;
        };
        Insert: {
          attended_id: string;
          city_id: string;
          complement?: string | null;
          created_at?: string;
          id?: string;
          neighborhood: string;
          number: string;
          street: string;
          zip_code: string;
        };
        Update: {
          attended_id?: string;
          city_id?: string;
          complement?: string | null;
          created_at?: string;
          id?: string;
          neighborhood?: string;
          number?: string;
          street?: string;
          zip_code?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'tb_addresses_attended_id_fkey';
            columns: ['attended_id'];
            referencedRelation: 'tb_attendeds';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'tb_addresses_city_id_fkey';
            columns: ['city_id'];
            referencedRelation: 'tb_cities';
            referencedColumns: ['id'];
          }
        ];
      };
      tb_appointment_referrals: {
        Row: {
          appointment_id: string;
          created_at: string;
          destination: string;
          id: string;
          type: string;
        };
        Insert: {
          appointment_id: string;
          created_at?: string;
          destination: string;
          id?: string;
          type: string;
        };
        Update: {
          appointment_id?: string;
          created_at?: string;
          destination?: string;
          id?: string;
          type?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'tb_appointment_referrals_appointment_id_fkey';
            columns: ['appointment_id'];
            referencedRelation: 'tb_appointments';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'tb_appointment_referrals_destination_fkey';
            columns: ['destination'];
            referencedRelation: 'tb_referral_destinations';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'tb_appointment_referrals_type_fkey';
            columns: ['type'];
            referencedRelation: 'tb_referral_types';
            referencedColumns: ['id'];
          }
        ];
      };
      tb_appointments: {
        Row: {
          access_id: string;
          created_at: string;
          date: string;
          facility_id: string;
          general_demand_id: string;
          has_leave_of_absence: boolean;
          id: string;
          modality_id: string;
          procedure_id: string;
          protocol: string | null;
          record_progress: string;
          registered_by: string | null;
          time: string;
          psychological_assessment_id: string | null;
          service_id: string;
          social_assessment_id: string | null;
        };
        Insert: {
          access_id: string;
          created_at?: string;
          date: string;
          facility_id: string;
          general_demand_id: string;
          has_leave_of_absence: boolean;
          id?: string;
          modality_id: string;
          procedure_id: string;
          protocol?: string | null;
          record_progress: string;
          registered_by?: string | null;
          time: string;
          psychological_assessment_id?: string | null;
          service_id: string;
          social_assessment_id?: string | null;
        };
        Update: {
          access_id?: string;
          created_at?: string;
          date?: string;
          facility_id?: string;
          general_demand_id?: string;
          has_leave_of_absence?: boolean;
          id?: string;
          modality_id?: string;
          procedure_id?: string;
          protocol?: string | null;
          record_progress?: string;
          registered_by?: string | null;
          time?: string;
          psychological_assessment_id?: string | null;
          service_id?: string;
          social_assessment_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'tb_appointments_access_id_fkey';
            columns: ['access_id'];
            referencedRelation: 'tb_accesses';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'tb_appointments_facility_id_fkey';
            columns: ['facility_id'];
            referencedRelation: 'tb_opms';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'tb_appointments_general_demand_id_fkey';
            columns: ['general_demand_id'];
            referencedRelation: 'tb_general_demands';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'tb_appointments_modality_id_fkey';
            columns: ['modality_id'];
            referencedRelation: 'tb_modalities';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'tb_appointments_procedure_id_fkey';
            columns: ['procedure_id'];
            referencedRelation: 'tb_procedures';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'tb_appointments_registered_by_fkey';
            columns: ['registered_by'];
            referencedRelation: 'tb_users';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'tb_appointments_type_of_psychological_assessment_id_fkey';
            columns: ['type_of_psychological_assessment_id'];
            referencedRelation: 'tb_psychological_assessments';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'tb_appointments_type_of_service_id_fkey';
            columns: ['type_of_service_id'];
            referencedRelation: 'tb_services';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'tb_appointments_type_of_social_assessment_id_fkey';
            columns: ['type_of_social_assessment_id'];
            referencedRelation: 'tb_social_assessments';
            referencedColumns: ['id'];
          }
        ];
      };
      tb_appointments_attendeds: {
        Row: {
          appointment_id: string;
          attended_id: string;
          created_at: string;
        };
        Insert: {
          appointment_id: string;
          attended_id: string;
          created_at?: string;
        };
        Update: {
          appointment_id?: string;
          attended_id?: string;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'tb_appointments_attendeds_appointment_id_fkey';
            columns: ['appointment_id'];
            referencedRelation: 'tb_appointments';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'tb_appointments_attendeds_attended_id_fkey';
            columns: ['attended_id'];
            referencedRelation: 'tb_attendeds';
            referencedColumns: ['id'];
          }
        ];
      };
      tb_appointments_documents: {
        Row: {
          appointment_id: string;
          created_at: string;
          document_id: string;
        };
        Insert: {
          appointment_id: string;
          created_at?: string;
          document_id: string;
        };
        Update: {
          appointment_id?: string;
          created_at?: string;
          document_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'tb_appointments_documents_appointment_id_fkey';
            columns: ['appointment_id'];
            referencedRelation: 'tb_appointments';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'tb_appointments_documents_document_id_fkey';
            columns: ['document_id'];
            referencedRelation: 'tb_documents';
            referencedColumns: ['id'];
          }
        ];
      };
      tb_appointments_specialists: {
        Row: {
          appointment_id: string;
          created_at: string;
          specialist_id: string;
        };
        Insert: {
          appointment_id: string;
          created_at?: string;
          specialist_id: string;
        };
        Update: {
          appointment_id?: string;
          created_at?: string;
          specialist_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'tb_appointments_specialists_appointment_id_fkey';
            columns: ['appointment_id'];
            referencedRelation: 'tb_appointments';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'tb_appointments_specialists_specialist_id_fkey';
            columns: ['specialist_id'];
            referencedRelation: 'tb_users';
            referencedColumns: ['id'];
          }
        ];
      };
      tb_appointments_specific_demands: {
        Row: {
          appointment_id: string;
          created_at: string;
          specific_demand_id: string;
        };
        Insert: {
          appointment_id: string;
          created_at?: string;
          specific_demand_id: string;
        };
        Update: {
          appointment_id?: string;
          created_at?: string;
          specific_demand_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'tb_appointments_specific_demands_appointment_id_fkey';
            columns: ['appointment_id'];
            referencedRelation: 'tb_appointments';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'tb_appointments_specific_demands_specific_demand_id_fkey';
            columns: ['specific_demand_id'];
            referencedRelation: 'tb_specific_demands';
            referencedColumns: ['id'];
          }
        ];
      };
      tb_appointments_travels: {
        Row: {
          appointment_id: string;
          created_at: string;
          travel_id: string;
        };
        Insert: {
          appointment_id: string;
          created_at?: string;
          travel_id: string;
        };
        Update: {
          appointment_id?: string;
          created_at?: string;
          travel_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'tb_appointments_travels_appointment_id_fkey';
            columns: ['appointment_id'];
            referencedRelation: 'tb_appointments';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'tb_appointments_travels_travel_id_fkey';
            columns: ['travel_id'];
            referencedRelation: 'tb_travels';
            referencedColumns: ['id'];
          }
        ];
      };
      tb_attendeds: {
        Row: {
          avatar: string | null;
          birth_date: string | null;
          cadre_id: string | null;
          cpf: string;
          created_at: string;
          familiar_bond_id: string | null;
          fullname: string;
          gender_id: string;
          id: string;
          is_civil_volunteer: boolean;
          marital_status_id: string | null;
          nickname: string | null;
          opm_id: string | null;
          policy_holder_id: string | null;
          rank_id: string | null;
          registered_by: string | null;
          rg: string | null;
          work_status_id: string | null;
        };
        Insert: {
          avatar?: string | null;
          birth_date?: string | null;
          cadre_id?: string | null;
          cpf: string;
          created_at?: string;
          familiar_bond_id?: string | null;
          fullname: string;
          gender_id: string;
          id?: string;
          is_civil_volunteer?: boolean;
          marital_status_id?: string | null;
          nickname?: string | null;
          opm_id?: string | null;
          policy_holder_id?: string | null;
          rank_id?: string | null;
          registered_by?: string | null;
          rg?: string | null;
          work_status_id?: string | null;
        };
        Update: {
          avatar?: string | null;
          birth_date?: string | null;
          cadre_id?: string | null;
          cpf?: string;
          created_at?: string;
          familiar_bond_id?: string | null;
          fullname?: string;
          gender_id?: string;
          id?: string;
          is_civil_volunteer?: boolean;
          marital_status_id?: string | null;
          nickname?: string | null;
          opm_id?: string | null;
          policy_holder_id?: string | null;
          rank_id?: string | null;
          registered_by?: string | null;
          rg?: string | null;
          work_status_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'tb_attendeds_cadre_id_fkey';
            columns: ['cadre_id'];
            referencedRelation: 'tb_cadres';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'tb_attendeds_familiar_bond_id_fkey';
            columns: ['familiar_bond_id'];
            referencedRelation: 'tb_familiar_bonds';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'tb_attendeds_gender_id_fkey';
            columns: ['gender_id'];
            referencedRelation: 'tb_genders';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'tb_attendeds_marital_status_id_fkey';
            columns: ['marital_status_id'];
            referencedRelation: 'tb_marital_status';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'tb_attendeds_opm_id_fkey';
            columns: ['opm_id'];
            referencedRelation: 'tb_opms';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'tb_attendeds_policy_holder_id_fkey';
            columns: ['policy_holder_id'];
            referencedRelation: 'tb_attendeds';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'tb_attendeds_rank_id_fkey';
            columns: ['rank_id'];
            referencedRelation: 'tb_ranks';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'tb_attendeds_work_status_id_fkey';
            columns: ['work_status_id'];
            referencedRelation: 'tb_work_status';
            referencedColumns: ['id'];
          }
        ];
      };
      tb_cadres: {
        Row: {
          created_at: string;
          id: string;
          name: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          name: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          name?: string;
        };
        Relationships: [];
      };
      tb_cities: {
        Row: {
          created_at: string;
          id: string;
          name: string;
          state_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          name: string;
          state_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          name?: string;
          state_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'tb_cities_state_id_fkey';
            columns: ['state_id'];
            referencedRelation: 'tb_states';
            referencedColumns: ['id'];
          }
        ];
      };
      tb_cmds: {
        Row: {
          created_at: string;
          id: string;
          name: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          name: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          name?: string;
        };
        Relationships: [];
      };
      tb_documents: {
        Row: {
          created_at: string;
          id: string;
          name: string;
          order: number;
        };
        Insert: {
          created_at?: string;
          id?: string;
          name: string;
          order: number;
        };
        Update: {
          created_at?: string;
          id?: string;
          name?: string;
          order?: number;
        };
        Relationships: [];
      };
      tb_familiar_bonds: {
        Row: {
          created_at: string;
          id: string;
          name: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          name: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          name?: string;
        };
        Relationships: [];
      };
      tb_genders: {
        Row: {
          created_at: string;
          id: string;
          name: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          name: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          name?: string;
        };
        Relationships: [];
      };
      tb_general_demands: {
        Row: {
          created_at: string;
          id: string;
          name: string;
          order: number;
        };
        Insert: {
          created_at?: string;
          id?: string;
          name: string;
          order: number;
        };
        Update: {
          created_at?: string;
          id?: string;
          name?: string;
          order?: number;
        };
        Relationships: [];
      };
      tb_marital_status: {
        Row: {
          created_at: string;
          id: string;
          name: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          name: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          name?: string;
        };
        Relationships: [];
      };
      tb_modalities: {
        Row: {
          created_at: string;
          id: string;
          name: string;
          order: number;
        };
        Insert: {
          created_at?: string;
          id?: string;
          name: string;
          order: number;
        };
        Update: {
          created_at?: string;
          id?: string;
          name?: string;
          order?: number;
        };
        Relationships: [];
      };
      tb_opms: {
        Row: {
          cdm_id: string;
          created_at: string;
          id: string;
          name: string;
        };
        Insert: {
          cdm_id: string;
          created_at?: string;
          id?: string;
          name: string;
        };
        Update: {
          cdm_id?: string;
          created_at?: string;
          id?: string;
          name?: string;
        };
        Relationships: [];
      };
      tb_phones: {
        Row: {
          attended_id: string;
          bond: string | null;
          created_at: string;
          id: string;
          owner_identification: string;
          phone: string;
        };
        Insert: {
          attended_id: string;
          bond?: string | null;
          created_at?: string;
          id?: string;
          owner_identification: string;
          phone: string;
        };
        Update: {
          attended_id?: string;
          bond?: string | null;
          created_at?: string;
          id?: string;
          owner_identification?: string;
          phone?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'tb_phones_attended_id_fkey';
            columns: ['attended_id'];
            referencedRelation: 'tb_attendeds';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'tb_phones_bond_fkey';
            columns: ['bond'];
            referencedRelation: 'tb_familiar_bonds';
            referencedColumns: ['id'];
          }
        ];
      };
      tb_procedures: {
        Row: {
          created_at: string;
          id: string;
          name: string;
          order: number;
        };
        Insert: {
          created_at?: string;
          id?: string;
          name: string;
          order: number;
        };
        Update: {
          created_at?: string;
          id?: string;
          name?: string;
          order?: number;
        };
        Relationships: [];
      };
      tb_psychological_assessments: {
        Row: {
          created_at: string;
          id: string;
          name: string;
          order: number;
        };
        Insert: {
          created_at?: string;
          id?: string;
          name: string;
          order: number;
        };
        Update: {
          created_at?: string;
          id?: string;
          name?: string;
          order?: number;
        };
        Relationships: [];
      };
      tb_ranks: {
        Row: {
          created_at: string;
          id: string;
          name: string;
          order: number;
        };
        Insert: {
          created_at?: string;
          id?: string;
          name: string;
          order: number;
        };
        Update: {
          created_at?: string;
          id?: string;
          name?: string;
          order?: number;
        };
        Relationships: [];
      };
      tb_referral_destinations: {
        Row: {
          created_at: string;
          id: string;
          name: string;
          order: number;
        };
        Insert: {
          created_at?: string;
          id?: string;
          name: string;
          order: number;
        };
        Update: {
          created_at?: string;
          id?: string;
          name?: string;
          order?: number;
        };
        Relationships: [];
      };
      tb_referral_types: {
        Row: {
          created_at: string;
          id: string;
          name: string;
          order: number;
        };
        Insert: {
          created_at?: string;
          id?: string;
          name: string;
          order: number;
        };
        Update: {
          created_at?: string;
          id?: string;
          name?: string;
          order?: number;
        };
        Relationships: [];
      };
      tb_services: {
        Row: {
          created_at: string;
          id: string;
          name: string;
          order: number;
        };
        Insert: {
          created_at?: string;
          id?: string;
          name: string;
          order: number;
        };
        Update: {
          created_at?: string;
          id?: string;
          name?: string;
          order?: number;
        };
        Relationships: [];
      };
      tb_social_assessments: {
        Row: {
          created_at: string;
          id: string;
          name: string;
          order: number;
        };
        Insert: {
          created_at?: string;
          id?: string;
          name: string;
          order: number;
        };
        Update: {
          created_at?: string;
          id?: string;
          name?: string;
          order?: number;
        };
        Relationships: [];
      };
      tb_specific_demands: {
        Row: {
          created_at: string;
          id: string;
          name: string;
          order: number;
        };
        Insert: {
          created_at?: string;
          id?: string;
          name: string;
          order: number;
        };
        Update: {
          created_at?: string;
          id?: string;
          name?: string;
          order?: number;
        };
        Relationships: [];
      };
      tb_states: {
        Row: {
          acronym: string;
          created_at: string;
          id: string;
          name: string;
        };
        Insert: {
          acronym: string;
          created_at?: string;
          id?: string;
          name: string;
        };
        Update: {
          acronym?: string;
          created_at?: string;
          id?: string;
          name?: string;
        };
        Relationships: [];
      };
      tb_travels: {
        Row: {
          created_at: string;
          id: string;
          name: string;
          order: number;
        };
        Insert: {
          created_at?: string;
          id?: string;
          name: string;
          order: number;
        };
        Update: {
          created_at?: string;
          id?: string;
          name?: string;
          order?: number;
        };
        Relationships: [];
      };
      tb_users: {
        Row: {
          avatar: string | null;
          birth_date: string;
          cadre_id: string | null;
          cpf: string;
          created_at: string;
          email: string;
          fullname: string;
          gender_id: string;
          id: string;
          marital_status_id: string;
          nickname: string | null;
          opm_id: string | null;
          password: string | null;
          rank_id: string | null;
          registered_by: string | null;
          rg: string | null;
          work_status: string | null;
        };
        Insert: {
          avatar?: string | null;
          birth_date: string;
          cadre_id?: string | null;
          cpf: string;
          created_at?: string;
          email: string;
          fullname: string;
          gender_id: string;
          id?: string;
          marital_status_id: string;
          nickname?: string | null;
          opm_id?: string | null;
          password?: string | null;
          rank_id?: string | null;
          registered_by?: string | null;
          rg?: string | null;
          work_status?: string | null;
        };
        Update: {
          avatar?: string | null;
          birth_date?: string;
          cadre_id?: string | null;
          cpf?: string;
          created_at?: string;
          email?: string;
          fullname?: string;
          gender_id?: string;
          id?: string;
          marital_status_id?: string;
          nickname?: string | null;
          opm_id?: string | null;
          password?: string | null;
          rank_id?: string | null;
          registered_by?: string | null;
          rg?: string | null;
          work_status?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'tb_users_cadre_id_fkey';
            columns: ['cadre_id'];
            referencedRelation: 'tb_cadres';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'tb_users_gender_id_fkey';
            columns: ['gender_id'];
            referencedRelation: 'tb_genders';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'tb_users_marital_status_id_fkey';
            columns: ['marital_status_id'];
            referencedRelation: 'tb_marital_status';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'tb_users_opm_id_fkey';
            columns: ['opm_id'];
            referencedRelation: 'tb_opms';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'tb_users_rank_id_fkey';
            columns: ['rank_id'];
            referencedRelation: 'tb_ranks';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'tb_users_work_status_fkey';
            columns: ['work_status'];
            referencedRelation: 'tb_work_status';
            referencedColumns: ['id'];
          }
        ];
      };
      tb_work_status: {
        Row: {
          created_at: string;
          id: string;
          name: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          name: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          name?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
  storage: {
    Tables: {
      buckets: {
        Row: {
          allowed_mime_types: string[] | null;
          avif_autodetection: boolean | null;
          created_at: string | null;
          file_size_limit: number | null;
          id: string;
          name: string;
          owner: string | null;
          public: boolean | null;
          updated_at: string | null;
        };
        Insert: {
          allowed_mime_types?: string[] | null;
          avif_autodetection?: boolean | null;
          created_at?: string | null;
          file_size_limit?: number | null;
          id: string;
          name: string;
          owner?: string | null;
          public?: boolean | null;
          updated_at?: string | null;
        };
        Update: {
          allowed_mime_types?: string[] | null;
          avif_autodetection?: boolean | null;
          created_at?: string | null;
          file_size_limit?: number | null;
          id?: string;
          name?: string;
          owner?: string | null;
          public?: boolean | null;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'buckets_owner_fkey';
            columns: ['owner'];
            referencedRelation: 'users';
            referencedColumns: ['id'];
          }
        ];
      };
      migrations: {
        Row: {
          executed_at: string | null;
          hash: string;
          id: number;
          name: string;
        };
        Insert: {
          executed_at?: string | null;
          hash: string;
          id: number;
          name: string;
        };
        Update: {
          executed_at?: string | null;
          hash?: string;
          id?: number;
          name?: string;
        };
        Relationships: [];
      };
      objects: {
        Row: {
          bucket_id: string | null;
          created_at: string | null;
          id: string;
          last_accessed_at: string | null;
          metadata: Json | null;
          name: string | null;
          owner: string | null;
          path_tokens: string[] | null;
          updated_at: string | null;
          version: string | null;
        };
        Insert: {
          bucket_id?: string | null;
          created_at?: string | null;
          id?: string;
          last_accessed_at?: string | null;
          metadata?: Json | null;
          name?: string | null;
          owner?: string | null;
          path_tokens?: string[] | null;
          updated_at?: string | null;
          version?: string | null;
        };
        Update: {
          bucket_id?: string | null;
          created_at?: string | null;
          id?: string;
          last_accessed_at?: string | null;
          metadata?: Json | null;
          name?: string | null;
          owner?: string | null;
          path_tokens?: string[] | null;
          updated_at?: string | null;
          version?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'objects_bucketId_fkey';
            columns: ['bucket_id'];
            referencedRelation: 'buckets';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'objects_owner_fkey';
            columns: ['owner'];
            referencedRelation: 'users';
            referencedColumns: ['id'];
          }
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      can_insert_object: {
        Args: {
          bucketid: string;
          name: string;
          owner: string;
          metadata: Json;
        };
        Returns: undefined;
      };
      extension: {
        Args: {
          name: string;
        };
        Returns: string;
      };
      filename: {
        Args: {
          name: string;
        };
        Returns: string;
      };
      foldername: {
        Args: {
          name: string;
        };
        Returns: unknown;
      };
      get_size_by_bucket: {
        Args: Record<PropertyKey, never>;
        Returns: {
          size: number;
          bucket_id: string;
        }[];
      };
      search: {
        Args: {
          prefix: string;
          bucketname: string;
          limits?: number;
          levels?: number;
          offsets?: number;
          search?: string;
          sortcolumn?: string;
          sortorder?: string;
        };
        Returns: {
          name: string;
          id: string;
          updated_at: string;
          created_at: string;
          last_accessed_at: string;
          metadata: Json;
        }[];
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
