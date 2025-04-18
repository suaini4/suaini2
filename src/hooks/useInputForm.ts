import { useState } from "react";
import { format } from "date-fns";
import { createTransaction } from "@/services/transactionService";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

export const useInputForm = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [assetType, setAssetType] = useState("car");
  const [rentalType, setRentalType] = useState("drop");
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [vehicle, setVehicle] = useState("");
  const [fromLocation, setFromLocation] = useState("");
  const [toLocation, setToLocation] = useState("");
  const [price, setPrice] = useState("");
  const [fuelCost, setFuelCost] = useState("");
  const [driverCost, setDriverCost] = useState("");
  const [trips, setTrips] = useState("1");
  const [days, setDays] = useState("1");
  const [salesAmount, setSalesAmount] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const cars = [
    { name: "Veloz 2021", plate: "DR 1359 DT" },
    { name: "Veloz 2019", plate: "DR 1019 KG" },
    { name: "Avanza 2023", plate: "Z 1494 TQ" },
    { name: "Avanza 2022", plate: "B 2206 POT" },
    { name: "Avanza 2018", plate: "AB 1375 KJ" },
    { name: "Avanza 2019", plate: "B 2191 TIH" },
    { name: "Avanza 2023", plate: "D 1217 UBM" },
    { name: "Xpander 2019", plate: "DR 1191 CP" },
  ];

  const speedboats = [
    { name: "Speed Boat Broo Meet" },
    { name: "Speed Boat Bintang Laut" },
    { name: "Speed Boat BJT 01" },
    { name: "Speed Boat Speedy91" },
  ];

  const calculateDailyCash = () => {
    const tripsNum = parseInt(trips) || 0;
    const daysNum = parseInt(days) || 0;

    if (assetType === "car") {
      if (rentalType === "drop") {
        return tripsNum * 10000;
      } else {
        // harian
        return daysNum * 10000;
      }
    } else if (assetType === "speedboat") {
      return tripsNum * 10000; // 10,000 per trip for speedboat
    }
    return 0;
  };

  const resetForm = () => {
    setVehicle("");
    setFromLocation("");
    setToLocation("");
    setPrice("");
    setFuelCost("");
    setDriverCost("");
    setTrips("1");
    setDays("1");
    setSalesAmount("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (!date) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Tanggal harus diisi",
        });
        return;
      }

      const formattedDate = format(date, "yyyy-MM-dd");
      const dailyCash = calculateDailyCash();

      let transactionData: any = {
        date: formattedDate,
        assetType,
        dailyCash,
        operationalCosts: {
          fuel: 0,
          driver: 0,
        },
        trips: 1,
        days: 1,
        route: "",
      };

      if (assetType === "car") {
        if (!vehicle || !price) {
          toast({
            variant: "destructive",
            title: "Error",
            description: "Semua field harus diisi",
          });
          return;
        }

        transactionData = {
          ...transactionData,
          assetName: vehicle,
          rentalType,
          price: parseFloat(price),
        };

        if (rentalType === "drop") {
          if (!fromLocation || !toLocation) {
            toast({
              variant: "destructive",
              title: "Error",
              description: "Lokasi awal dan tujuan harus diisi",
            });
            return;
          }
          transactionData = {
            ...transactionData,
            route: `${fromLocation} - ${toLocation}`,
            operationalCosts: {
              fuel: parseFloat(fuelCost) || 0,
              driver: parseFloat(driverCost) || 0,
            },
            trips: parseInt(trips),
          };
        } else {
          // harian
          transactionData = {
            ...transactionData,
            days: parseInt(days),
          };
        }
      } else if (assetType === "speedboat") {
        if (!vehicle || !trips || !price) {
          toast({
            variant: "destructive",
            title: "Error",
            description: "Semua field harus diisi",
          });
          return;
        }
        transactionData = {
          ...transactionData,
          assetName: vehicle,
          price: parseFloat(price),
          trips: parseInt(trips),
        };
      } else if (assetType === "restaurant") {
        if (!salesAmount) {
          toast({
            variant: "destructive",
            title: "Error",
            description: "Uang kas harian harus diisi",
          });
          return;
        }
        transactionData = {
          ...transactionData,
          assetName: "Resto",
          price: 0,
          dailyCash: parseFloat(salesAmount) || 0,
          trips: 1,
          days: 1,
        };
      }

      // Save to Supabase
      await createTransaction(transactionData);
      console.log("Transaction saved to Supabase:", transactionData);

      // Reset form
      resetForm();

      toast({
        title: "Sukses",
        description: "Data berhasil disimpan ke Supabase!",
        variant: "default",
        className: "bg-green-100 border border-green-400 text-green-800",
      });

      // Redirect ke halaman laporan setelah menyimpan data
      setTimeout(() => {
        navigate("/reports");
      }, 1500);
    } catch (error) {
      console.error("Error saving transaction to Supabase:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Gagal menyimpan data ke Supabase. Silakan coba lagi.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    assetType,
    setAssetType,
    rentalType,
    setRentalType,
    date,
    setDate,
    vehicle,
    setVehicle,
    fromLocation,
    setFromLocation,
    toLocation,
    setToLocation,
    price,
    setPrice,
    fuelCost,
    setFuelCost,
    driverCost,
    setDriverCost,
    trips,
    setTrips,
    days,
    setDays,
    salesAmount,
    setSalesAmount,
    isSubmitting,
    cars,
    speedboats,
    calculateDailyCash,
    handleSubmit,
  };
};
