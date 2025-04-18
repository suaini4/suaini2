import React from "react";
import { Banknote, Lightbulb, Droplets, Wifi, Calendar } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { format } from "date-fns";

interface ExpenseCardProps {
  expenseType:
    | "salary"
    | "nightGuard"
    | "electricity"
    | "water"
    | "internet"
    | "operational";
  expenseName: string;
  value: number | string;
  date?: Date | string;
  onClick?: () => void;
}

export const ExpenseCard: React.FC<ExpenseCardProps> = ({
  expenseType,
  expenseName,
  value,
  date,
  onClick,
}) => {
  const getIcon = () => {
    switch (expenseType) {
      case "salary":
      case "nightGuard":
        return <Banknote className="h-5 w-5 text-white opacity-80" />;
      case "electricity":
        return <Lightbulb className="h-5 w-5 text-white opacity-80" />;
      case "water":
        return <Droplets className="h-5 w-5 text-white opacity-80" />;
      case "internet":
        return <Wifi className="h-5 w-5 text-white opacity-80" />;
      case "operational":
        return <Banknote className="h-5 w-5 text-white opacity-80" />;
      default:
        return <Banknote className="h-5 w-5 text-white opacity-80" />;
    }
  };

  return (
    <Card
      className="bg-bjt-cardBg shadow-premium hover:shadow-premium-hover transition-shadow duration-300 cursor-pointer"
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-bjt-primary/30 p-2 rounded-full">
              {getIcon()}
            </div>
            <div>
              <h3 className="text-white font-medium text-sm">{expenseName}</h3>
              {date && (
                <div className="flex items-center mt-1 text-white/70 text-xs">
                  <Calendar className="h-3 w-3 mr-1" />
                  <span>
                    {typeof date === "string"
                      ? date
                      : format(date, "dd MMM yyyy")}
                  </span>
                </div>
              )}
            </div>
          </div>
          <span className="text-white font-bold text-sm">{value}</span>
        </div>
      </CardContent>
    </Card>
  );
};
