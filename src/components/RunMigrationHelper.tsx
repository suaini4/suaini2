import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Alert, AlertDescription } from "./ui/alert";
import { supabase } from "@/lib/supabase";

const RunMigrationHelper = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [result, setResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  const runMigration = async () => {
    setIsRunning(true);
    setResult(null);

    try {
      // First check if we can connect to Supabase
      const { error: connectionError } = await supabase
        .from("transactions")
        .select("count", { count: "exact", head: true });

      if (connectionError) {
        setResult({
          success: false,
          message: `Cannot connect to Supabase: ${connectionError.message}`,
        });
        return;
      }

      // Apply the migration manually using SQL
      const { error: migrationError } = await supabase.rpc("execute_sql", {
        sql_query: `
            -- Set default values for critical fields
            ALTER TABLE transactions 
            ALTER COLUMN daily_cash SET DEFAULT 0,
            ALTER COLUMN price SET DEFAULT 0,
            ALTER COLUMN trips SET DEFAULT 1,
            ALTER COLUMN days SET DEFAULT 1;
            
            -- Update any existing NULL values
            UPDATE transactions SET daily_cash = 0 WHERE daily_cash IS NULL;
            UPDATE transactions SET price = 0 WHERE price IS NULL;
            UPDATE transactions SET trips = 1 WHERE trips IS NULL;
            UPDATE transactions SET days = 1 WHERE days IS NULL;
            UPDATE transactions SET operational_costs = '{"fuel": 0, "driver": 0}' WHERE operational_costs IS NULL;
          `,
      });

      if (migrationError) {
        setResult({
          success: false,
          message: `Migration failed: ${migrationError.message}`,
        });
        return;
      }

      setResult({
        success: true,
        message:
          "Migration successfully applied! The database has been updated with default values for all required fields.",
      });
    } catch (error) {
      setResult({
        success: false,
        message: `Error: ${error instanceof Error ? error.message : "Unknown error"}`,
      });
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="bg-gradient-to-r from-bjt-primary to-bjt-primaryLight text-white">
        <CardTitle className="text-xl">Database Migration Helper</CardTitle>
      </CardHeader>
      <CardContent className="pt-6 space-y-4">
        <p className="text-sm text-gray-600">
          This tool will apply the migration to fix NULL values in the
          transactions table. It will:
        </p>
        <ul className="list-disc pl-5 text-sm text-gray-600 space-y-1">
          <li>Set default values for critical fields</li>
          <li>Update any existing NULL values to appropriate defaults</li>
          <li>Ensure operational_costs is properly initialized</li>
        </ul>

        {result && (
          <Alert
            className={`${result.success ? "bg-green-100 border-green-500" : "bg-red-100 border-red-500"} text-bjt-textPrimary`}
          >
            <AlertDescription>{result.message}</AlertDescription>
          </Alert>
        )}

        <Button
          onClick={runMigration}
          disabled={isRunning}
          className="w-full bg-bjt-secondary hover:bg-bjt-secondary/80 text-white"
        >
          {isRunning ? "Applying Migration..." : "Apply Migration"}
        </Button>
      </CardContent>
    </Card>
  );
};

export default RunMigrationHelper;
