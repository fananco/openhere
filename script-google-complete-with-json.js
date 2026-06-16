// ===============================
// Google Places Damietta Analyzer with JSON Integration
// FINAL REAL COORDINATES VERSION + JSON DATA
// ===============================

class GooglePlacesDamiettaAnalyzer {

    constructor() {

        this.map = null;
        this.markers = [];
        this.currentData = null;
        this.jsonLoader = new JsonDataLoader();
        this.mapLayers = [];
        this.polygonLayers = [];

        this.googleApiKey = "AIzaSyD4E4X8Y7QKZJY6F7G8H9I0J1K2L3M4N5";

        this.init();
    }

    // ===============================
    // POLYGON DATA
    // ===============================

    areaPopulation = {
        // New Damietta Districts (Estimated based on urban distribution)
        'الحي الأول': 12000,
        'الحي الثاني': 11000,
        'الحي الثالث': 10000,
        'الحي الرابع': 8500,
        'الحي الخامس': 7500,
        'الحي السادس': 6750,
        // Centers (CAPMAS 2024)
        'فارسكور': 277577,
        'كفر سعد': 285104,
        'كفر البطيخ': 144531,
        'رأس البر': 0, // Not provided
        'مركز الزرقا': 152956,
        'شطا': 0 // Not provided
    };

    areaNamesEnglish = {
        'الحي الأول': 'First District',
        'الحي الثاني': 'Second District',
        'الحي الثالث': 'Third District',
        'الحي الرابع': 'Fourth District',
        'الحي الخامس': 'Fifth District',
        'الحي السادس': 'Sixth District',
        'فارسكور': 'Farskor',
        'كفر سعد': 'Kafr Saad',
        'كفر البطيخ': 'Kafr El-Bateekh',
        'رأس البر': 'Ras El Bar',
        'مركز الزرقا': 'El Zarqa Center',
        'شطا': 'Shata',
        'دمياط الجديدة': 'New Damietta',
        'دمياط القديمة': 'Damietta Old City'
    };

    areaPolygons = {
        // New Damietta Districts
        'الحي الأول': [
            [31.4348371, 31.6741321],
            [31.4346906, 31.6719005],
            [31.4247303, 31.6756771],
            [31.4285388, 31.6935299],
            [31.4298571, 31.6945598],
            [31.4384987, 31.6916416]
        ],
        'الحي الثاني': [
            [31.4503042, 31.6719010],
            [31.4499747, 31.6703561],
            [31.4393935, 31.6732743],
            [31.4437124, 31.6937015],
            [31.4542565, 31.6906116]
        ],
        'الحي الثالث': [
            [31.4352765, 31.6547344],
            [31.4393775, 31.6729305],
            [31.4505078, 31.6701839],
            [31.4469931, 31.6641758],
            [31.4442105, 31.6514728]
        ],
        'الحي الرابع': [
            [31.4304430, 31.6530178],
            [31.4203357, 31.6554210],
            [31.4247303, 31.6756771],
            [31.4346906, 31.6719005]
        ],
        'الحي الخامس': [
            [31.4304590, 31.6428045],
            [31.4286647, 31.6436199],
            [31.4310815, 31.6550354],
            [31.4440435, 31.6510013],
            [31.4425423, 31.6447357],
            [31.4432014, 31.6426328],
            [31.4423959, 31.6390279]
        ],
        'الحي السادس': [
            [31.4542565, 31.6906116],
            [31.4437124, 31.6937015],
            [31.4445927, 31.6978219],
            [31.4477048, 31.7016414],
            [31.4488763, 31.7016414],
            [31.4512926, 31.6983798],
            [31.4556492, 31.6972640]
        ],
        // Centers
        'فارسكور': [
            [31.3426462, 31.7159792],
            [31.3335559, 31.7126318],
            [31.3287905, 31.7116876],
            [31.3199188, 31.7042204],
            [31.3155193, 31.7104860],
            [31.3221918, 31.7160650],
            [31.3213119, 31.7211290],
            [31.3280573, 31.7229314],
            [31.3283506, 31.7208715],
            [31.3408869, 31.7237898]
        ],
        'كفر سعد': [
            [31.3487664, 31.6829330],
            [31.3516984, 31.6865379],
            [31.3686288, 31.6942626],
            [31.3690685, 31.6731483],
            [31.3567558, 31.6730625]
        ],
        'كفر البطيخ': [
            [31.4056303, 31.7191424],
            [31.3971323, 31.7160525],
            [31.3921503, 31.7486679],
            [31.3994766, 31.7479812],
            [31.4092930, 31.7524431],
            [31.4170575, 31.7637739],
            [31.4293621, 31.7541609],
            [31.4267256, 31.7284120],
            [31.4161781, 31.7206868]
        ],
        'رأس البر': [
            [31.4839168, 31.8226203],
            [31.4884548, 31.8246802],
            [31.4967982, 31.8282851],
            [31.5007502, 31.8308600],
            [31.5263604, 31.8442496],
            [31.5253361, 31.8415030],
            [31.5229949, 31.8397864],
            [31.5219706, 31.8370399],
            [31.5199219, 31.8358382],
            [31.5212389, 31.8342933],
            [31.5199219, 31.8344649],
            [31.5181659, 31.8332633],
            [31.5090926, 31.8160972],
            [31.5032383, 31.8082007],
            [31.4929925, 31.7855414],
            [31.4741081, 31.7918929]
        ],
        'مركز الزرقا': [
            [31.2423866, 31.6270871],
            [31.2463492, 31.6227955],
            [31.2454686, 31.6188473],
            [31.2417995, 31.6152424],
            [31.2341672, 31.6157574],
            [31.2265343, 31.6243405],
            [31.2227176, 31.6346402],
            [31.2169923, 31.6346402],
            [31.2114135, 31.6332669],
            [31.2067153, 31.6231389],
            [31.1937940, 31.5987629],
            [31.1644943, 31.6083759],
            [31.1940877, 31.6487164],
            [31.2046598, 31.6562696],
            [31.2122210, 31.6642947],
            [31.2188638, 31.6701316],
            [31.2407721, 31.6433950]
        ],
        'شطا': [
            [31.4131073, 31.8608579],
            [31.4070273, 31.8611154],
            [31.4080895, 31.8744191],
            [31.4101040, 31.8742904],
            [31.4125683, 31.8659541]
        ]
    };

    // ===============================
    // POINT IN POLYGON
    // ===============================

    isPointInPolygon(point, polygon) {
        const x = point.lon;
        const y = point.lat;
        let inside = false;

        for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
            const xi = polygon[i][1], yi = polygon[i][0];
            const xj = polygon[j][1], yj = polygon[j][0];

            const intersect = ((yi > y) !== (yj > y)) &&
                (x < (xj - xi) * (y - yi) / (yj - yi) + xi);

            if (intersect) inside = !inside;
        }

        return inside;
    }

    getPolygonForArea(area) {
        return this.areaPolygons[area] || null;
    }

    getPolygonCenter(polygon) {
        if (!polygon || polygon.length === 0) return null;

        let lat = 0, lon = 0;
        polygon.forEach(point => {
            lat += point[0];
            lon += point[1];
        });

        return {
            lat: lat / polygon.length,
            lon: lon / polygon.length
        };
    }

    // ===============================
    // INIT
    // ===============================

    async init() {

        this.initializeMap();
        this.setupEventListeners();
        
        // Load JSON data
        await this.jsonLoader.loadData();
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
    }

    // ===============================
    // SEARCH
    // ===============================

    async handleSearch() {

        const area =
            document.getElementById("area").value;

        const businessType =
            document.getElementById("businessType").value;

        const radius = 3000; // Default search radius in meters

        if (!area || !businessType) {

            this.showMessage(
                "Please select area and business type"
            );

            return;
        }

        this.showLoading(true);

        this.clearResults();

        try {

            await this.jsonLoader.loadData();

            const coordinates =
                await this.getCoordinates(area);

            let competitors =
                this.jsonLoader.getBusinesses(
                    area,
                    businessType
                );

            let usedRealData = false;

            // Force JSON-only data - no fallback to simulated data
            if (competitors.length === 0) {

                if (!this.jsonLoader.isLoaded()) {

                    this.showMessage(
                        "Error: Could not load data-new.json. Please ensure data-new.js exists in the same folder."
                    );

                    this.showLoading(false);
                    return;
                }

                // Continue even with no competitors - this is actually a good opportunity!
                console.log(`No ${businessType} competitors found in ${area} - Great opportunity!`);
            }

            usedRealData = true;

            console.log(
                `[Search] ${competitors.length} real competitors from JSON`
            );

            // Filter competitors within polygon if polygon exists for the area
            const polygon = this.getPolygonForArea(area);
            if (polygon) {
                console.log(`Filtering competitors within polygon for ${area}`);
                competitors = competitors.filter(comp => {
                    const lon = comp.lon ?? comp.lng;
                    return this.isPointInPolygon({ lat: comp.lat, lon }, polygon);
                });
                console.log(`[Search] ${competitors.length} competitors within polygon boundaries`);
            }

            competitors = competitors.map(comp => {

                const lon =
                    comp.lon ?? comp.lng;

                return {
                    ...comp,
                    lon,
                    type: businessType,
                    distance:
                        this.calculateDistance(
                            coordinates,
                            {
                                lat: comp.lat,
                                lon
                            }
                        )
                };
            });

            // JSON data = all competitors in selected area (without radius filtering)
            console.log(
                `[Search] Showing all ${competitors.length} JSON competitors for "${area}"`
            );

            this.lastDataSource = "data-new.json";

            const optimalLocation =
                this.calculateOptimalLocation(
                    coordinates,
                    competitors,
                    businessType,
                    radius,
                    area
                );

            const areaStats =
                this.jsonLoader.getAreaStats(area);

            this.displayResults(
                competitors,
                optimalLocation,
                coordinates,
                radius,
                usedRealData,
                area
            );

            this.updateDashboard(
                competitors,
                optimalLocation,
                area,
                areaStats
            );

            this.showDataSourceNotice(
                usedRealData,
                competitors.length
            );

        } catch (error) {

            console.error(error);

            this.showMessage(
                "An error occurred during analysis"
            );

        } finally {

            this.showLoading(false);
        }
    }

    // ===============================
    // REAL COORDINATES
    // ===============================

    async getCoordinates(area) {
        // First check if area has polygon data
        const polygon = this.getPolygonForArea(area);
        if (polygon) {
            const center = this.getPolygonCenter(polygon);
            console.log(`Using polygon center for ${area}:`, center);
            return center;
        }

        // Fallback to point coordinates for areas without polygons
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

            'ميناء دمياط': {
                lat: 31.459039737926723,
                lon: 31.754508993994946
            },

            'بحيرة المنزلة': {
                lat: 31.428304689439972,
                lon: 31.900627615541907
            },

            // =========================
            // Villages & Areas
            // =========================

            'الشيخ درغام': {
                lat: 31.483197482514413,
                lon: 31.835018174256838
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
    // LOCATION ANALYSIS (Smart Algorithm)
    // Close to residential + balanced distance from competitors
    // ===============================

    getIdealDistanceBand(businessType) {

        const bands = {

            cafe: {
                min: 280,
                ideal: 520,
                max: 900
            },

            restaurant: {
                min: 350,
                ideal: 650,
                max: 1100
            },

            pharmacy: {
                min: 400,
                ideal: 700,
                max: 1200
            },

            supermarket: {
                min: 450,
                ideal: 800,
                max: 1400
            },

            gym: {
                min: 500,
                ideal: 900,
                max: 1500
            },

            hotel: {
                min: 600,
                ideal: 1000,
                max: 1800
            },

            bakery: {
                min: 250,
                ideal: 450,
                max: 800
            },

            bookstore: {
                min: 300,
                ideal: 550,
                max: 950
            },

            hair_salon: {
                min: 250,
                ideal: 500,
                max: 850
            }
        };

        return bands[businessType]
            || {
                min: 300,
                ideal: 550,
                max: 1000
            };
    }

    getActivityHub(center, competitors) {

        if (!competitors.length) {

            return { ...center };
        }

        const n = competitors.length;

        const compCenter = {

            lat:
                competitors.reduce(
                    (s, c) => s + c.lat,
                    0
                ) / n,

            lon:
                competitors.reduce(
                    (s, c) => s + c.lon,
                    0
                ) / n
        };

        return {

            lat:
                center.lat * 0.5
                + compCenter.lat * 0.5,

            lon:
                center.lon * 0.5
                + compCenter.lon * 0.5
        };
    }

    getSearchRadius(hub, competitors, radius) {

        if (!competitors.length) {

            return Math.min(radius, 1200);
        }

        const maxDist =
            Math.max(
                ...competitors.map(c =>
                    this.calculateDistance(hub, c)
                )
            );

        return Math.min(
            radius,
            Math.max(700, maxDist + 500)
        );
    }

    gaussianScore(value, ideal, sigma) {

        const diff = value - ideal;

        return Math.exp(
            -(diff * diff)
            / (2 * sigma * sigma)
        ) * 100;
    }

    calculateOptimalLocation(
        center,
        competitors,
        businessType,
        radius,
        area
    ) {

        const residentialCenter = { ...center };

        const hub =
            this.getActivityHub(
                residentialCenter,
                competitors
            );

        const searchRadius =
            this.getSearchRadius(
                hub,
                competitors,
                radius
            );

        const band =
            this.getIdealDistanceBand(
                businessType
            );

        let bestScore = -1;

        let bestLocation = { ...hub };

        let bestAnalysis = {};

        const gridSteps = [50, 20];

        gridSteps.forEach((gridSize, pass) => {

            const origin =
                pass === 0
                    ? hub
                    : bestLocation;

            const span =
                pass === 0
                    ? searchRadius
                    : gridSize * 4;

            for (
                let latM = -span;
                latM <= span;
                latM += gridSize
            ) {

                for (
                    let lonM = -span;
                    lonM <= span;
                    lonM += gridSize
                ) {

                    if (
                        Math.sqrt(
                            latM * latM
                            + lonM * lonM
                        ) > span
                    ) {

                        continue;
                    }

                    const location = {

                        lat:
                            origin.lat
                            + latM / 111000,

                        lon:
                            origin.lon
                            + (
                                lonM
                                / (
                                    111000
                                    * Math.cos(
                                        origin.lat
                                        * Math.PI
                                        / 180
                                    )
                                )
                            )
                    };

                    const result =
                        this.scoreSmartLocation(
                            location,
                            residentialCenter,
                            hub,
                            competitors,
                            businessType,
                            band,
                            searchRadius
                        );

                    if (result.score > bestScore) {

                        bestScore = result.score;
                        bestLocation = location;
                        bestAnalysis = result.analysis;
                    }
                }
            }
        });

        const strategy =
            this.buildSmartStrategy(
                businessType,
                bestAnalysis,
                area
            );

        return {

            ...bestLocation,

            score: Math.round(bestScore),

            strategy,

            analysis: bestAnalysis
        };
    }

    scoreSmartLocation(
        location,
        residentialCenter,
        hub,
        competitors,
        businessType,
        band,
        searchRadius
    ) {

        const resDist =
            this.calculateDistance(
                location,
                residentialCenter
            );

        const hubDist =
            this.calculateDistance(
                location,
                hub
            );

        let residentialScore =
            this.gaussianScore(
                resDist,
                450,
                280
            );

        if (resDist > 2000) {

            residentialScore *= 0.4;
        }

        let competitorScore = 75;

        let avgCompDist = 0;

        let minCompDist = Infinity;

        if (competitors.length > 0) {

            const distances =
                competitors.map(c =>
                    this.calculateDistance(
                        location,
                        c
                    )
                );

            avgCompDist =
                distances.reduce(
                    (a, b) => a + b,
                    0
                ) / distances.length;

            minCompDist =
                Math.min(...distances);

            competitorScore =
                this.gaussianScore(
                    avgCompDist,
                    band.ideal,
                    160
                );

            if (minCompDist < 120) {

                competitorScore *= 0.25;

            } else if (minCompDist < 200) {

                competitorScore *= 0.55;
            }

            if (avgCompDist < band.min) {

                competitorScore *= 0.7;

            } else if (avgCompDist > band.max) {

                competitorScore *= 0.65;
            }
        }

        const hubLimit =
            searchRadius * 0.55;

        let centralityScore =
            Math.max(
                0,
                100
                - (hubDist / hubLimit) * 100
            );

        const total =
            residentialScore * 0.35
            + competitorScore * 0.45
            + centralityScore * 0.20;

        const score =
            Math.max(
                0,
                Math.min(100, total)
            );

        return {

            score,

            analysis: {

                residentialDist:
                    Math.round(resDist),

                avgCompetitorDist:
                    Math.round(avgCompDist),

                minCompetitorDist:
                    minCompDist === Infinity
                        ? 0
                        : Math.round(minCompDist),

                hubDist:
                    Math.round(hubDist),

                idealDistance:
                    band.ideal
            }
        };
    }

    buildSmartStrategy(
        businessType,
        analysis,
        area
    ) {

        const label =
            this.getBusinessTypeLabel(
                businessType
            );

        const areaEnglish = this.areaNamesEnglish[area] || area;

        return (
            `${label} in ${areaEnglish}: `
            + `${analysis.avgCompetitorDist || 0}m from competitors `
            + `(ideal: ${analysis.idealDistance || 550}m)`
        );
    }

    calculateAdvancedLocationScore(
        location,
        competitors,
        businessType,
        center
    ) {

        const band =
            this.getIdealDistanceBand(
                businessType
            );

        return this.scoreSmartLocation(
            location,
            center,
            center,
            competitors,
            businessType,
            band,
            2000
        ).score;
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
        radius,
        usedRealData = false,
        area = null
    ) {

        this.clearMarkers();

        // Display polygon if available for the area
        if (area) {
            const polygon = this.getPolygonForArea(area);
            if (polygon) {
                const population = this.areaPopulation[area] || 0;
                const areaEnglish = this.areaNamesEnglish[area] || area;
                const populationText = population > 0
                    ? `<div style="margin-top: 8px; padding-top: 8px; border-top: 1px solid #e0e0e0;">
                        <strong style="color: #4285F4;">👥 Population:</strong> ${population.toLocaleString()}
                       </div>`
                    : '';

                const polygonLayer = L.polygon(polygon, {
                    color: "#667eea",
                    fillColor: "#667eea",
                    fillOpacity: 0.1,
                    weight: 2
                }).addTo(this.map);

                polygonLayer.bindPopup(`
                    <div style="font-family: Arial, sans-serif; min-width: 180px;">
                        <div style="background: #4285F4; color: white; padding: 10px; border-radius: 6px; margin-bottom: 8px;">
                            <strong style="font-size: 13px;">${areaEnglish}</strong>
                        </div>
                        <div style="padding: 6px; font-size: 12px;">
                            <strong>Area Boundaries</strong>
                            ${populationText}
                        </div>
                    </div>
                `);
                this.polygonLayers.push(polygonLayer);
                console.log(`Added polygon layer for ${area}`);
            }
        }


        const avgRating =
            competitors.length > 0 ? this.averageRating(competitors) : 0;

        const nearbyCompetitors = competitors.filter(c => c.distance < 500).length;
        const competitionLevel = competitors.length === 0 ? "None"
                            : nearbyCompetitors === 0 ? "Very Low"
                            : nearbyCompetitors <= 2 ? "Low"
                            : nearbyCompetitors <= 5 ? "Medium"
                            : "High";

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
                <div style="font-family: Arial, sans-serif;">
                    <strong style="color: #333;">${comp.name}</strong>
                    <br>
                    <span style="color: #666;">Rating:</span>
                    <span style="color: ${comp.rating >= 4 ? '#34A853' : comp.rating >= 3 ? '#FBBC05' : '#EA4335'}; font-weight: bold;">
                        ${comp.rating || 'N/A'}
                    </span>
                    <br>
                    <span style="color: #666;">Distance:</span>
                    <span style="font-weight: bold;">${Math.round(comp.distance)}m</span>
                    ${comp.phone ? `<br><span style="color: #666;">Phone:</span> ${comp.phone}` : ''}
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

        const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${optimalLocation.lat},${optimalLocation.lon}`;

        optimalMarker.bindPopup(`
            <div style="font-family: Arial, sans-serif; min-width: 200px;">
                <div style="background: #4285F4; color: white; padding: 12px; border-radius: 8px; margin-bottom: 8px;">
                    <a href="${googleMapsUrl}" target="_blank" style="color: white; text-decoration: none;">
                        <strong style="font-size: 14px;">📍 Optimal Location</strong>
                    </a>
                </div>
                <div style="padding: 8px; font-size: 13px;">
                    <div style="margin-bottom: 6px;">
                        <strong>Score:</strong>
                        <span style="color: ${optimalLocation.score >= 70 ? '#34A853' : optimalLocation.score >= 50 ? '#FBBC05' : '#EA4335'}; font-weight: bold;">
                            ${optimalLocation.score}/100
                        </span>
                    </div>
                    <div style="margin-bottom: 6px;">
                        <strong>Competitors:</strong> ${competitors.length}
                    </div>
                    <div style="margin-bottom: 6px;">
                        <strong>Avg Rating:</strong> ${avgRating}/5
                    </div>
                    <div>
                        <strong>Competition:</strong>
                        <span style="color: ${competitionLevel === 'None' || competitionLevel === 'Low' || competitionLevel === 'Very Low' ? '#34A853' : competitionLevel === 'Medium' ? '#FBBC05' : '#EA4335'}; font-weight: bold;">
                            ${competitionLevel}
                        </span>
                    </div>
                    ${competitors.length === 0 ? `
                    <div style="background: #E8F5E9; padding: 8px; border-radius: 5px; margin-top: 8px; color: #2E7D32; font-weight: bold;">
                        ✨ No competitors of this type in the area!
                    </div>` : ''}
                </div>
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

    getBusinessIcon(businessType) {
        const icons = {
            cafe: '☕',
            restaurant: '🍽️',
            pharmacy: '💊',
            supermarket: '🛒',
            gym: '💪',
            hotel: '🏨',
            bakery: '🥐',
            bookstore: '📚',
            hair_salon: '💇',
            clothing: '👕'
        };
        return icons[businessType] || '📍';
    }

    createCompetitorIcon(comp) {
        const icon = this.getBusinessIcon(comp.type || 'cafe');
        const color = comp.isRelated ? "#FBBC05" : "#EA4335";

        return L.divIcon({
            html: `
                <div style="
                    position: relative;
                    width: 32px;
                    height: 32px;
                ">
                    <div style="
                        position: absolute;
                        width: 32px;
                        height: 32px;
                        background: ${color};
                        border-radius: 50% 50% 50% 0;
                        transform: rotate(-45deg);
                        border: 2px solid white;
                        box-shadow: 0 2px 6px rgba(0,0,0,0.3);
                    "></div>
                    <div style="
                        position: absolute;
                        top: 50%;
                        left: 50%;
                        transform: translate(-50%, -50%);
                        font-size: 16px;
                        z-index: 1;
                    ">${icon}</div>
                </div>
            `,
            className: "",
            iconSize: [32, 32]
        });
    }

    createOptimalIcon() {
        return L.divIcon({
            html: `
                <div style="
                    position: relative;
                    width: 40px;
                    height: 40px;
                ">
                    <div style="
                        position: absolute;
                        width: 40px;
                        height: 40px;
                        background: #34A853;
                        border-radius: 50% 50% 50% 0;
                        transform: rotate(-45deg);
                        border: 3px solid white;
                        box-shadow: 0 3px 10px rgba(0,0,0,0.4);
                    "></div>
                    <div style="
                        position: absolute;
                        top: 50%;
                        left: 50%;
                        transform: translate(-50%, -50%);
                        font-size: 20px;
                        z-index: 1;
                    ">⭐</div>
                </div>
            `,
            className: "",
            iconSize: [40, 40]
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

            cafe: "Cafe",

            restaurant: "Restaurant",

            pharmacy: "Pharmacy",

            supermarket: "Supermarket",

            gym: "Gym"
        };

        return labels[type] || "Business";
    }

    getBusinessStrategy(type) {

        const strategies = {

            cafe:
                "Optimal location: Fewer cafes in the area",

            restaurant:
                "Optimal location: Fewer restaurants in the area",

            pharmacy:
                "Optimal location: Fewer pharmacies in the area",

            supermarket:
                "Optimal location: Fewer supermarkets in the area",

            gym:
                "Optimal location: Fewer gyms in the area",

            hotel:
                "Optimal location: Fewer hotels in the area",

            clothing:
                "Optimal location: Fewer clothing stores in the area",

            bakery:
                "Optimal location: Fewer bakeries in the area",

            bookstore:
                "Optimal location: Fewer bookstores in the area",

            hair_salon:
                "Optimal location: Fewer hair salons in the area"
        };

        return (
            strategies[type]
            || "Optimal location: Fewer competitors in the area"
        );
    }

    updateDashboard(
        competitors,
        optimalLocation,
        area,
        areaStats
    ) {

        const compCount =
            document.getElementById("compCount");

        const optimalScore =
            document.getElementById("optimalScore");

        const avgRating =
            this.averageRating(competitors);
        
        // Ensure values are never zero or empty
        const safeCompetitors = competitors.length > 0 ? competitors : [{ distance: 0, rating: 0 }];
        const avgDistance = safeCompetitors.length > 0 
            ? Math.round(safeCompetitors.reduce((sum, c) => sum + (c.distance || 0), 0) / safeCompetitors.length)
            : 0;
        
        const nearbyCompetitors = safeCompetitors.filter(c => c.distance < 500).length;
        const nearbyPercentage = safeCompetitors.length > 0 
            ? Math.round((nearbyCompetitors / safeCompetitors.length) * 100)
            : 0;
        
        const highRatedCompetitors = safeCompetitors.filter(c => c.rating >= 4.0).length;
        const highRatedPercentage = safeCompetitors.length > 0 
            ? Math.round((highRatedCompetitors / safeCompetitors.length) * 100)
            : 0;

        if (compCount) {
            compCount.textContent = Math.max(1, competitors.length);
        }

        if (optimalScore) {
            optimalScore.textContent = optimalLocation.score || 50;
        }

        // Update additional statistics elements
        const avgRatingEl = document.getElementById("avgRating");
        if (avgRatingEl) {
            avgRatingEl.textContent = avgRating || 0;
        }

        const avgDistanceEl = document.getElementById("avgDistance");
        if (avgDistanceEl) {
            avgDistanceEl.textContent = (avgDistance || 0) + "m";
        }

        const nearbyCompEl = document.getElementById("nearbyComp");
        if (nearbyCompEl) {
            nearbyCompEl.textContent = `${nearbyCompetitors} `;
        }

        const highRatedEl = document.getElementById("highRated");
        if (highRatedEl) {
            highRatedEl.textContent = `${highRatedCompetitors} (${highRatedPercentage}%)`;
        }

        // Update old elements for backward compatibility
        const avgCompRatingEl = document.getElementById("avgCompRating");
        if (avgCompRatingEl) {
            avgCompRatingEl.textContent = avgRating || 0;
        }

        const avgCompRatingCardEl = document.getElementById("avgCompRatingCard");
        if (avgCompRatingCardEl) {
            avgCompRatingCardEl.textContent = avgRating || 0;
        }

        const compCountCardEl = document.getElementById("compCountCard");
        if (compCountCardEl) {
            compCountCardEl.textContent = Math.max(1, competitors.length);
        }

        const marketDensityEl = document.getElementById("marketDensity");
        if (marketDensityEl) {
            const density = nearbyCompetitors === 0 ? "Very Low" 
                          : nearbyCompetitors <= 2 ? "Low"
                          : nearbyCompetitors <= 5 ? "Medium"
                          : "High";
            marketDensityEl.textContent = density;
        }

        const strategyEl =
            document.getElementById("strategy");

        if (strategyEl) {

            strategyEl.textContent =
                optimalLocation.strategy || "Optimal location strategy to be determined";
        }

        const progressBars =
            document.querySelectorAll(
                ".progress-fill"
            );

        if (progressBars.length >= 2) {

            progressBars[0].style.width =
                Math.min(
                    100,
                    Math.max(10, competitors.length * 8)
                ) + "%";

            progressBars[1].style.width =
                Math.max(10, optimalLocation.score || 50) + "%";
        }

        if (
            typeof window.updateRealAnalysisCharts
            === "function"
            && areaStats
        ) {

            window.updateRealAnalysisCharts({
                area,
                competitors,
                areaStats,
                optimalLocation,
                businessType:
                    document.getElementById(
                        "businessType"
                    )?.value
            });
        }

        // Log professional analysis to console
        console.log("=== Professional Competition Analysis ===");
        console.log(`Total competitors: ${competitors.length}`);
        console.log(`Average rating: ${avgRating}/5`);
        console.log(`Average distance: ${avgDistance}m`);
        console.log(`Nearby competitors (<500m): ${nearbyCompetitors} `);
        console.log(`High-rated competitors (≥4): ${highRatedCompetitors} (${highRatedPercentage}%)`);
        console.log(`Optimal location score: ${optimalLocation.score}/100`);
        console.log(`Strategy: ${optimalLocation.strategy}`);
        console.log("==============================");
    }

    clearMarkers() {

        this.markers.forEach(marker => {

            this.map.removeLayer(marker);
        });

        this.markers = [];

        if (this.mapLayers.length) {

            this.mapLayers.forEach(layer => {

                this.map.removeLayer(layer);
            });

            this.mapLayers = [];
        }

        this.clearPolygonLayers();
    }

    clearPolygonLayers() {
        if (this.polygonLayers.length) {
            this.polygonLayers.forEach(layer => {
                this.map.removeLayer(layer);
            });
            this.polygonLayers = [];
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

    averageRating(competitors) {

        const rated =
            competitors.filter(
                c =>
                    c.rating != null
                    && c.rating > 0
            );

        if (rated.length === 0) {

            return "—";
        }

        return (
            rated.reduce(
                (sum, c) => sum + c.rating,
                0
            ) / rated.length
        ).toFixed(1);
    }

    showMessage(message) {

        alert(message);
    }

    showDataSourceNotice(usedRealData, count) {

        const box =
            document.getElementById("successMessage");

        if (!box) {

            return;
        }

        const text =
            box.querySelector("p");

        if (usedRealData) {

            if (text) {

                text.textContent =
                    `Loaded ${count} competitors from data-new.json`;
            }

            box.classList.remove("hidden");

        } else {

            if (text) {

                text.textContent =
                    "No data found in file — using experimental data";
            }

            box.classList.remove("hidden");
            box.style.borderColor = "#dc3545";
        }
    }
}

// ===============================
// START APP
// ===============================

document.addEventListener(
    "DOMContentLoaded",
    async () => {

        const analyzer = new GooglePlacesDamiettaAnalyzer();
    }
);
