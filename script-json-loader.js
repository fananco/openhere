// ===============================
// JSON Data Loader for Damietta Analyzer
// Loads real competitors from data-new.json
// ===============================

class JsonDataLoader {

    constructor() {

        this.data = null;
        this.rootKey = "دمياط الجديدة";
        this.loadError = null;
    }

    async loadData() {

        if (this.data) {

            return this.data;
        }

        // 1) Embedded by data-new.js (works with file:// and http)
        if (
            typeof window !== "undefined"
            && window.DAMIETTA_DATA
        ) {

            this.data = window.DAMIETTA_DATA;

            console.log(
                "[JSON] Loaded from data-new.js (embedded)"
            );

            return this.data;
        }

        // 2) fetch (needs http/https server)
        try {

            const base =
                typeof window !== "undefined"
                && window.location
                && window.location.href
                    ? new URL(
                        "./data-new.json",
                        window.location.href
                    ).href
                    : "data-new.json";

            const response =
                await fetch(base, {
                    cache: "no-store"
                });

            if (response.ok) {

                this.data =
                    await response.json();

                console.log(
                    "[JSON] Loaded via fetch:",
                    base
                );

                return this.data;
            }

            this.loadError =
                `HTTP ${response.status}`;

        } catch (error) {

            this.loadError = error.message;

            console.warn(
                "[JSON] fetch failed:",
                error
            );
        }

        // 3) sync XHR fallback (some local setups)
        try {

            const xhr = new XMLHttpRequest();

            xhr.open(
                "GET",
                "data-new.json",
                false
            );

            xhr.overrideMimeType(
                "application/json"
            );

            xhr.send(null);

            if (
                xhr.status === 200
                || xhr.status === 0
            ) {

                this.data =
                    JSON.parse(
                        xhr.responseText
                    );

                console.log(
                    "[JSON] Loaded via XHR"
                );

                return this.data;
            }

        } catch (error) {

            console.warn(
                "[JSON] XHR failed:",
                error
            );
        }

        console.error(
            "[JSON] Could not load data. Add data-new.js or run a local server."
        );

        return null;
    }

    isLoaded() {

        return !!this.data;
    }

    getBusinesses(area, businessType) {

        if (!this.data) {

            console.log("[JSON] No data loaded yet");

            return [];
        }

        const root =
            this.data[this.rootKey];

        if (!root) {

            console.log(
                `[JSON] Root not found: ${this.rootKey}`
            );

            return [];
        }

        const jsonType =
            this.mapBusinessType(businessType);

        const nodes =
            this.resolveDataNodes(root, area);

        if (nodes.length === 0) {

            console.log(
                `[JSON] No nodes for area: "${area}"`
            );

            return [];
        }

        const businesses = [];

        nodes.forEach(node => {

            this.collectBusinesses(
                node,
                jsonType,
                businesses
            );
        });

        console.log(
            `[JSON] ${businesses.length} "${jsonType}" in "${area}"`
        );

        return businesses;
    }

    mapBusinessType(businessType) {

        const typeMapping = {

            cafe: "cafes",

            restaurant: "restaurants",

            pharmacy: "pharmacy",

            supermarket: "supermarket",

            gym: "gym",

            clothing: "clothes",

            clothes: "clothes",

            bakery: "bakery",

            bookstore: "bookstore",

            hair_salon: "hair_salon",

            hotel: "hotel"
        };

        return typeMapping[businessType]
            || businessType;
    }

    resolveDataNodes(root, area) {

        const trimmed =
            area.trim();

        const districtKey =
            this.mapDistrictName(trimmed);

        const newDamiettaDistricts =
            new Set([
                "الحي الاول",
                "الحي الثاني",
                "الحي الثالث",
                "الحي الرابع",
                "الحي الخامس"
            ]);

        const oldDamiettaSubAreas =
            new Set([
                "فارسكور",
                "كفر سعد",
                "كفر البطيخ",
                "رأس البر",
                "مركز الزرقا",
                "شطا"
            ]);

        if (districtKey) {

            const node =
                root[districtKey];

            return node
                ? [node]
                : [];
        }

        if (trimmed === "دمياط الجديدة") {

            return Object.keys(root)
                .filter(key =>
                    newDamiettaDistricts.has(key)
                )
                .map(key => root[key])
                .filter(Boolean);
        }

        if (oldDamiettaSubAreas.has(trimmed)) {

            const oldRoot =
                root["دمياط القديمة"];

            const node =
                oldRoot
                && oldRoot[trimmed];

            return node
                ? [node]
                : [];
        }

        if (trimmed === "دمياط القديمة") {

            const oldRoot =
                root["دمياط القديمة"];

            if (!oldRoot) {

                return [];
            }

            return Object.values(oldRoot)
                .filter(
                    node =>
                        node
                        && typeof node === "object"
                );
        }

        return [];
    }

    mapDistrictName(area) {

        const districtAliases = {

            "الحي الأول": "الحي الاول",

            "الحي الثاني": "الحي الثاني",

            "الحي الثالث": "الحي الثالث",

            "الحي الرابع": "الحي الرابع",

            "الحي الخامس": "الحي الخامس",

            "الحي الاول": "الحي الاول"
        };

        return districtAliases[area] || null;
    }

    collectBusinesses(node, jsonType, businesses) {

        if (!node || typeof node !== "object") {

            return;
        }

        const list = node[jsonType];

        if (!Array.isArray(list)) {

            return;
        }

        list.forEach(biz => {

            if (
                biz.lat == null
                || biz.lng == null
            ) {

                return;
            }

            businesses.push({

                id: businesses.length + 1,

                name:
                    biz.name
                    || "بدون اسم",

                lat: biz.lat,

                lon: biz.lng,

                rating:
                    biz.rate ?? 0,

                phone:
                    biz.phone || null,

                distance: 0,

                isRelated: false,

                source: "data-new.json"
            });
        });
    }

    getAreaStats(area) {

        const types = [
            "cafe",
            "restaurant",
            "pharmacy",
            "supermarket",
            "gym",
            "hotel",
            "bakery",
            "bookstore",
            "hair_salon"
        ];

        const stats = {
            total: 0,
            byType: {}
        };

        types.forEach(type => {

            const count =
                this.getBusinesses(area, type).length;

            stats.byType[type] = count;
            stats.total += count;
        });

        return stats;
    }
}

if (
    typeof module !== "undefined"
    && module.exports
) {

    module.exports = JsonDataLoader;
}
