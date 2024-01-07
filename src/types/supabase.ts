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
          ordenation: number;
        };
        Insert: {
          created_at?: string;
          id?: string;
          name: string;
          ordenation: number;
        };
        Update: {
          created_at?: string;
          id?: string;
          name?: string;
          ordenation?: number;
        };
        Relationships: [];
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
            isOneToOne: false;
            referencedRelation: 'tb_appointments';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'tb_appointment_referrals_destination_fkey';
            columns: ['destination'];
            isOneToOne: false;
            referencedRelation: 'tb_referral_destinations';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'tb_appointment_referrals_type_fkey';
            columns: ['type'];
            isOneToOne: false;
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
          employment_status_id: string | null;
          facility_id: string;
          general_demand_id: string;
          has_leave_of_absence: boolean;
          hospitalization: boolean | null;
          id: string;
          is_signed: boolean;
          modality_id: string;
          procedure_id: string;
          program_id: string | null;
          protocol: string | null;
          psychological_assessment_id: string | null;
          record_progress: string;
          registered_by: string | null;
          service_id: string;
          social_assessment_id: string | null;
          time: string;
        };
        Insert: {
          access_id: string;
          created_at?: string;
          date: string;
          employment_status_id?: string | null;
          facility_id: string;
          general_demand_id: string;
          has_leave_of_absence: boolean;
          hospitalization?: boolean | null;
          id?: string;
          is_signed?: boolean;
          modality_id: string;
          procedure_id: string;
          program_id?: string | null;
          protocol?: string | null;
          psychological_assessment_id?: string | null;
          record_progress: string;
          registered_by?: string | null;
          service_id: string;
          social_assessment_id?: string | null;
          time: string;
        };
        Update: {
          access_id?: string;
          created_at?: string;
          date?: string;
          employment_status_id?: string | null;
          facility_id?: string;
          general_demand_id?: string;
          has_leave_of_absence?: boolean;
          hospitalization?: boolean | null;
          id?: string;
          is_signed?: boolean;
          modality_id?: string;
          procedure_id?: string;
          program_id?: string | null;
          protocol?: string | null;
          psychological_assessment_id?: string | null;
          record_progress?: string;
          registered_by?: string | null;
          service_id?: string;
          social_assessment_id?: string | null;
          time?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'tb_appointments_access_id_fkey';
            columns: ['access_id'];
            isOneToOne: false;
            referencedRelation: 'tb_accesses';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'tb_appointments_employment_status_id_fkey';
            columns: ['employment_status_id'];
            isOneToOne: false;
            referencedRelation: 'tb_employment_status';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'tb_appointments_facility_id_fkey';
            columns: ['facility_id'];
            isOneToOne: false;
            referencedRelation: 'tb_opms';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'tb_appointments_general_demand_id_fkey';
            columns: ['general_demand_id'];
            isOneToOne: false;
            referencedRelation: 'tb_general_demands';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'tb_appointments_modality_id_fkey';
            columns: ['modality_id'];
            isOneToOne: false;
            referencedRelation: 'tb_modalities';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'tb_appointments_procedure_id_fkey';
            columns: ['procedure_id'];
            isOneToOne: false;
            referencedRelation: 'tb_procedures';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'tb_appointments_program_id_fkey';
            columns: ['program_id'];
            isOneToOne: false;
            referencedRelation: 'tb_programs';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'tb_appointments_psychological_assessment_id_fkey';
            columns: ['psychological_assessment_id'];
            isOneToOne: false;
            referencedRelation: 'tb_psychological_assessments';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'tb_appointments_registered_by_fkey';
            columns: ['registered_by'];
            isOneToOne: false;
            referencedRelation: 'tb_users';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'tb_appointments_service_id_fkey';
            columns: ['service_id'];
            isOneToOne: false;
            referencedRelation: 'tb_services';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'tb_appointments_social_assessment_id_fkey';
            columns: ['social_assessment_id'];
            isOneToOne: false;
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
            isOneToOne: false;
            referencedRelation: 'tb_appointments';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'tb_appointments_attendeds_attended_id_fkey';
            columns: ['attended_id'];
            isOneToOne: false;
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
            isOneToOne: false;
            referencedRelation: 'tb_appointments';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'tb_appointments_documents_document_id_fkey';
            columns: ['document_id'];
            isOneToOne: false;
            referencedRelation: 'tb_produced_documents';
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
            isOneToOne: false;
            referencedRelation: 'tb_appointments';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'tb_appointments_specialists_specialist_id_fkey';
            columns: ['specialist_id'];
            isOneToOne: false;
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
            isOneToOne: false;
            referencedRelation: 'tb_appointments';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'tb_appointments_specific_demands_specific_demand_id_fkey';
            columns: ['specific_demand_id'];
            isOneToOne: false;
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
            isOneToOne: false;
            referencedRelation: 'tb_appointments';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'tb_appointments_travels_travel_id_fkey';
            columns: ['travel_id'];
            isOneToOne: false;
            referencedRelation: 'tb_travels';
            referencedColumns: ['id'];
          }
        ];
      };
      tb_attended_addresses: {
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
            foreignKeyName: 'tb_attended_addresses_attended_id_fkey';
            columns: ['attended_id'];
            isOneToOne: false;
            referencedRelation: 'tb_attendeds';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'tb_attended_addresses_city_id_fkey';
            columns: ['city_id'];
            isOneToOne: false;
            referencedRelation: 'tb_cities';
            referencedColumns: ['id'];
          }
        ];
      };
      tb_attended_files: {
        Row: {
          appointment_id: string | null;
          attended_id: string;
          bucket_name: string;
          created_at: string;
          filename: string;
          id: string;
          original_name: string;
          path: string;
          registered_by: string;
          specie_id: string;
          url: string;
        };
        Insert: {
          appointment_id?: string | null;
          attended_id: string;
          bucket_name: string;
          created_at?: string;
          filename: string;
          id?: string;
          original_name: string;
          path: string;
          registered_by: string;
          specie_id: string;
          url: string;
        };
        Update: {
          appointment_id?: string | null;
          attended_id?: string;
          bucket_name?: string;
          created_at?: string;
          filename?: string;
          id?: string;
          original_name?: string;
          path?: string;
          registered_by?: string;
          specie_id?: string;
          url?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'tb_attended_files_appointment_id_fkey';
            columns: ['appointment_id'];
            isOneToOne: false;
            referencedRelation: 'tb_appointments';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'tb_attended_files_attended_id_fkey';
            columns: ['attended_id'];
            isOneToOne: false;
            referencedRelation: 'tb_attendeds';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'tb_attended_files_registered_by_fkey';
            columns: ['registered_by'];
            isOneToOne: false;
            referencedRelation: 'tb_users';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'tb_attended_files_specie_id_fkey';
            columns: ['specie_id'];
            isOneToOne: false;
            referencedRelation: 'tb_document_species';
            referencedColumns: ['id'];
          }
        ];
      };
      tb_attended_phones: {
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
            foreignKeyName: 'tb_attended_phones_attended_id_fkey';
            columns: ['attended_id'];
            isOneToOne: false;
            referencedRelation: 'tb_attendeds';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'tb_attended_phones_bond_fkey';
            columns: ['bond'];
            isOneToOne: false;
            referencedRelation: 'tb_familiar_bonds';
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
            isOneToOne: false;
            referencedRelation: 'tb_cadres';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'tb_attendeds_familiar_bond_id_fkey';
            columns: ['familiar_bond_id'];
            isOneToOne: false;
            referencedRelation: 'tb_familiar_bonds';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'tb_attendeds_gender_id_fkey';
            columns: ['gender_id'];
            isOneToOne: false;
            referencedRelation: 'tb_genders';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'tb_attendeds_marital_status_id_fkey';
            columns: ['marital_status_id'];
            isOneToOne: false;
            referencedRelation: 'tb_marital_status';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'tb_attendeds_opm_id_fkey';
            columns: ['opm_id'];
            isOneToOne: false;
            referencedRelation: 'tb_opms';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'tb_attendeds_policy_holder_id_fkey';
            columns: ['policy_holder_id'];
            isOneToOne: false;
            referencedRelation: 'tb_attendeds';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'tb_attendeds_rank_id_fkey';
            columns: ['rank_id'];
            isOneToOne: false;
            referencedRelation: 'tb_ranks';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'tb_attendeds_work_status_id_fkey';
            columns: ['work_status_id'];
            isOneToOne: false;
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
          ordenation: number;
        };
        Insert: {
          created_at?: string;
          id?: string;
          name: string;
          ordenation: number;
        };
        Update: {
          created_at?: string;
          id?: string;
          name?: string;
          ordenation?: number;
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
            isOneToOne: false;
            referencedRelation: 'tb_states';
            referencedColumns: ['id'];
          }
        ];
      };
      tb_cmds: {
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
      tb_document_species: {
        Row: {
          created_at: string;
          id: string;
          name: string;
          ordenation: number;
        };
        Insert: {
          created_at?: string;
          id?: string;
          name: string;
          ordenation: number;
        };
        Update: {
          created_at?: string;
          id?: string;
          name?: string;
          ordenation?: number;
        };
        Relationships: [];
      };
      tb_employment_status: {
        Row: {
          created_at: string;
          id: string;
          name: string;
          ordenation: number;
        };
        Insert: {
          created_at?: string;
          id?: string;
          name: string;
          ordenation: number;
        };
        Update: {
          created_at?: string;
          id?: string;
          name?: string;
          ordenation?: number;
        };
        Relationships: [];
      };
      tb_familiar_bonds: {
        Row: {
          created_at: string;
          id: string;
          name: string;
          ordenation: number | null;
        };
        Insert: {
          created_at?: string;
          id?: string;
          name: string;
          ordenation?: number | null;
        };
        Update: {
          created_at?: string;
          id?: string;
          name?: string;
          ordenation?: number | null;
        };
        Relationships: [];
      };
      tb_genders: {
        Row: {
          created_at: string;
          id: string;
          name: string;
          ordenation: number;
        };
        Insert: {
          created_at?: string;
          id?: string;
          name: string;
          ordenation: number;
        };
        Update: {
          created_at?: string;
          id?: string;
          name?: string;
          ordenation?: number;
        };
        Relationships: [];
      };
      tb_general_demands: {
        Row: {
          created_at: string;
          id: string;
          name: string;
          ordenation: number;
        };
        Insert: {
          created_at?: string;
          id?: string;
          name: string;
          ordenation: number;
        };
        Update: {
          created_at?: string;
          id?: string;
          name?: string;
          ordenation?: number;
        };
        Relationships: [];
      };
      tb_marital_status: {
        Row: {
          created_at: string;
          id: string;
          name: string;
          ordenation: number;
        };
        Insert: {
          created_at?: string;
          id?: string;
          name: string;
          ordenation: number;
        };
        Update: {
          created_at?: string;
          id?: string;
          name?: string;
          ordenation?: number;
        };
        Relationships: [];
      };
      tb_modalities: {
        Row: {
          created_at: string;
          id: string;
          name: string;
          ordenation: number;
        };
        Insert: {
          created_at?: string;
          id?: string;
          name: string;
          ordenation: number;
        };
        Update: {
          created_at?: string;
          id?: string;
          name?: string;
          ordenation?: number;
        };
        Relationships: [];
      };
      tb_opms: {
        Row: {
          cdm_id: string;
          created_at: string;
          id: string;
          name: string;
          ordenation: number;
        };
        Insert: {
          cdm_id: string;
          created_at?: string;
          id?: string;
          name: string;
          ordenation: number;
        };
        Update: {
          cdm_id?: string;
          created_at?: string;
          id?: string;
          name?: string;
          ordenation?: number;
        };
        Relationships: [];
      };
      tb_permissions: {
        Row: {
          created_at: string;
          id: string;
          name: string;
          role_id: string | null;
        };
        Insert: {
          created_at?: string;
          id?: string;
          name: string;
          role_id?: string | null;
        };
        Update: {
          created_at?: string;
          id?: string;
          name?: string;
          role_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'tb_permissions_role_id_fkey';
            columns: ['role_id'];
            isOneToOne: false;
            referencedRelation: 'tb_roles';
            referencedColumns: ['id'];
          }
        ];
      };
      tb_procedures: {
        Row: {
          created_at: string;
          id: string;
          name: string;
          ordenation: number;
        };
        Insert: {
          created_at?: string;
          id?: string;
          name: string;
          ordenation: number;
        };
        Update: {
          created_at?: string;
          id?: string;
          name?: string;
          ordenation?: number;
        };
        Relationships: [];
      };
      tb_produced_documents: {
        Row: {
          created_at: string;
          id: string;
          name: string;
          ordenation: number;
        };
        Insert: {
          created_at?: string;
          id?: string;
          name: string;
          ordenation: number;
        };
        Update: {
          created_at?: string;
          id?: string;
          name?: string;
          ordenation?: number;
        };
        Relationships: [];
      };
      tb_programs: {
        Row: {
          created_at: string;
          id: string;
          name: string;
          ordenation: number;
        };
        Insert: {
          created_at?: string;
          id?: string;
          name: string;
          ordenation: number;
        };
        Update: {
          created_at?: string;
          id?: string;
          name?: string;
          ordenation?: number;
        };
        Relationships: [];
      };
      tb_psychological_assessments: {
        Row: {
          created_at: string;
          id: string;
          name: string;
          ordenation: number;
        };
        Insert: {
          created_at?: string;
          id?: string;
          name: string;
          ordenation: number;
        };
        Update: {
          created_at?: string;
          id?: string;
          name?: string;
          ordenation?: number;
        };
        Relationships: [];
      };
      tb_ranks: {
        Row: {
          created_at: string;
          id: string;
          name: string;
          ordenation: number;
        };
        Insert: {
          created_at?: string;
          id?: string;
          name: string;
          ordenation: number;
        };
        Update: {
          created_at?: string;
          id?: string;
          name?: string;
          ordenation?: number;
        };
        Relationships: [];
      };
      tb_referral_destinations: {
        Row: {
          created_at: string;
          id: string;
          name: string;
          ordenation: number;
        };
        Insert: {
          created_at?: string;
          id?: string;
          name: string;
          ordenation: number;
        };
        Update: {
          created_at?: string;
          id?: string;
          name?: string;
          ordenation?: number;
        };
        Relationships: [];
      };
      tb_referral_types: {
        Row: {
          created_at: string;
          id: string;
          name: string;
          ordenation: number;
        };
        Insert: {
          created_at?: string;
          id?: string;
          name: string;
          ordenation: number;
        };
        Update: {
          created_at?: string;
          id?: string;
          name?: string;
          ordenation?: number;
        };
        Relationships: [];
      };
      tb_roles: {
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
      tb_services: {
        Row: {
          created_at: string;
          id: string;
          name: string;
          ordenation: number;
        };
        Insert: {
          created_at?: string;
          id?: string;
          name: string;
          ordenation: number;
        };
        Update: {
          created_at?: string;
          id?: string;
          name?: string;
          ordenation?: number;
        };
        Relationships: [];
      };
      tb_social_assessments: {
        Row: {
          created_at: string;
          id: string;
          name: string;
          ordenation: number;
        };
        Insert: {
          created_at?: string;
          id?: string;
          name: string;
          ordenation: number;
        };
        Update: {
          created_at?: string;
          id?: string;
          name?: string;
          ordenation?: number;
        };
        Relationships: [];
      };
      tb_specific_demands: {
        Row: {
          created_at: string;
          id: string;
          name: string;
          ordenation: number;
        };
        Insert: {
          created_at?: string;
          id?: string;
          name: string;
          ordenation: number;
        };
        Update: {
          created_at?: string;
          id?: string;
          name?: string;
          ordenation?: number;
        };
        Relationships: [];
      };
      tb_states: {
        Row: {
          acronym: string;
          created_at: string;
          id: string;
          name: string;
          ordenation: number;
        };
        Insert: {
          acronym: string;
          created_at?: string;
          id?: string;
          name: string;
          ordenation: number;
        };
        Update: {
          acronym?: string;
          created_at?: string;
          id?: string;
          name?: string;
          ordenation?: number;
        };
        Relationships: [];
      };
      tb_travels: {
        Row: {
          created_at: string;
          id: string;
          name: string;
          ordenation: number;
        };
        Insert: {
          created_at?: string;
          id?: string;
          name: string;
          ordenation: number;
        };
        Update: {
          created_at?: string;
          id?: string;
          name?: string;
          ordenation?: number;
        };
        Relationships: [];
      };
      tb_user_files: {
        Row: {
          bucket_name: string;
          created_at: string;
          filename: string;
          id: string;
          original_name: string;
          path: string;
          registered_by: string;
          specie_id: string;
          url: string;
          user_id: string;
        };
        Insert: {
          bucket_name: string;
          created_at?: string;
          filename: string;
          id?: string;
          original_name: string;
          path: string;
          registered_by: string;
          specie_id: string;
          url: string;
          user_id: string;
        };
        Update: {
          bucket_name?: string;
          created_at?: string;
          filename?: string;
          id?: string;
          original_name?: string;
          path?: string;
          registered_by?: string;
          specie_id?: string;
          url?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'tb_user_files_registered_by_fkey';
            columns: ['registered_by'];
            isOneToOne: false;
            referencedRelation: 'tb_users';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'tb_user_files_specie_id_fkey';
            columns: ['specie_id'];
            isOneToOne: false;
            referencedRelation: 'tb_document_species';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'tb_user_files_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          }
        ];
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
          professional_registration: string | null;
          rank_id: string | null;
          registered_by: string | null;
          rg: string | null;
          work_status_id: string | null;
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
          professional_registration?: string | null;
          rank_id?: string | null;
          registered_by?: string | null;
          rg?: string | null;
          work_status_id?: string | null;
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
          professional_registration?: string | null;
          rank_id?: string | null;
          registered_by?: string | null;
          rg?: string | null;
          work_status_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'tb_users_cadre_id_fkey';
            columns: ['cadre_id'];
            isOneToOne: false;
            referencedRelation: 'tb_cadres';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'tb_users_gender_id_fkey';
            columns: ['gender_id'];
            isOneToOne: false;
            referencedRelation: 'tb_genders';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'tb_users_marital_status_id_fkey';
            columns: ['marital_status_id'];
            isOneToOne: false;
            referencedRelation: 'tb_marital_status';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'tb_users_opm_id_fkey';
            columns: ['opm_id'];
            isOneToOne: false;
            referencedRelation: 'tb_opms';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'tb_users_rank_id_fkey';
            columns: ['rank_id'];
            isOneToOne: false;
            referencedRelation: 'tb_ranks';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'tb_users_work_status_id_fkey';
            columns: ['work_status_id'];
            isOneToOne: false;
            referencedRelation: 'tb_work_status';
            referencedColumns: ['id'];
          }
        ];
      };
      tb_users_addresses: {
        Row: {
          city_id: string | null;
          complement: string | null;
          created_at: string;
          id: string;
          neighborhood: string;
          number: string;
          street: string;
          user_id: string;
          zip_code: string;
        };
        Insert: {
          city_id?: string | null;
          complement?: string | null;
          created_at?: string;
          id?: string;
          neighborhood: string;
          number: string;
          street: string;
          user_id: string;
          zip_code: string;
        };
        Update: {
          city_id?: string | null;
          complement?: string | null;
          created_at?: string;
          id?: string;
          neighborhood?: string;
          number?: string;
          street?: string;
          user_id?: string;
          zip_code?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'tb_users_addresses_city_id_fkey';
            columns: ['city_id'];
            isOneToOne: false;
            referencedRelation: 'tb_cities';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'tb_users_addresses_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'tb_users';
            referencedColumns: ['id'];
          }
        ];
      };
      tb_users_phones: {
        Row: {
          bond: string | null;
          created_at: string;
          id: string;
          owner_identification: string;
          phone: string;
          user_id: string;
        };
        Insert: {
          bond?: string | null;
          created_at?: string;
          id?: string;
          owner_identification: string;
          phone: string;
          user_id: string;
        };
        Update: {
          bond?: string | null;
          created_at?: string;
          id?: string;
          owner_identification?: string;
          phone?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'tb_users_phones_bond_fkey';
            columns: ['bond'];
            isOneToOne: false;
            referencedRelation: 'tb_familiar_bonds';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'tb_users_phones_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'tb_users';
            referencedColumns: ['id'];
          }
        ];
      };
      tb_users_roles: {
        Row: {
          created_at: string;
          role_id: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          role_id: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          role_id?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'tb_users_roles_role_id_fkey';
            columns: ['role_id'];
            isOneToOne: false;
            referencedRelation: 'tb_roles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'tb_users_roles_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'tb_users';
            referencedColumns: ['id'];
          }
        ];
      };
      tb_work_status: {
        Row: {
          created_at: string;
          id: string;
          name: string;
          ordenation: number | null;
        };
        Insert: {
          created_at?: string;
          id?: string;
          name: string;
          ordenation?: number | null;
        };
        Update: {
          created_at?: string;
          id?: string;
          name?: string;
          ordenation?: number | null;
        };
        Relationships: [];
      };
    };
    Views: {
      appointmentformdata: {
        Row: {
          id: string | null;
          name: string | null;
          ordenation: number | null;
          source: string | null;
        };
        Relationships: [];
      };
      clientformdata: {
        Row: {
          id: string | null;
          name: string | null;
          ordenation: number | null;
          source: string | null;
        };
        Relationships: [];
      };
    };
    Functions: {
      create_new_appointment: {
        Args: {
          date_input: string;
          time_input: string;
          access_id_input: string;
          employment_status_id_input: string;
          facility_id_input: string;
          modality_id_input: string;
          program_id_input: string;
          protocol_input: string;
          service_id_input: string;
          psychological_assessment_id_input: string;
          social_assessment_id_input: string;
          general_demand_id_input: string;
          procedure_id_input: string;
          has_leave_of_absence_input: boolean;
          hospitalization_input: boolean;
          record_progress_input: string;
          registered_by_input: string;
          specialists_id_input: string[];
          attendeds_id_input: string[];
          specific_demands_id_input: string[];
          documents_id_input: string[];
          travels_id_input: string[];
          referrals_input: Json[];
        };
        Returns: undefined;
      };
      create_new_attended: {
        Args: {
          fullname_input: string;
          nickname_input: string;
          rg_input: string;
          rank_id_input: string;
          cadre_id_input: string;
          opm_id_input: string;
          gender_id_input: string;
          cpf_input: string;
          birth_date_input: string;
          marital_status_id_input: string;
          policy_holder_id_input: string;
          is_civil_volunteer_input: boolean;
          familiar_bond_id_input: string;
          work_status_id_input: string;
          registered_by_input: string;
          zip_code_input: string;
          number_input: string;
          street_input: string;
          neighborhood_input: string;
          city_id_input: string;
          phones_input: Json[];
        };
        Returns: undefined;
      };
      create_new_user:
        | {
            Args: {
              user_id_input: string;
              avatar_input: string;
              fullname_input: string;
              nickname_input: string;
              rg_input: string;
              rank_id_input: string;
              cadre_id_input: string;
              opm_id_input: string;
              gender_id_input: string;
              email_input: string;
              cpf_input: string;
              professional_registration_input: string;
              birth_date_input: string;
              marital_status_id_input: string;
              work_status_id_input: string;
              registered_by_input: string;
              zip_code_input: string;
              number_input: string;
              street_input: string;
              neighborhood_input: string;
              city_id_input: string;
              phones_input: Json[];
            };
            Returns: undefined;
          }
        | {
            Args: {
              user_id_input: string;
              avatar_input: string;
              fullname_input: string;
              nickname_input: string;
              rg_input: string;
              rank_id_input: string;
              cadre_id_input: string;
              opm_id_input: string;
              gender_id_input: string;
              email_input: string;
              cpf_input: string;
              professional_registration_input: string;
              birth_date_input: string;
              marital_status_id_input: string;
              work_status_id_input: string;
              registered_by_input: string;
              zip_code_input: string;
              number_input: string;
              street_input: string;
              neighborhood_input: string;
              city_id_input: string;
              phones_input: Json[];
              role_id_input: string;
            };
            Returns: undefined;
          };
      get_attended_appointments: {
        Args: {
          cpf_input: string;
        };
        Returns: Database['public']['CompositeTypes']['attended_appointments_result_type'][];
      };
      get_attended_appointments_by_query: {
        Args: {
          cpf_input: string;
          q_input: string;
        };
        Returns: Database['public']['CompositeTypes']['attended_appointments_result_type'][];
      };
      get_attended_appointments_count: {
        Args: {
          cpf_input: string;
        };
        Returns: number;
      };
      get_attended_attachments: {
        Args: {
          attended_id_input: string;
        };
        Returns: Database['public']['CompositeTypes']['attended_files_result_type'][];
      };
      get_attended_files: {
        Args: {
          attended_id_input: string;
        };
        Returns: Database['public']['CompositeTypes']['attended_files_result_type'][];
      };
      get_attended_profile: {
        Args: {
          cpf_input: string;
        };
        Returns: Database['public']['CompositeTypes']['attended_profile_result_type'][];
      };
      get_attended_record_progress_files: {
        Args: {
          attended_id_input: string;
          appointment_id_input: string;
        };
        Returns: Database['public']['CompositeTypes']['attended_files_result_type'][];
      };
      get_attendeds_by_query: {
        Args: {
          q_input: string;
        };
        Returns: Database['public']['CompositeTypes']['person_generic_result_type'][];
      };
      get_specialists_by_query: {
        Args: {
          q_input: string;
        };
        Returns: Database['public']['CompositeTypes']['person_generic_result_type'][];
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      attended_appointments_result_type: {
        id: string;
        date: string;
        time: string;
        protocol: string;
        has_leave_of_absence: boolean;
        hospitalization: boolean;
        record_progress: string;
        is_signed: boolean;
        access: string;
        facility: string;
        modality: string;
        program: string;
        service: string;
        psychological_assessment: string;
        social_assessment: string;
        general_demand: string;
        procedure: string;
        employment_status: string;
        specialists: unknown;
        attendeds: unknown;
        specific_demands: unknown;
        produced_documents: unknown;
        travels: unknown;
        referral_destinations: unknown;
        referral_types: unknown;
      };
      attended_files_result_type: {
        id: string;
        filename: string;
        original_name: string;
        url: string;
        specie: string;
        path: string;
        bucket_name: string;
        appointment_id: string;
        created_at: string;
        user_data: Json;
        attended_data: Json;
      };
      attended_profile_result_type: {
        id: string;
        fullname: string;
        nickname: string;
        birth_date: string;
        avatar: string;
        is_civil_volunteer: boolean;
        rank: string;
        cadre: string;
        rg: string;
        cpf: string;
        opm: string;
        gender: string;
        marital_status: string;
        work_status: string;
        familiar_bond: string;
        address: Json;
        phones: unknown;
        policy_holder: Json;
        dependents: unknown;
      };
      person_generic_result_type: {
        id: string;
        fullname: string;
        nickname: string;
        rg: string;
        cpf: string;
        rank: string;
        cadre: string;
      };
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
          owner_id: string | null;
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
          owner_id?: string | null;
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
          owner_id?: string | null;
          public?: boolean | null;
          updated_at?: string | null;
        };
        Relationships: [];
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
          owner_id: string | null;
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
          owner_id?: string | null;
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
          owner_id?: string | null;
          path_tokens?: string[] | null;
          updated_at?: string | null;
          version?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'objects_bucketId_fkey';
            columns: ['bucket_id'];
            isOneToOne: false;
            referencedRelation: 'buckets';
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

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (Database['public']['Tables'] & Database['public']['Views'])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions['schema']]['Tables'] &
        Database[PublicTableNameOrOptions['schema']]['Views'])
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions['schema']]['Tables'] &
      Database[PublicTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (Database['public']['Tables'] &
      Database['public']['Views'])
  ? (Database['public']['Tables'] &
      Database['public']['Views'])[PublicTableNameOrOptions] extends {
      Row: infer R;
    }
    ? R
    : never
  : never;

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof Database['public']['Tables']
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof Database['public']['Tables']
  ? Database['public']['Tables'][PublicTableNameOrOptions] extends {
      Insert: infer I;
    }
    ? I
    : never
  : never;

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof Database['public']['Tables']
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof Database['public']['Tables']
  ? Database['public']['Tables'][PublicTableNameOrOptions] extends {
      Update: infer U;
    }
    ? U
    : never
  : never;

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof Database['public']['Enums']
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions['schema']]['Enums']
    : never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions['schema']]['Enums'][EnumName]
  : PublicEnumNameOrOptions extends keyof Database['public']['Enums']
  ? Database['public']['Enums'][PublicEnumNameOrOptions]
  : never;
