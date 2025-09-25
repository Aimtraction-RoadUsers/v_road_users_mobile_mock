/* ===== Carpool offers ===== */
export const mockCarpool = [
    {
        id: "c1",
        driverName: "Іван",
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
        driverName: "Олег",
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
        driverName: "Настя",
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
export const mockBuses = [
    {
        id: "b1",
        routeTitle: "Львів → Київ",
        departTime: "14:00",
        priceUAH: 350,
        carrierId: "flix",
        carrierName: "FlixBus",
    },
    {
        id: "b2",
        routeTitle: "Львів → Тернопіль",
        departTime: "15:00",
        priceUAH: 180,
        carrierId: "gunsel",
        carrierName: "Gunsel",
    },
    {
        id: "b3",
        routeTitle: "Львів → Київ",
        departTime: "08:30",
        priceUAH: 310,
        carrierId: "flix",
        carrierName: "FlixBus",
    },
];
/* ===== Train offers ===== */
export const mockTrains = [
    {
        id: "t1",
        trainTitle: "Інтерсіті №743",
        departTime: "16:20",
        priceUAH: 600,
        carrierId: "udz",
        carrierName: "Укрзалізниця",
    },
    {
        id: "t2",
        trainTitle: "Нічний №128",
        departTime: "23:10",
        priceUAH: 480,
        carrierId: "udz",
        carrierName: "Укрзалізниця",
    },
];
/* ===== Carrier options for filters ===== */
export const mockCarriers = [
    { id: "vp", label: "VPidsadka" },
    { id: "flix", label: "FlixBus" },
    { id: "gunsel", label: "Gunsel" },
    { id: "udz", label: "Укрзалізниця" },
];
