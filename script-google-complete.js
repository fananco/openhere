// ===============================
// Google Places Damietta Analyzer
// FINAL REAL COORDINATES VERSION
// ===============================

class GooglePlacesDamiettaAnalyzer {

    constructor() {

        this.map = null;
        this.markers = [];
        this.searchCircle = null;
        this.currentData = null;

        this.googleApiKey = "AIzaSyD4E4X8Y7QKZJY6F7G8H9I0J1K2L3M4N5";

        this.init();
    }

    // ===============================
    // INIT
    // ===============================

    init() {

        this.initializeMap();
        this.setupEventListeners();
    }

    initializeMap() {

        this.map = L.map("map").setView(
            [31.436800, 31.667000],
            12
        );

        L.tileLayer(
            "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
            {
                attribution:
                    "© OpenStreetMap contributors",
                maxZoom: 19
            }
        ).addTo(this.map);
    }

    setupEventListeners() {

        const form =
            document.getElementById("searchForm");

        if (form) {

            form.addEventListener(
                "submit",
                (e) => {

                    e.preventDefault();
                    this.handleSearch();
                }
            );
        }

        const radius =
            document.getElementById("radius");

        const rangeValue =
            document.querySelector(".range-value");

        if (radius && rangeValue) {

            radius.addEventListener(
                "input",
                function () {

                    rangeValue.textContent =
                        this.value + "م";
                }
            );
        }
    }

    // ===============================
    // SEARCH
    // ===============================

    async handleSearch() {

        const area =
            document.getElementById("area").value;

        const businessType =
            document.getElementById("businessType").value;

        const radius =
            parseInt(
                document.getElementById("radius").value
            );

        if (!area || !businessType) {

            this.showMessage(
                "يرجى اختيار المنطقة ونوع المشروع"
            );

            return;
        }

        this.showLoading(true);

        this.clearResults();

        try {

            const coordinates =
                await this.getCoordinates(area);

            const competitors =
                await this.searchCompetitors(
                    coordinates,
                    businessType,
                    radius
                );

            const optimalLocation =
                this.calculateOptimalLocation(
                    coordinates,
                    competitors,
                    businessType,
                    radius
                );

            this.displayResults(
                competitors,
                optimalLocation,
                coordinates,
                radius
            );

            this.updateDashboard(
                competitors,
                optimalLocation
            );

        } catch (error) {

            console.error(error);

            this.showMessage(
                "حدث خطأ أثناء التحليل"
            );

        } finally {

            this.showLoading(false);
        }
    }

    // ===============================
    // REAL COORDINATES
    // ===============================

    async getCoordinates(area) {

        const coordinates = {

            // =========================
            // Main Areas
            // =========================

            'دمياط الجديدة': {
                lat: 31.436800,
                lon: 31.667000
            },

            'دمياط القديمة': {
                lat: 31.415613339710557,
                lon: 31.81253053558542
            },

            'فرسكور': {
                lat: 31.33142662810772,
                lon: 31.716625835774334
            },

            'كفر سعد': {
                lat: 31.34945160865339,
                lon: 31.687196096609473
            },

            'كفر البطيخ': {
                lat: 31.398967929042303,
                lon: 31.731376427390718
            },

            'رأس البر': {
                lat: 31.503800411651955,
                lon: 31.825074764233957
            },

            'ميناء دمياط': {
                lat: 31.459039737926723,
                lon: 31.754508993994946
            },

            'مركز الزرقا': {
                lat: 31.20848410790022,
                lon: 31.631173519192473
            },

            'بحيرة المنزلة': {
                lat: 31.428304689439972,
                lon: 31.900627615541907
            },

            // =========================
            // New Damietta Districts
            // =========================

            'الحي الأول': {
                lat: 31.431761080072647,
                lon: 31.680629282944338
            },

            'الحي الثاني': {
                lat: 31.44622172134756,
                lon: 31.681125952969246
            },

            'الحي الثالث': {
                lat: 31.441580985354435,
                lon: 31.662511448374254
            },

            'الحي الرابع': {
                lat: 31.427959517222387,
                lon: 31.665086368851714
            },

            'الحي الخامس': {
                lat: 31.43715056373834,
                lon: 31.647405248239828
            },

            // =========================
            // Villages & Areas
            // =========================

            'الشيخ درغام': {
                lat: 31.483197482514413,
                lon: 31.835018174256838
            },

            'شطا': {
                lat: 31.410498992868252,
                lon: 31.865023372440465
            },

            'شط جريبة': {
                lat: 31.433044901649396,
                lon: 31.826091784176096
            },

            'العنانية': {
                lat: 31.391212461067827,
                lon: 31.813814070880863
            },

            'الحسانية': {
                lat: 31.39657916736154,
                lon: 31.833340551168263
            },

            'السيالة': {
                lat: 31.40090161558026,
                lon: 31.82741823407011
            },

            'الشعرا': {
                lat: 31.403685459898558,
                lon: 31.792313484894077
            },

            'العدلية': {
                lat: 31.392769387061385,
                lon: 31.760727792377633
            },

            'باب الحرس': {
                lat: 31.406908755758106,
                lon: 31.827589895482422
            },

            'ميدان سرور': {
                lat: 31.407421542566052,
                lon: 31.806733039615008
            },

            // =========================
            // Ezab
            // =========================

            'عزبة العنانية': {
                lat: 31.391065925535784,
                lon: 31.813256171444078
            },

            'عزبة البصارطة': {
                lat: 31.38165053827938,
                lon: 31.792656807624404
            },

            'عزبة محمد الدالي': {
                lat: 31.3994913471476,
                lon: 31.801239875882608
            },

            'عزبة الصقورة': {
                lat: 31.398355790932744,
                lon: 31.79244223091795
            },

            'عزبة الجوهرة': {
                lat: 31.394546082641288,
                lon: 31.822826292551973
            },

            'عزبة اللضامين': {
                lat: 31.41167023950161,
                lon: 31.763045220807342
            },

            // =========================
            // Important Places
            // =========================

            'المنطقة الصناعية دمياط الجديدة': {
                lat: 31.421839270246412,
                lon: 31.689106012936147
            }
        };

        console.log(
            "Selected Area:",
            area
        );

        return (
            coordinates[area]
            || coordinates['دمياط الجديدة']
        );
    }

    // ===============================
    // COMPETITORS
    // ===============================

    async searchCompetitors(
        location,
        businessType,
        radius
    ) {

        return this.generateSimulatedCompetitors(
            location,
            businessType,
            radius
        );
    }

    generateSimulatedCompetitors(
        location,
        businessType,
        radius
    ) {

        const names = [

            "النيل",
            "الأهرام",
            "الجزيرة",
            "المهندسين",
            "الزمالك",
            "القاهرة",
            "الهرم",
            "الجامعة"
        ];

        const competitors = [];

        const count =
            Math.floor(Math.random() * 5) + 4;

        for (let i = 0; i < count; i++) {

            const angle =
                Math.random() * Math.PI * 2;

            const distance =
                Math.random() * radius;

            const lat =
                location.lat +
                (
                    distance *
                    Math.cos(angle)
                ) / 111000;

            const lon =
                location.lon +
                (
                    distance *
                    Math.sin(angle)
                ) / 111000;

            competitors.push({

                id: i + 1,

                name:
                    `${this.getBusinessTypeLabel(
                        businessType
                    )} ${names[i % names.length]}`,

                lat,
                lon,

                distance:
                    Math.round(distance),

                rating:
                    (
                        Math.random() * 2 + 3
                    ).toFixed(1),

                isRelated:
                    Math.random() > 0.7
            });
        }

        return competitors;
    }

    // ===============================
    // LOCATION ANALYSIS
    // ===============================

    calculateOptimalLocation(
        center,
        competitors,
        businessType,
        radius
    ) {

        let bestScore = -1;

        let bestLocation = center;

        const gridSize = 120;

        for (
            let latOffset = -radius;
            latOffset <= radius;
            latOffset += gridSize
        ) {

            for (
                let lonOffset = -radius;
                lonOffset <= radius;
                lonOffset += gridSize
            ) {

                const dist =
                    Math.sqrt(
                        latOffset * latOffset +
                        lonOffset * lonOffset
                    );

                if (dist > radius) continue;

                const location = {

                    lat:
                        center.lat +
                        latOffset / 111000,

                    lon:
                        center.lon +
                        lonOffset / 111000
                };

                const score =
                    this.calculateAdvancedLocationScore(
                        location,
                        competitors,
                        businessType,
                        center
                    );

                if (score > bestScore) {

                    bestScore = score;
                    bestLocation = location;
                }
            }
        }

        return {

            ...bestLocation,

            score:
                Math.round(bestScore),

            strategy:
                this.getBusinessStrategy(
                    businessType
                )
        };
    }

    calculateAdvancedLocationScore(
        location,
        competitors,
        businessType,
        center
    ) {

        let score = 100;

        competitors.forEach(comp => {

            const dist =
                this.calculateDistance(
                    location,
                    comp
                );

            if (dist < 200) {

                score -= 20;

            } else if (dist < 500) {

                score -= 10;

            } else if (dist < 900) {

                score -= 4;
            }
        });

        const centerDist =
            this.calculateDistance(
                location,
                center
            );

        if (centerDist < 400) {

            score += 10;
        }

        score +=
            this.getBusinessTypeBonus(
                businessType,
                centerDist
            );

        return Math.max(
            0,
            Math.min(100, score)
        );
    }

    getBusinessTypeBonus(type, dist) {

        const bonuses = {

            cafe:
                dist < 600 ? 15 : 5,

            restaurant:
                dist < 800 ? 10 : 0,

            pharmacy:
                dist < 1000 ? 8 : 0,

            supermarket:
                dist < 1200 ? 5 : 0,

            gym:
                dist < 1500 ? 5 : 0
        };

        return bonuses[type] || 0;
    }

    // ===============================
    // MAP DISPLAY
    // ===============================

    displayResults(
        competitors,
        optimalLocation,
        center,
        radius
    ) {

        this.clearMarkers();

        this.searchCircle =
            L.circle(
                [center.lat, center.lon],
                {
                    radius: radius,
                    color: "#667eea",
                    fillOpacity: 0.1
                }
            ).addTo(this.map);

        competitors.forEach(comp => {

            const marker =
                L.marker(
                    [comp.lat, comp.lon],
                    {
                        icon:
                            this.createCompetitorIcon(comp)
                    }
                ).addTo(this.map);

            marker.bindPopup(`
                <div dir="rtl">
                    <strong>${comp.name}</strong>
                    <br>
                    التقييم:
                    ${comp.rating}
                    <br>
                    المسافة:
                    ${comp.distance}م
                </div>
            `);

            this.markers.push(marker);
        });

        const optimalMarker =
            L.marker(
                [
                    optimalLocation.lat,
                    optimalLocation.lon
                ],
                {
                    icon:
                        this.createOptimalIcon()
                }
            ).addTo(this.map);

        optimalMarker.bindPopup(`
            <div dir="rtl">
                <strong>
                    الموقع الأمثل
                </strong>
                <br>
                النقاط:
                ${optimalLocation.score}/100
                <br>
                ${optimalLocation.strategy}
            </div>
        `);

        this.markers.push(optimalMarker);

        const group =
            new L.featureGroup(this.markers);

        this.map.fitBounds(
            group.getBounds().pad(0.2)
        );

        document
            .getElementById("results")
            .classList.remove("hidden");

        document
            .getElementById("dashboard")
            .classList.remove("hidden");
    }

    // ===============================
    // ICONS
    // ===============================

    createCompetitorIcon(comp) {

        const color =
            comp.isRelated
                ? "#ffc107"
                : "#dc3545";

        return L.divIcon({

            html:
                `
                <div style="
                    width:18px;
                    height:18px;
                    border-radius:50%;
                    background:${color};
                    border:3px solid white;
                    box-shadow:0 0 6px rgba(0,0,0,0.4);
                "></div>
                `,

            className: "",

            iconSize: [24, 24]
        });
    }

    createOptimalIcon() {

        return L.divIcon({

            html:
                `
                <div style="
                    width:24px;
                    height:24px;
                    border-radius:50%;
                    background:#28a745;
                    border:4px solid white;
                    box-shadow:0 0 8px rgba(0,0,0,0.5);
                "></div>
                `,

            className: "",

            iconSize: [30, 30]
        });
    }

    // ===============================
    // HELPERS
    // ===============================

    calculateDistance(p1, p2) {

        const R = 6371;

        const dLat =
            this.toRad(
                p2.lat - p1.lat
            );

        const dLon =
            this.toRad(
                p2.lon - p1.lon
            );

        const a =

            Math.sin(dLat / 2) *
            Math.sin(dLat / 2)

            +

            Math.cos(
                this.toRad(p1.lat)
            )

            *

            Math.cos(
                this.toRad(p2.lat)
            )

            *

            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);

        const c =

            2 *
            Math.atan2(
                Math.sqrt(a),
                Math.sqrt(1 - a)
            );

        return R * c * 1000;
    }

    toRad(deg) {

        return deg * Math.PI / 180;
    }

    getBusinessTypeLabel(type) {

        const labels = {

            cafe: "كافيه",

            restaurant: "مطعم",

            pharmacy: "صيدلية",

            supermarket: "سوبر ماركت",

            gym: "جيم"
        };

        return labels[type] || "مشروع";
    }

    getBusinessStrategy(type) {

        const strategies = {

            cafe:
                "قرب الجامعات والمناطق الحيوية",

            restaurant:
                "قرب المناطق العائلية",

            pharmacy:
                "قرب المناطق السكنية",

            supermarket:
                "داخل الكتل السكانية",

            gym:
                "المناطق الراقية"
        };

        return (
            strategies[type]
            || "موقع استراتيجي"
        );
    }

    updateDashboard(
        competitors,
        optimalLocation
    ) {

        const compCount =
            document.getElementById("compCount");

        const optimalScore =
            document.getElementById("optimalScore");

        if (compCount) {

            compCount.textContent =
                competitors.length;
        }

        if (optimalScore) {

            optimalScore.textContent =
                optimalLocation.score;
        }
    }

    clearMarkers() {

        this.markers.forEach(marker => {

            this.map.removeLayer(marker);
        });

        this.markers = [];

        if (this.searchCircle) {

            this.map.removeLayer(
                this.searchCircle
            );

            this.searchCircle = null;
        }
    }

    clearResults() {

        this.clearMarkers();
    }

    showLoading(show) {

        const loading =
            document.getElementById("loading");

        if (!loading) return;

        if (show) {

            loading.classList.remove("hidden");

        } else {

            loading.classList.add("hidden");
        }
    }

    showMessage(message) {

        alert(message);
    }
}

// ===============================
// START APP
// ===============================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        new GooglePlacesDamiettaAnalyzer();
    }
);