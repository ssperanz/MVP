"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.geocodeAddress = geocodeAddress;
exports.haversine = haversine;
const axios_1 = __importDefault(require("axios"));
const cache = new Map();
async function geocodeAddress(address) {
    if (cache.has(address)) {
        return cache.get(address);
    }
    const url = "https://nominatim.openstreetmap.org/search";
    const res = await axios_1.default.get(url, {
        params: { q: address, format: "json", limit: 1 },
        headers: { "User-Agent": "warehouse-distance-service" },
    });
    if (!res.data || res.data.length === 0) {
        throw new Error(`Impossibile geocodificare l'indirizzo: ${address}`);
    }
    const coords = [parseFloat(res.data[0].lat), parseFloat(res.data[0].lon)];
    cache.set(address, coords);
    console.log(`Geocoded ${address} to ${coords[0]}, ${coords[1]}`);
    return coords;
}
function haversine([lat1, lon1], [lat2, lon2]) {
    const R = 6371e3;
    const toRad = (deg) => (deg * Math.PI) / 180;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a = Math.sin(dLat / 2) ** 2 +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}
//# sourceMappingURL=geo.js.map