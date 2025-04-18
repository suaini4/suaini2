import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { toast } from "./ui/use-toast";
import { supabase } from "@/lib/supabase";

const SupabaseCredentialsHelper = () => {
  const [isChecking, setIsChecking] = useState(false);
  const [status, setStatus] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  const checkSupabaseConnection = async () => {
    setIsChecking(true);
    setStatus(null);

    try {
      // Test connection to Supabase
      const { data, error } = await supabase
        .from("transactions")
        .select("count", { count: "exact", head: true });

      if (error) {
        setStatus({
          success: false,
          message: `Connection failed: ${error.message}`,
        });
        return;
      }

      setStatus({
        success: true,
        message: `Connection successful! Found ${data?.count || 0} transactions.`,
      });
    } catch (err) {
      setStatus({
        success: false,
        message: `Error: ${err instanceof Error ? err.message : "Unknown error"}`,
      });
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="bg-gradient-to-r from-bjt-primary to-bjt-primaryLight text-white">
        <CardTitle className="text-xl">Supabase Connection Status</CardTitle>
      </CardHeader>
      <CardContent className="pt-6 space-y-4">
        <p className="text-sm text-gray-600">
          Check if your Supabase credentials are properly configured. This will
          help diagnose issues with migrations and database operations.
        </p>

        {status && (
          <div
            className={`p-3 rounded-md ${status.success ? "bg-green-100 border border-green-500 text-green-800" : "bg-red-100 border border-red-500 text-red-800"}`}
          >
            <p>{status.message}</p>
          </div>
        )}

        <Button
          onClick={checkSupabaseConnection}
          disabled={isChecking}
          className="w-full bg-bjt-secondary hover:bg-bjt-secondary/80 text-white"
        >
          {isChecking ? "Checking Connection..." : "Check Supabase Connection"}
        </Button>

        <div className="text-sm text-gray-600 space-y-2 mt-4">
          <p className="font-medium">Troubleshooting Tips:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              Verify that your VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY
              environment variables are set correctly
            </li>
            <li>Check if your Supabase project is active and running</li>
            <li>Ensure your IP address is not blocked by Supabase</li>
            <li>Try restarting the development server</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default SupabaseCredentialsHelper;
