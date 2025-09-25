// src/mocks/mobility.ts
import type { CarpoolOffer, BusOffer, TrainOffer } from "./resultsFiltering";

/* ===== Carpool offers ===== */
export const mockCarpool: CarpoolOffer[] = [
  {
    id: "c1",
    driverName: "Ivan",
    carModel: "Skoda Fabia",
    time: "12:30",
    priceUAH: 150,
    seatsLeft: 2,
    isVerified: true,
    isInstantBookable: true,
    carrierId: "vp",
    carrierName: "VPidsadka",
  },
  {
    id: "c2",
    driverName: "Oleh",
    carModel: "Renault",
    time: "13:00",
    priceUAH: 120,
    seatsLeft: 1,
    isVerified: false,
    isInstantBookable: false,
    carrierId: "vp",
    carrierName: "VPidsadka",
  },
  {
    id: "c3",
    driverName: "Nastya",
    carModel: "Toyota",
    time: "09:15",
    priceUAH: 200,
    seatsLeft: 3,
    isVerified: true,
    isInstantBookable: false,
    carrierId: "vp",
    carrierName: "VPidsadka",
  },
];

/* ===== Bus offers ===== */
export const mockBuses: BusOffer[] = [
  {
    id: "b1",
    routeTitle: "Lviv → Kyiv",
    departTime: "14:00",
    priceUAH: 350,
    carrierId: "flix",
    carrierName: "FlixBus",
  },
  {
    id: "b2",
    routeTitle: "Lviv → Ternopil",
    departTime: "15:00",
    priceUAH: 180,
    carrierId: "gunsel",
    carrierName: "Gunsel",
  },
  {
    id: "b3",
    routeTitle: "Lviv → Kyiv",
    departTime: "08:30",
    priceUAH: 310,
    carrierId: "flix",
    carrierName: "FlixBus",
  },
];

/* ===== Train offers ===== */
export const mockTrains: TrainOffer[] = [
  {
    id: "t1",
    trainTitle: "Intercity No. 743",
    departTime: "16:20",
    priceUAH: 600,
    carrierId: "udz",
    carrierName: "Ukrzaliznytsia",
  },
  {
    id: "t2",
    trainTitle: "Night No. 128",
    departTime: "23:10",
    priceUAH: 480,
    carrierId: "udz",
    carrierName: "Ukrzaliznytsia",
  },
];

/* ===== Carrier options for filters ===== */
export const mockCarriers = [
  { id: "vp", label: "VPidsadka" },
  { id: "flix", label: "FlixBus" },
  { id: "gunsel", label: "Gunsel" },
  { id: "udz", label: "Ukrzaliznytsia" },
];
