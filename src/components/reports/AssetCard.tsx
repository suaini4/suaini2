import React from "react";
import { Car, Ship, Utensils, Banknote, Calendar } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { format } from "date-fns";
import { id } from "date-fns/locale";

interface AssetCardProps {
  assetType: "car" | "speedboat" | "restaurant" | "cash";
  assetName: string;
  dropValue?: string;
  harianValue?: string;
  totalValue?: string;
  transactions?: Array<{
    date: string;
    price: number;
    rentalType?: string;
    route?: string;
  }>;
  formatCurrency?: (amount: number) => string;
  onClick?: () => void;
}

export const AssetCard: React.FC<AssetCardProps> = ({
  assetType,
  assetName,
  dropValue,
  harianValue,
  totalValue,
  transactions = [],
  formatCurrency = (amount) => `Rp ${amount.toLocaleString()}`,
  onClick,
}) => {
  const getIcon = () => {
    switch (assetType) {
      case "car":
        return <Car className="h-5 w-5 text-white opacity-80" />;
      case "speedboat":
        return <Ship className="h-5 w-5 text-white opacity-80" />;
      case "restaurant":
        return <Utensils className="h-5 w-5 text-white opacity-80" />;
      case "cash":
        return <Banknote className="h-5 w-5 text-white opacity-80" />;
      default:
        return <Car className="h-5 w-5 text-white opacity-80" />;
    }
  };

  // Group transactions by rental type
  const dropTransactions = transactions.filter(
    (t) => !t.rentalType || t.rentalType === "drop",
  );
  const harianTransactions = transactions.filter(
    (t) => t.rentalType === "harian",
  );

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
            <h3 className="text-white font-medium text-sm">{assetName}</h3>
          </div>
          {totalValue && (
            <span className="text-white font-bold text-sm">{totalValue}</span>
          )}
        </div>

        {(dropValue || harianValue) && (
          <div className="mt-3 grid grid-cols-1 gap-2">
            {dropValue && (
              <div className="bg-bjt-primary/20 rounded-md p-2">
                <div className="flex justify-between items-center mb-1">
                  <p className="text-white/70 text-xs">Drop</p>
                  <p className="text-white text-sm font-medium">{dropValue}</p>
                </div>

                {dropTransactions.length > 0 && (
                  <div className="mt-2 space-y-1">
                    {dropTransactions.map((t, idx) => (
                      <div
                        key={idx}
                        className="flex justify-between items-center text-xs bg-bjt-primary/10 p-1.5 rounded-md"
                      >
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3 text-white/70" />
                          <span className="text-white/70">
                            {format(new Date(t.date), "d MMM yyyy", {
                              locale: id,
                            })}
                          </span>
                          {t.route && (
                            <span className="text-white/50 text-[10px] ml-1">
                              ({t.route})
                            </span>
                          )}
                        </div>
                        <span className="text-white">
                          {formatCurrency(t.price)}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {harianValue && (
              <div className="bg-bjt-primary/20 rounded-md p-2">
                <div className="flex justify-between items-center mb-1">
                  <p className="text-white/70 text-xs">Harian</p>
                  <p className="text-white text-sm font-medium">
                    {harianValue}
                  </p>
                </div>

                {harianTransactions.length > 0 && (
                  <div className="mt-2 space-y-1">
                    {harianTransactions.map((t, idx) => (
                      <div
                        key={idx}
                        className="flex justify-between items-center text-xs bg-bjt-primary/10 p-1.5 rounded-md"
                      >
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3 text-white/70" />
                          <span className="text-white/70">
                            {format(new Date(t.date), "d MMM yyyy", {
                              locale: id,
                            })}
                          </span>
                        </div>
                        <span className="text-white">
                          {formatCurrency(t.price)}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* For speedboat and restaurant that only have totalValue */}
        {!dropValue &&
          !harianValue &&
          transactions &&
          transactions.length > 0 && (
            <div className="mt-3 space-y-1">
              {transactions.map((t, idx) => (
                <div
                  key={idx}
                  className="flex justify-between items-center text-xs bg-bjt-primary/10 p-1.5 rounded-md"
                >
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3 text-white/70" />
                    <span className="text-white/70">
                      {format(new Date(t.date), "d MMM yyyy", { locale: id })}
                    </span>
                  </div>
                  <span className="text-white">{formatCurrency(t.price)}</span>
                </div>
              ))}
            </div>
          )}
      </CardContent>
    </Card>
  );
};
