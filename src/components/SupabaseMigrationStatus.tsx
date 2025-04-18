import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { CheckCircle, Circle, XCircle } from "lucide-react";

interface MigrationItem {
  name: string;
  status: "completed" | "in-progress" | "pending";
  description?: string;
}

const SupabaseMigrationStatus: React.FC = () => {
  const migrationStatus: MigrationItem[] = [
    {
      name: "Authentication Service",
      status: "completed",
      description: "User authentication now uses Supabase",
    },
    {
      name: "Transaction Service",
      status: "completed",
      description: "Transactions are now stored in Supabase",
    },
    {
      name: "Monthly Expense Service",
      status: "completed",
      description: "Monthly expenses are now stored in Supabase",
    },
    {
      name: "Input Form Component",
      status: "completed",
      description: "Input form now saves data to Supabase",
    },
    {
      name: "Reports View Component",
      status: "completed",
      description: "Reports now fetch data from Supabase",
    },
    {
      name: "Monthly Expenses Component",
      status: "completed",
      description: "Monthly expenses now use Supabase",
    },
    {
      name: "Remove localStorage Service",
      status: "completed",
      description: "localStorage service now redirects to Supabase",
    },
    {
      name: "Remove Firebase Service",
      status: "completed",
      description: "Firebase service now redirects to Supabase",
    },
  ];

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader className="bg-gradient-to-r from-bjt-primary to-bjt-primaryLight text-white">
        <CardTitle className="text-2xl">Supabase Migration Status</CardTitle>
        <p className="text-white/80 text-sm mt-1">
          Progress of migrating from localStorage to Supabase
        </p>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-4">
          {migrationStatus.map((item) => (
            <div
              key={item.name}
              className="flex items-center justify-between border-b pb-2"
            >
              <div className="flex items-center gap-3">
                {item.status === "completed" ? (
                  <CheckCircle className="text-green-500" />
                ) : item.status === "in-progress" ? (
                  <Circle className="text-blue-500" />
                ) : (
                  <XCircle className="text-red-500" />
                )}
                <div>
                  <span className="text-lg font-medium">{item.name}</span>
                  {item.description && (
                    <p className="text-sm text-gray-500">{item.description}</p>
                  )}
                </div>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-sm ${
                  item.status === "completed"
                    ? "bg-green-100 text-green-800"
                    : item.status === "in-progress"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-red-100 text-red-800"
                }`}
              >
                {item.status === "completed"
                  ? "Completed"
                  : item.status === "in-progress"
                    ? "In Progress"
                    : "Pending"}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default SupabaseMigrationStatus;
