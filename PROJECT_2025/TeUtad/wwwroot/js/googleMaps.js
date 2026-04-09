// Google Maps JavaScript Integration for TeUtad
// Helyezd el: wwwroot/js/googleMaps.js

let map;
let markers = [];
let directionsService;
let directionsRenderer;
let autocompleteService;
let placesService;

// ✅ TRANSIT CACHE - Megoldás az adatok eltérésére
// Kulcs: "fromLat,fromLng_toLat,toLng"
// Érték: { transitDetails, timestamp }
let transitCache = {};
const CACHE_EXPIRY_MS = 30 * 60 * 1000; // 30 perc

/**
 * Térkép inicializálása
 * @param {Array} routePoints - Útvonalpontok tömbje
 * @param {string} mapElementId - Térkép div ID-ja
 */
window.initMap = function(routePoints, mapElementId = 'map') {
    const mapElement = document.getElementById(mapElementId);
    if (!mapElement) {
        console.error('Map element not found:', mapElementId);
        return;
    }

    // Alapértelmezett központ: Budapest
    const center = routePoints.length > 0 
        ? { lat: routePoints[0].latitude, lng: routePoints[0].longitude }
        : { lat: 47.4979, lng: 19.0402 };

    // Térkép létrehozása
    map = new google.maps.Map(mapElement, {
        zoom: 13,
        center: center,
        mapTypeControl: true,
        streetViewControl: false,
        fullscreenControl: true,
        styles: [
            {
                featureType: "poi",
                elementType: "labels",
                stylers: [{ visibility: "off" }]
            }
        ]
    });

    // Services inicializálása
    directionsService = new google.maps.DirectionsService();
    directionsRenderer = new google.maps.DirectionsRenderer({
        map: map,
        suppressMarkers: true,
        polylineOptions: {
            strokeColor: '#0d6efd',
            strokeWeight: 4
        }
    });
    placesService = new google.maps.places.PlacesService(map);

    // Markerek hozzáadása
    if (routePoints.length > 0) {
        addMarkersToMap(routePoints);
        
        if (routePoints.length > 1) {
            drawRoute(routePoints);
        }
    }
    
    console.log('Map initialized successfully');
}

/**
 * Markerek hozzáadása a térképhez
 */
function addMarkersToMap(routePoints) {
    clearMarkers();

    routePoints.forEach((point, index) => {
        // UGYANAZ a színgenerálás mint a C#-ban
        const order = index + 1;
        const totalPoints = routePoints.length;
        const hue = (order * 360 / Math.max(totalPoints, 1)) % 360;
        const markerColor = `hsl(${hue}, 70%, 45%)`;
        
        const marker = new google.maps.Marker({
            position: { lat: point.latitude, lng: point.longitude },
            map: map,
            title: point.attractionName,
            label: {
                text: order.toString(),
                color: 'white',
                fontSize: '14px',
                fontWeight: 'bold'
            },
            icon: {
                path: google.maps.SymbolPath.CIRCLE,
                scale: 20,
                fillColor: markerColor,  // ✅ HSL szín
                fillOpacity: 1,
                strokeColor: 'white',
                strokeWeight: 3
            }
        });

        // Info ablak
        const infoWindow = new google.maps.InfoWindow({
            content: `
                <div style="padding: 10px; font-family: 'Nunito', sans-serif;">
                    <h6 style="margin: 0 0 5px 0; font-weight: bold;">${point.attractionName}</h6>
                    <p style="margin: 0; font-size: 0.9em; color: #666;">${point.address}</p>
                    <p style="margin: 5px 0 0 0; font-size: 0.85em;">
                        ⏰ ${point.startTime} - ${point.endTime}
                    </p>
                </div>
            `
        });

        marker.addListener('click', () => {
            infoWindow.open(map, marker);
        });

        markers.push(marker);
    });

    // Zoom a markerekhez
    if (markers.length > 0) {
        const bounds = new google.maps.LatLngBounds();
        markers.forEach(marker => bounds.extend(marker.getPosition()));
        map.fitBounds(bounds);
        
        // Ha csak 1 marker van, ne zoom-oljon túl közel
        if (markers.length === 1) {
            map.setZoom(14);
        }
    }
}

/**
 * Útvonal rajzolása a pontok között
 * @param {Array} routePoints - Útvonalpontok (kell: travelModeToNext mező)
 */
function drawRoute(routePoints) {
    if (routePoints.length < 2) return;

    // Töröljük az előző útvonalat
    if (directionsRenderer) {
        directionsRenderer.setMap(null);
    }

    // Új renderer minden szakaszhoz
    const waypoints = routePoints.slice(1, -1).map(point => ({
        location: { lat: point.latitude, lng: point.longitude },
        stopover: true
    }));

    // Az első pont közlekedési módját használjuk (később ezt lehet finomítani szakaszonként)
    const travelMode = routePoints[0].travelModeToNext || 'WALKING';
    const googleTravelMode = {
        'DRIVING': google.maps.TravelMode.DRIVING,
        'WALKING': google.maps.TravelMode.WALKING,
        'BICYCLING': google.maps.TravelMode.BICYCLING,
        'TRANSIT': google.maps.TravelMode.TRANSIT
    }[travelMode] || google.maps.TravelMode.WALKING;

    const request = {
        origin: { lat: routePoints[0].latitude, lng: routePoints[0].longitude },
        destination: { lat: routePoints[routePoints.length - 1].latitude, lng: routePoints[routePoints.length - 1].longitude },
        waypoints: waypoints,
        travelMode: googleTravelMode,
        optimizeWaypoints: false
    };

    // Új DirectionsRenderer a kiválasztott móddal
    directionsRenderer = new google.maps.DirectionsRenderer({
        map: map,
        suppressMarkers: true,
        polylineOptions: {
            strokeColor: getColorForTravelMode(travelMode),
            strokeWeight: 4,
            strokeOpacity: 0.7
        }
    });

    directionsService.route(request, (result, status) => {
        if (status === 'OK') {
            directionsRenderer.setDirections(result);
            
            // ✅ ÚTVONAL RÉSZLETEK MEGJELENÍTÉSE
            displayRouteDetails(result, travelMode);
            
            console.log('Route drawn successfully with mode:', travelMode);
        } else {
            console.error('Directions request failed:', status);
        }
    });
}

/**
 * Útvonal részletek megjelenítése a térkép alatt
 */
function displayRouteDetails(directionsResult, travelMode) {
    const panel = document.getElementById('route-details-panel');
    const content = document.getElementById('route-details-content');
    
    if (!panel || !content) {
        console.warn('Route details panel not found');
        return;
    }
    
    // Panel láthatóvá tétele
    panel.style.display = 'block';
    
    // Tartalom törlése
    content.innerHTML = '';
    
    // Útvonal lábak (legs) iterálása
    const route = directionsResult.routes[0];
    let html = '';
    
    route.legs.forEach((leg, legIndex) => {
        html += `
            <div class="mb-3 pb-2 border-bottom">
                <div class="fw-bold text-primary mb-1">
                    ${legIndex + 1}. szakasz: ${leg.start_address} → ${leg.end_address}
                </div>
                <div class="small">
                    <i class="bi bi-clock me-1"></i>${leg.duration.text} 
                    <i class="bi bi-geo-alt ms-2 me-1"></i>${leg.distance.text}
                </div>
        `;
        
        // Ha TRANSIT mód, részletes lépések
        if (travelMode === 'TRANSIT' && leg.steps) {
            html += '<div class="mt-2 ms-3 small">';
            leg.steps.forEach((step, stepIndex) => {
                if (step.travel_mode === 'TRANSIT' && step.transit) {
                    const transit = step.transit;
                    const vehicle = transit.line.vehicle;
                    html += `
                        <div class="mb-2">
                            <strong>${getTransitIcon(vehicle.type)} ${transit.line.short_name || transit.line.name}</strong>
                            <div class="ms-3 text-muted">
                                <div>🚏 ${transit.departure_stop.name} (${transit.departure_time.text})</div>
                                <div>🚏 ${transit.arrival_stop.name} (${transit.arrival_time.text})</div>
                                <div>📍 ${transit.num_stops} megálló • ${step.duration.text}</div>
                            </div>
                        </div>
                    `;
                } else if (step.travel_mode === 'WALKING') {
                    html += `<div class="text-muted">🚶 Gyalog ${step.distance.text} (${step.duration.text})</div>`;
                }
            });
            html += '</div>';
        }
        
        html += '</div>';
    });
    
    content.innerHTML = html;
}

/**
 * Transit ikon helper
 */
function getTransitIcon(vehicleType) {
    const icons = {
        'BUS': '🚌',
        'SUBWAY': '🚇',
        'TRAM': '🚊',
        'RAIL': '🚆',
        'FERRY': '⛴️'
    };
    return icons[vehicleType] || '🚌';
}

/**
 * Szín meghatározása közlekedési mód alapján
 */
function getColorForTravelMode(mode) {
    const colors = {
        'DRIVING': '#0d6efd',    // Kék - autó
        'WALKING': '#28a745',    // Zöld - gyalog
        'BICYCLING': '#17a2b8',  // Ciánkék - kerékpár
        'TRANSIT': '#ffc107'     // Sárga - tömegközlekedés
    };
    return colors[mode] || '#0d6efd';
}


/**
 * Markerek törlése
 */
function clearMarkers() {
    markers.forEach(marker => marker.setMap(null));
    markers = [];
}

/**
 * Térkép frissítése új útvonalpontokkal
 */
window.updateMap = function(routePoints) {
    if (!map) {
        console.warn('Map not initialized');
        return;
    }
    
    // Ellenőrizzük hogy tömb-e
    if (!Array.isArray(routePoints)) {
        console.error('routePoints is not an array:', routePoints);
        return;
    }
    
    addMarkersToMap(routePoints);
    
    if (routePoints.length > 1) {
        drawRoute(routePoints);
    }
}

/**
 * Szakaszos útvonalrajzolás - minden szakasz más színnel
 * (Opcionális verzió - jelenleg nincs használva)
 */
window.drawSegmentedRoute = function(routePoints) {
    if (routePoints.length < 2) return;

    // Minden egyes szakaszhoz külön DirectionsRenderer
    for (let i = 0; i < routePoints.length - 1; i++) {
        const origin = { lat: routePoints[i].latitude, lng: routePoints[i].longitude };
        const destination = { lat: routePoints[i + 1].latitude, lng: routePoints[i + 1].longitude };
        const travelMode = routePoints[i].travelModeToNext || 'WALKING';
        
        const googleTravelMode = {
            'DRIVING': google.maps.TravelMode.DRIVING,
            'WALKING': google.maps.TravelMode.WALKING,
            'BICYCLING': google.maps.TravelMode.BICYCLING,
            'TRANSIT': google.maps.TravelMode.TRANSIT
        }[travelMode] || google.maps.TravelMode.WALKING;

        const renderer = new google.maps.DirectionsRenderer({
            map: map,
            suppressMarkers: true,
            preserveViewport: true,
            polylineOptions: {
                strokeColor: getColorForTravelMode(travelMode),
                strokeWeight: 4,
                strokeOpacity: 0.7
            }
        });

        const request = {
            origin: origin,
            destination: destination,
            travelMode: googleTravelMode
        };

        directionsService.route(request, (result, status) => {
            if (status === 'OK') {
                renderer.setDirections(result);
            }
        });
    }
}


/**
 * Autocomplete inicializálása egy input mezőhöz
 * @param {string} inputId - Input mező ID-ja
 * @param {object} dotNetHelper - .NET object reference a callback-hez
 */
window.initAutocomplete = function(inputId, dotNetHelper) {
    const input = document.getElementById(inputId);
    if (!input) {
        console.error('Input element not found:', inputId);
        return;
    }

    // Autocomplete beállítása
    const autocomplete = new google.maps.places.Autocomplete(input, {
        componentRestrictions: { country: 'hu' },
        fields: ['name', 'formatted_address', 'geometry', 'place_id'],
        types: ['establishment', 'geocode']
    });

    // Amikor kiválaszt egy helyet
    autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        
        if (!place.geometry || !place.geometry.location) {
            console.error('No geometry for place');
            return;
        }

        // Vissza C#-ba az adatokkal
        dotNetHelper.invokeMethodAsync('OnPlaceSelected', {
            name: place.name || '',
            address: place.formatted_address || '',
            latitude: place.geometry.location.lat(),
            longitude: place.geometry.location.lng(),
            placeId: place.place_id || ''
        });

        // Térkép központosítása
        if (map) {
            map.setCenter(place.geometry.location);
            map.setZoom(15);
        }

        console.log('Place selected:', place.name);
    });

    console.log('Autocomplete initialized for input:', inputId);
}

/**
 * Geocoding - cím -> koordináták
 */
window.geocodeAddress = async function(address) {
    const geocoder = new google.maps.Geocoder();
    
    return new Promise((resolve, reject) => {
        geocoder.geocode({ address: address }, (results, status) => {
            if (status === 'OK' && results[0]) {
                resolve({
                    latitude: results[0].geometry.location.lat(),
                    longitude: results[0].geometry.location.lng(),
                    formattedAddress: results[0].formatted_address
                });
            } else {
                reject('Geocoding failed: ' + status);
            }
        });
    });
}

/**
 * Hely részleteinek lekérése Place ID alapján
 */
window.getPlaceDetails = async function(placeId) {
    return new Promise((resolve, reject) => {
        if (!placesService) {
            reject('Places service not initialized');
            return;
        }

        placesService.getDetails({
            placeId: placeId,
            fields: ['name', 'formatted_address', 'geometry', 'rating', 
                     'photos', 'opening_hours', 'website', 'formatted_phone_number']
        }, (place, status) => {
            if (status === google.maps.places.PlacesServiceStatus.OK) {
                resolve({
                    name: place.name,
                    address: place.formatted_address,
                    latitude: place.geometry.location.lat(),
                    longitude: place.geometry.location.lng(),
                    rating: place.rating || 0,
                    website: place.website || '',
                    phone: place.formatted_phone_number || '',
                    isOpen: place.opening_hours ? place.opening_hours.isOpen() : null,
                    photoUrl: place.photos && place.photos.length > 0 
                        ? place.photos[0].getUrl({ maxWidth: 400 }) 
                        : null
                });
            } else {
                reject('Place details failed: ' + status);
            }
        });
    });
}

/**
 * Utazási mód beállítása
 */
let currentTravelMode = 'WALKING';

window.setTravelMode = function(mode) {
    currentTravelMode = mode;
    console.log('Travel mode set to:', mode);
}

/**
 * Térkép központosítása egy koordinátára
 */
window.centerMap = function(latitude, longitude, zoom = 14) {
    if (!map) {
        console.warn('Map not initialized');
        return;
    }
    
    map.setCenter({ lat: latitude, lng: longitude });
    map.setZoom(zoom);
}

/**
 * Utazási idő és távolság számítása két pont között
 * @param {number} fromLat - Kiindulási pont szélesség
 * @param {number} fromLng - Kiindulási pont hosszúság
 * @param {number} toLat - Cél pont szélesség
 * @param {number} toLng - Cél pont hosszúság
 * @param {string} travelMode - Közlekedési mód (DRIVING, WALKING, BICYCLING, TRANSIT)
 * @returns {Promise<object>} - { duration: "15 perc", distance: "1.2 km", durationMinutes: 15 }
 */
window.calculateTravelTime = function(fromLat, fromLng, toLat, toLng, travelMode) {
    return new Promise((resolve, reject) => {
        if (!google || !google.maps) {
            reject('Google Maps not loaded');
            return;
        }

        const service = new google.maps.DistanceMatrixService();
        
        const origin = new google.maps.LatLng(fromLat, fromLng);
        const destination = new google.maps.LatLng(toLat, toLng);

        const request = {
            origins: [origin],
            destinations: [destination],
            travelMode: google.maps.TravelMode[travelMode],
            unitSystem: google.maps.UnitSystem.METRIC,
            avoidHighways: false,
            avoidTolls: false
        };

        service.getDistanceMatrix(request, (response, status) => {
            if (status === 'OK') {
                const result = response.rows[0].elements[0];
                
                if (result.status === 'OK') {
                    const durationSeconds = result.duration.value;
                    const durationMinutes = Math.ceil(durationSeconds / 60);
                    const distanceMeters = result.distance.value;
                    
                    // Formázás
                    let durationText;
                    if (durationMinutes < 60) {
                        durationText = `${durationMinutes} perc`;
                    } else {
                        const hours = Math.floor(durationMinutes / 60);
                        const mins = durationMinutes % 60;
                        durationText = mins > 0 ? `${hours}ó ${mins}p` : `${hours} óra`;
                    }

                    let distanceText;
                    if (distanceMeters < 1000) {
                        distanceText = `${distanceMeters} m`;
                    } else {
                        const km = (distanceMeters / 1000).toFixed(1);
                        distanceText = `${km} km`;
                    }

                    const travelInfo = {
                        duration: durationText,
                        distance: distanceText,
                        durationMinutes: durationMinutes,
                        transitDetails: null
                    };

                    // Ha tömegközlekedés, további részletek kérése
                    if (travelMode === 'TRANSIT') {
                        // ✅ CACHE KULCS GENERÁLÁSA
                        const cacheKey = `${fromLat.toFixed(6)},${fromLng.toFixed(6)}_${toLat.toFixed(6)},${toLng.toFixed(6)}`;
                        
                        // Ellenőrizzük van-e cache-elt adat
                        const cached = transitCache[cacheKey];
                        const now = Date.now();
                        
                        if (cached && (now - cached.timestamp) < CACHE_EXPIRY_MS) {
                            // ✅ CACHE TALÁLAT - használjuk a mentett adatokat
                            console.log('🔄 Transit cache hit:', cacheKey);
                            travelInfo.transitDetails = cached.transitDetails;
                            resolve(travelInfo);
                        } else {
                            // ❌ NINCS CACHE - új lekérdezés
                            console.log('🆕 Transit cache miss, fetching new data...');
                            getTransitDetails(origin, destination).then(transitDetails => {
                                // Mentés cache-be
                                transitCache[cacheKey] = {
                                    transitDetails: transitDetails,
                                    timestamp: now
                                };
                                console.log('💾 Transit data cached:', cacheKey);
                                
                                travelInfo.transitDetails = transitDetails;
                                resolve(travelInfo);
                            }).catch(() => {
                                // Ha nem sikerül, visszaadjuk részletek nélkül
                                resolve(travelInfo);
                            });
                        }
                    } else {
                        resolve(travelInfo);
                    }
                } else {
                    console.warn(`Route not available for ${travelMode}: ${result.status}`);
                    resolve({
                        duration: "N/A",
                        distance: "N/A",
                        durationMinutes: 999999,
                        transitDetails: null
                    });
                }
            } else {
                console.error('Distance Matrix request failed:', status);
                reject('Distance calculation failed: ' + status);
            }
        });
    });
}

/**
 * Tömegközlekedési részletek lekérése Directions API-val
 */
function getTransitDetails(origin, destination) {
    return new Promise((resolve, reject) => {
        const directionsService = new google.maps.DirectionsService();
        
        directionsService.route({
            origin: origin,
            destination: destination,
            travelMode: google.maps.TravelMode.TRANSIT,
            transitOptions: {
                departureTime: new Date(Date.now() + 3600000) // 1 óra múlva
            }
        }, (result, status) => {
            if (status === 'OK' && result.routes.length > 0) {
                const route = result.routes[0];
                const leg = route.legs[0];
                
                const steps = leg.steps.map(step => {
                    if (step.travel_mode === 'TRANSIT') {
                        const transit = step.transit;
                        return {
                            travelMode: 'TRANSIT',
                            vehicleType: transit.line.vehicle.type,
                            lineName: transit.line.short_name || transit.line.name,
                            headSign: transit.headsign,
                            departureStop: transit.departure_stop.name,
                            arrivalStop: transit.arrival_stop.name,
                            departureTime: transit.departure_time.text,
                            arrivalTime: transit.arrival_time.text,
                            numStops: transit.num_stops,
                            duration: step.duration.text,
                            distance: step.distance.text
                        };
                    } else {
                        return {
                            travelMode: 'WALKING',
                            duration: step.duration.text,
                            distance: step.distance.text
                        };
                    }
                });
                
                resolve({ steps: steps });
            } else {
                reject('Transit details not available');
            }
        });
    });
}

/**
 * Nyitvatartási idő lekérése Place ID alapján
 */
window.getPlaceOpeningHours = async function(placeId) {
    return new Promise((resolve, reject) => {
        if (!placesService) {
            reject('Places service not initialized');
            return;
        }

        placesService.getDetails({
            placeId: placeId,
            fields: ['opening_hours']
        }, (place, status) => {
            if (status === google.maps.places.PlacesServiceStatus.OK && place.opening_hours) {
                const openingHours = place.opening_hours;
                
                const result = {
                    openingHoursText: openingHours.weekday_text ? 
                        openingHours.weekday_text.join('\n') : null,
                    isOpenNow: openingHours.isOpen ? openingHours.isOpen() : null,
                    openingPeriods: openingHours.periods ? openingHours.periods.map(period => ({
                        open: {
                            day: period.open.day,
                            hours: period.open.hours,
                            minutes: period.open.minutes
                        },
                        close: period.close ? {
                            day: period.close.day,
                            hours: period.close.hours,
                            minutes: period.close.minutes
                        } : null
                    })) : null
                };
                
                resolve(result);
            } else {
                resolve(null);
            }
        });
    });
}

// Debug segédfüggvény
window.checkGoogleMapsLoaded = function() {
    console.log('Google Maps loaded:', typeof google !== 'undefined');
    console.log('Map initialized:', map !== null);
    console.log('Markers count:', markers.length);
}

/**
 * Egyszerű autocomplete Index oldalhoz (csak city/address szöveg, nincs callback)
 * @param {string} inputId - Input mező ID-ja
 */
window.initSimpleAutocomplete = function(inputId) {
    const input = document.getElementById(inputId);
    if (!input) {
        console.error('Input element not found:', inputId);
        return;
    }

    // Autocomplete beállítása - CSAK városok és címek
    const autocomplete = new google.maps.places.Autocomplete(input, {
        types: ['(cities)'], // Csak városok
        fields: ['name', 'formatted_address']
    });

    // Amikor kiválaszt egy helyet, betöltjük az input mezőbe
    autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        
        if (!place || !place.name) {
            console.warn('No place selected');
            return;
        }

        // Az input mező értékét automatikusan beállítja az autocomplete
        // Nem kell manuálisan frissíteni, mert @bind:event="oninput" figyel rá
        console.log(`✅ Autocomplete selected: ${place.name || place.formatted_address}`);
    });

    console.log(`✅ Simple autocomplete initialized for: ${inputId}`);
}

/**
 * Transit cache törlése (manuális frissítéshez)
 */
window.clearTransitCache = function() {
    transitCache = {};
    console.log('🗑️ Transit cache cleared');
}

/**
 * Transit cache állapotának lekérdezése (debug célra)
 */
window.getTransitCacheInfo = function() {
    const keys = Object.keys(transitCache);
    console.log(`📦 Transit cache entries: ${keys.length}`);
    keys.forEach(key => {
        const age = Date.now() - transitCache[key].timestamp;
        console.log(`  ${key}: ${Math.floor(age / 1000)}s ago`);
    });
    return transitCache;
}
