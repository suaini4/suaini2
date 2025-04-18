import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

/**
 * Saran untuk Pengembangan Form Input:
 *
 * 1. Fitur Pencarian dan Filter: Tambahkan dropdown filter untuk mencari transaksi sebelumnya
 *    dan mengisi form dengan data yang sudah ada untuk memudahkan entri data berulang dan
 *    menjaga konsistensi data.
 *
 * 2. Fitur Foto Bukti: Tambahkan input file dengan preview untuk melampirkan foto bukti
 *    transaksi seperti struk atau invoice, dengan kompresi gambar otomatis.
 *
 * 3. Validasi Form: Tingkatkan validasi form dengan pesan error yang lebih spesifik,
 *    validasi real-time saat pengguna mengetik, dan highlight field yang memerlukan perhatian.
 *
 * 4. Template Transaksi: Tambahkan kemampuan untuk menyimpan dan mengelola template transaksi
 *    yang sering digunakan dengan nama yang dapat disesuaikan untuk mempercepat proses input data.
 *
 * 5. Auto-save: Implementasikan penyimpanan otomatis data form sebagai draft untuk mencegah
 *    kehilangan data jika pengguna meninggalkan halaman secara tidak sengaja.
 *
 * 6. Riwayat Input: Tampilkan riwayat input terbaru dengan opsi untuk menduplikasi atau
 *    mengedit transaksi yang sudah ada.
 */

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import {
  CalendarIcon,
  Car,
  Ship,
  Utensils,
  DollarSign,
  MapPin,
  Fuel,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useInputForm } from "@/hooks/useInputForm";

const InputForm = () => {
  const {
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
  } = useInputForm();

  return (
    <Card className="w-full bg-[#111184] shadow-sm border-none max-w-3xl mx-auto">
      <div className="text-center py-4 bg-[#111184]">
        <h2 className="text-xl font-bold text-white">Berkah Jaya Transport</h2>
      </div>
      <CardContent className="p-4 bg-[#111184]">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="asset-type" className="text-white">
                Jenis Aset
              </Label>
              <div className="grid grid-cols-3 gap-2 mx-auto">
                <Button
                  type="button"
                  className={`flex items-center justify-center gap-2 ${assetType === "car" ? "bg-[#FFD700] text-[#111184]" : "bg-[#1E1E9E] text-white"} rounded-md py-3`}
                  onClick={() => setAssetType("car")}
                >
                  <Car className="h-4 w-4" />
                  <span>Mobil</span>
                </Button>
                <Button
                  type="button"
                  className={`flex items-center justify-center gap-2 ${assetType === "speedboat" ? "bg-[#FFD700] text-[#111184]" : "bg-[#1E1E9E] text-white"} rounded-md py-3`}
                  onClick={() => setAssetType("speedboat")}
                >
                  <Ship className="h-4 w-4" />
                  <span>Speedboat</span>
                </Button>
                <Button
                  type="button"
                  className={`flex items-center justify-center gap-2 ${assetType === "restaurant" ? "bg-[#FFD700] text-[#111184]" : "bg-[#1E1E9E] text-white"} rounded-md py-3`}
                  onClick={() => setAssetType("restaurant")}
                >
                  <Utensils className="h-4 w-4" />
                  <span>Resto</span>
                </Button>
              </div>
            </div>

            {assetType === "car" && (
              <div className="space-y-2">
                <Label htmlFor="rental-type" className="text-white">
                  Jenis Rental
                </Label>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    type="button"
                    className={`${rentalType === "drop" ? "bg-[#FFD700] text-[#111184]" : "bg-[#1E1E9E] text-white"} rounded-md py-3`}
                    onClick={() => setRentalType("drop")}
                  >
                    Drop
                  </Button>
                  <Button
                    type="button"
                    className={`${rentalType === "harian" ? "bg-[#FFD700] text-[#111184]" : "bg-[#1E1E9E] text-white"} rounded-md py-3`}
                    onClick={() => setRentalType("harian")}
                  >
                    Harian
                  </Button>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="date" className="text-white">
                Tanggal
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal flex items-center bg-white text-[#111184] h-12 rounded-md"
                  >
                    <CalendarIcon className="mr-2 h-5 w-5 text-[#111184]" />
                    {date ? format(date, "PPP") : <span>Pilih tanggal</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-white">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                    className="rounded-md border border-gray-300"
                  />
                </PopoverContent>
              </Popover>
            </div>

            {(assetType === "car" || assetType === "speedboat") && (
              <div className="space-y-2">
                <Label htmlFor="vehicle" className="text-white">
                  {assetType === "car" ? "Mobil" : "Speedboat"}
                </Label>
                <Select value={vehicle} onValueChange={setVehicle}>
                  <SelectTrigger className="h-12 bg-white text-[#111184] rounded-md">
                    <SelectValue
                      placeholder={`Pilih ${assetType === "car" ? "mobil" : "speedboat"}`}
                    />
                  </SelectTrigger>
                  <SelectContent className="bg-white text-[#111184]">
                    {assetType === "car"
                      ? cars.map((car, index) => (
                          <SelectItem
                            key={index}
                            value={`${car.name} (${car.plate})`}
                          >
                            {car.name} ({car.plate})
                          </SelectItem>
                        ))
                      : speedboats.map((boat, index) => (
                          <SelectItem key={index} value={boat.name}>
                            {boat.name}
                          </SelectItem>
                        ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Rest of the form remains the same */}
            {assetType === "car" && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="price" className="text-white">
                    Harga Sewa (Rp)
                  </Label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <DollarSign className="h-5 w-5 text-[#111184]" />
                    </div>
                    <Input
                      id="price"
                      type="number"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder="Masukkan harga sewa"
                      className="pl-10 h-12 bg-white text-[#111184] rounded-md"
                    />
                  </div>
                </div>

                {rentalType === "drop" ? (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="from-location" className="text-white">
                        Lokasi Awal
                      </Label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                          <MapPin className="h-5 w-5 text-[#111184]" />
                        </div>
                        <Input
                          id="from-location"
                          value={fromLocation}
                          onChange={(e) => setFromLocation(e.target.value)}
                          placeholder="Masukkan lokasi awal"
                          className="pl-10 h-12 bg-white text-[#111184] rounded-md"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="to-location" className="text-white">
                        Lokasi Tujuan
                      </Label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                          <MapPin className="h-5 w-5 text-[#111184]" />
                        </div>
                        <Input
                          id="to-location"
                          value={toLocation}
                          onChange={(e) => setToLocation(e.target.value)}
                          placeholder="Masukkan lokasi tujuan"
                          className="pl-10 h-12 bg-white text-[#111184] rounded-md"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="fuel-cost" className="text-white">
                        Biaya Bensin (Rp)
                      </Label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                          <Fuel className="h-5 w-5 text-[#111184]" />
                        </div>
                        <Input
                          id="fuel-cost"
                          type="number"
                          value={fuelCost}
                          onChange={(e) => setFuelCost(e.target.value)}
                          placeholder="Masukkan biaya bensin"
                          className="pl-10 h-12 bg-white text-[#111184] rounded-md"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="driver-cost" className="text-white">
                        Ongkos Sopir (Rp)
                      </Label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                          <Users className="h-5 w-5 text-[#111184]" />
                        </div>
                        <Input
                          id="driver-cost"
                          type="number"
                          value={driverCost}
                          onChange={(e) => setDriverCost(e.target.value)}
                          placeholder="Masukkan ongkos sopir"
                          className="pl-10 h-12 bg-white text-[#111184] rounded-md"
                        />
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="space-y-2">
                    <Label htmlFor="days" className="text-white">
                      Jumlah Hari
                    </Label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <CalendarIcon className="h-5 w-5 text-[#111184]" />
                      </div>
                      <Input
                        id="days"
                        type="number"
                        min="1"
                        value={days}
                        onChange={(e) => setDays(e.target.value)}
                        placeholder="Masukkan jumlah hari"
                        className="pl-10 h-12 bg-white text-[#111184] rounded-md"
                      />
                    </div>
                  </div>
                )}
              </>
            )}

            {((assetType === "car" && rentalType === "drop") ||
              assetType === "speedboat") && (
              <div className="space-y-2">
                <Label htmlFor="trips" className="text-white">
                  Jumlah Perjalanan
                </Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <CalendarIcon className="h-5 w-5 text-[#111184]" />
                  </div>
                  <Input
                    id="trips"
                    type="number"
                    min="1"
                    value={trips}
                    onChange={(e) => setTrips(e.target.value)}
                    placeholder="Masukkan jumlah perjalanan"
                    className="pl-10 h-12 bg-white text-[#111184] rounded-md"
                  />
                </div>
              </div>
            )}

            {assetType === "speedboat" && (
              <div className="space-y-2">
                <Label htmlFor="price" className="text-white">
                  Harga Sewa (Rp)
                </Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <DollarSign className="h-5 w-5 text-[#111184]" />
                  </div>
                  <Input
                    id="price"
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="Masukkan harga sewa"
                    className="pl-10 h-12 bg-white text-[#111184] rounded-md"
                  />
                </div>
              </div>
            )}

            {assetType === "restaurant" && (
              <div className="space-y-2">
                <Label htmlFor="sales-amount" className="text-white">
                  Uang Kas Harian
                </Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <DollarSign className="h-5 w-5 text-[#111184]" />
                  </div>
                  <Input
                    id="sales-amount"
                    type="number"
                    value={salesAmount}
                    onChange={(e) => setSalesAmount(e.target.value)}
                    placeholder="Masukkan jumlah uang kas"
                    className="pl-10 h-12 bg-white text-[#111184] rounded-md"
                  />
                </div>
              </div>
            )}

            {assetType !== "restaurant" && (
              <div className="bg-[#1E1E9E] p-3 rounded-md text-white">
                <p className="text-sm font-medium">
                  Uang Kas: Rp{calculateDailyCash().toLocaleString()}
                </p>
                <p className="text-xs mt-1">
                  {assetType === "car" &&
                    rentalType === "drop" &&
                    "Rp10.000 per perjalanan"}
                  {assetType === "car" &&
                    rentalType === "harian" &&
                    "Rp10.000 per hari"}
                  {assetType === "speedboat" && "Rp10.000 per perjalanan"}
                </p>
              </div>
            )}
          </div>

          <Button
            type="submit"
            className="bg-[#FFD700] hover:bg-yellow-500 text-[#111184] font-bold w-[90%] mx-auto block h-12 rounded-md"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Menyimpan..." : "Simpan Data"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default InputForm;
