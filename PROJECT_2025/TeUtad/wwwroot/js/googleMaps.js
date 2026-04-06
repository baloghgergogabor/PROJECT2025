// Google Maps JavaScript Integration for TeUtad
// Helyezd el: wwwroot/js/googleMaps.js

let map;
let markers = [];
let directionsService;
let directionsRenderer;
let autocompleteService;
let placesService;

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
        const marker = new google.maps.Marker({
            position: { lat: point.latitude, lng: point.longitude },
            map: map,
            title: point.attractionName,
            label: {
                text: (index + 1).toString(),
                color: 'white',
                fontSize: '14px',
                fontWeight: 'bold'
            },
            icon: {
                path: google.maps.SymbolPath.CIRCLE,
                scale: 20,
                fillColor: index === 0 ? '#28a745' : (index === routePoints.length - 1 ? '#dc3545' : '#0d6efd'),
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
 */
function drawRoute(routePoints) {
    if (routePoints.length < 2) return;

    const waypoints = routePoints.slice(1, -1).map(point => ({
        location: { lat: point.latitude, lng: point.longitude },
        stopover: true
    }));

    const request = {
        origin: { lat: routePoints[0].latitude, lng: routePoints[0].longitude },
        destination: { lat: routePoints[routePoints.length - 1].latitude, lng: routePoints[routePoints.length - 1].longitude },
        waypoints: waypoints,
        travelMode: google.maps.TravelMode.WALKING,
        optimizeWaypoints: false
    };

    directionsService.route(request, (result, status) => {
        if (status === 'OK') {
            directionsRenderer.setDirections(result);
            console.log('Route drawn successfully');
        } else {
            console.error('Directions request failed:', status);
        }
    });
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

// Debug segédfüggvény
window.checkGoogleMapsLoaded = function() {
    console.log('Google Maps loaded:', typeof google !== 'undefined');
    console.log('Map initialized:', map !== null);
    console.log('Markers count:', markers.length);
}
