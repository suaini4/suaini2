export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      monthly_expenses: {
        Row: {
          created_at: string | null;
          date: string;
          electricity_bill: number;
          id: string;
          internet_bill: number;
          month: string;
          night_guard_salary: number;
          other_expenses: number;
          staff_salary: number;
          total_expense: number;
          user_id: string | null;
          water_bill: number;
          year: string;
        };
        Insert: {
          created_at?: string | null;
          date: string;
          electricity_bill?: number;
          id?: string;
          internet_bill?: number;
          month: string;
          night_guard_salary?: number;
          other_expenses?: number;
          staff_salary?: number;
          total_expense?: number;
          user_id?: string | null;
          water_bill?: number;
          year: string;
        };
        Update: {
          created_at?: string | null;
          date?: string;
          electricity_bill?: number;
          id?: string;
          internet_bill?: number;
          month?: string;
          night_guard_salary?: number;
          other_expenses?: number;
          staff_salary?: number;
          total_expense?: number;
          user_id?: string | null;
          water_bill?: number;
          year?: string;
        };
        Relationships: [
          {
            foreignKeyName: "monthly_expenses_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      transactions: {
        Row: {
          asset_name: string;
          asset_type: string;
          created_at: string | null;
          daily_cash: number;
          date: string;
          days: number | null;
          id: string;
          operational_costs: Json | null;
          price: number;
          rental_type: string | null;
          route: string | null;
          trips: number | null;
          user_id: string | null;
        };
        Insert: {
          asset_name: string;
          asset_type: string;
          created_at?: string | null;
          daily_cash?: number;
          date: string;
          days?: number | null;
          id?: string;
          operational_costs?: Json | null;
          price?: number;
          rental_type?: string | null;
          route?: string | null;
          trips?: number | null;
          user_id?: string | null;
        };
        Update: {
          asset_name?: string;
          asset_type?: string;
          created_at?: string | null;
          daily_cash?: number;
          date?: string;
          days?: number | null;
          id?: string;
          operational_costs?: Json | null;
          price?: number;
          rental_type?: string | null;
          route?: string | null;
          trips?: number | null;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "transactions_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      users: {
        Row: {
          created_at: string | null;
          email: string;
          id: string;
          is_admin: boolean | null;
          username: string | null;
        };
        Insert: {
          created_at?: string | null;
          email: string;
          id?: string;
          is_admin?: boolean | null;
          username?: string | null;
        };
        Update: {
          created_at?: string | null;
          email?: string;
          id?: string;
          is_admin?: boolean | null;
          username?: string | null;
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
};

type DefaultSchema = Database[Extract<keyof Database, "public">];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {},
  },
} as const;

// Application-specific types based on the database schema
export type User = {
  id: string;
  username: string;
  email: string;
  isAuthenticated: boolean;
  is_admin: boolean | null;
};

export type Transaction = Tables<"transactions"> & {
  // Add any additional properties needed for the application
  assetType: "car" | "speedboat" | "restaurant";
  assetName: string;
  rentalType?: "drop" | "harian";
  operationalCosts?: {
    fuel: number;
    driver: number;
  };
  dailyCash: number;
};

export type MonthlyExpense = Tables<"monthly_expenses"> & {
  // Add any additional properties needed for the application
  staffSalary: number;
  nightGuardSalary: number;
  electricityBill: number;
  waterBill: number;
  internetBill: number;
  otherExpenses: number;
  totalExpense: number;
};
