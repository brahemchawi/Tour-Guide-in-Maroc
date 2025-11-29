import React, { useEffect, useRef, useState } from 'react';
import { LocationData, GroundingChunk, Language } from '../types';
import { translations } from '../translations';

// Declaration for Leaflet global
declare const L: any;

interface MapViewProps {
  userLocation?: LocationData;
  groundingChunks: GroundingChunk[];
  language: Language;
}

interface MapMarker {
  lat: number;
  lng: number;
  title: string;
}

const MapView: React.FC<MapViewProps> = ({ userLocation, groundingChunks, language }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersGroupRef = useRef<any>(null);
  const userMarkerRef = useRef<any>(null);
  
  const [poiMarkers, setPoiMarkers] = useState<MapMarker[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Helper for translations
  const t = translations[language] || translations['en'];

  // Initialize Map
  useEffect(() => {
    // Safety check for container
    if (!mapContainerRef.current) return;
    
    // Prevent double initialization
    if (mapInstanceRef.current) {
        mapInstanceRef.current.invalidateSize();
        return;
    }

    try {
        // Default to a central location (Morocco center) if no user location
        const defaultLat = 31.7917;
        const defaultLng = -7.0926;
        
        const initialLat = userLocation?.latitude || defaultLat;
        const initialLng = userLocation?.longitude || defaultLng;
        const initialZoom = userLocation ? 15 : 6;

        const map = L.map(mapContainerRef.current, {
          zoomControl: false 
        }).setView([initialLat, initialLng], initialZoom);

        L.control.zoom({ position: 'topleft' }).addTo(map);

        L.control.scale({ imperial: false, position: 'bottomright' }).addTo(map);

        // Use OpenStreetMap Standard Layer
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; OpenStreetMap contributors',
          maxZoom: 19
        }).addTo(map);

        mapInstanceRef.current = map;
        markersGroupRef.current = L.featureGroup().addTo(map);

        setTimeout(() => {
          map.invalidateSize();
        }, 100);
    } catch (e) {
        console.error("Error initializing map", e);
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []); 

  // Handle Resize / View Change
  useEffect(() => {
    if (mapInstanceRef.current) {
      setTimeout(() => {
        mapInstanceRef.current.invalidateSize();
      }, 300);
    }
  }, [userLocation, groundingChunks]);

  // Update User Location Marker
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    const map = mapInstanceRef.current;
    
    if (userMarkerRef.current) {
      map.removeLayer(userMarkerRef.current);
    }
    
    const isDefault = !userLocation;
    const lat = userLocation?.latitude ?? 31.7917;
    const lng = userLocation?.longitude ?? -7.0926;
    const popupText = isDefault ? t.map.defaultLocation : t.map.yourLocation;
    const color = isDefault ? "#64748b" : "#059669"; // Slate vs Emerald (Green)

    // Custom Icon for User or Default Location
    const userIcon = L.divIcon({
      className: isDefault ? 'default-location-marker' : 'custom-user-marker',
      html: `<div style="
        width: 20px; 
        height: 20px; 
        background-color: ${color}; 
        border: 3px solid white; 
        border-radius: 50%; 
        box-shadow: 0 0 10px rgba(0,0,0,0.3);
        position: relative;
      ">
        ${!isDefault ? `<div style="
          content: '';
          position: absolute;
          top: -10px; left: -10px; right: -10px; bottom: -10px;
          background-color: rgba(5, 150, 105, 0.3);
          border-radius: 50%;
          animation: pulse 2s infinite;
        "></div>` : ''}
      </div>`,
      iconSize: [20, 20],
      iconAnchor: [10, 10]
    });

    if (!document.getElementById('map-styles')) {
      const style = document.createElement('style');
      style.id = 'map-styles';
      style.innerHTML = `
        @keyframes pulse {
          0% { transform: scale(0.5); opacity: 1; }
          100% { transform: scale(1.5); opacity: 0; }
        }
      `;
      document.head.appendChild(style);
    }

    const marker = L.marker([lat, lng], { icon: userIcon })
      .addTo(map)
      .bindPopup(popupText);
    
    userMarkerRef.current = marker;
      
    if (poiMarkers.length === 0) {
      map.setView([lat, lng], isDefault ? 6 : 15);
    }

  }, [userLocation, language, poiMarkers.length, t.map.defaultLocation, t.map.yourLocation]); 

  // Fetch Coordinates for POIs
  useEffect(() => {
    let isMounted = true; 

    const fetchCoordinates = async () => {
      if (!groundingChunks || groundingChunks.length === 0) {
        if(isMounted) setPoiMarkers([]);
        return;
      }

      const firstTitle = groundingChunks[0]?.maps?.title;
      // Simple cache check based on first item title and length
      if (poiMarkers.length > 0 && poiMarkers[0].title === firstTitle && poiMarkers.length === groundingChunks.length) {
        return; 
      }

      if(isMounted) setIsSearching(true);
      const newMarkers: MapMarker[] = [];
      
      for (const chunk of groundingChunks) {
        if (!isMounted) break;
        if (!chunk.maps?.title) continue;
        
        const query = chunk.maps.title.replace(/[^\w\s\u0600-\u06FF]/g, ' '); 
        
        let searchUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1&addressdetails=1`;
        
        if (userLocation) {
          const viewbox = [
             userLocation.longitude - 0.5,
             userLocation.latitude + 0.5,
             userLocation.longitude + 0.5,
             userLocation.latitude - 0.5
          ].join(',');
          
          searchUrl += `&viewbox=${viewbox}&bounded=0`;
          searchUrl += `&accept-language=${language},en`;
        }

        try {
          const res = await fetch(searchUrl, {
             headers: { 'Accept-Language': language }
          });
          if (res.ok) {
            const data = await res.json();
            if (data && data.length > 0) {
              newMarkers.push({
                lat: parseFloat(data[0].lat),
                lng: parseFloat(data[0].lon),
                title: chunk.maps.title
              });
            }
          }
        } catch (e) {
          console.warn("Geocoding failed for", query);
        }
        
        await new Promise(r => setTimeout(r, 800)); // Delay to respect API limits
      }
      
      if (isMounted) {
        setPoiMarkers(newMarkers);
        setIsSearching(false);
      }
    };

    fetchCoordinates();

    return () => { isMounted = false; };
  }, [groundingChunks, userLocation, language]);


  // Update POI Markers on Map
  useEffect(() => {
    if (!mapInstanceRef.current || !markersGroupRef.current) return;
    
    const map = mapInstanceRef.current;
    const group = markersGroupRef.current;
    
    group.clearLayers();

    if (poiMarkers.length > 0) {
      poiMarkers.forEach((marker) => {
        const icon = L.divIcon({
          className: 'poi-marker',
          html: `<div style="
            background-color: #ef4444;
            color: white;
            width: 24px;
            height: 24px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 2px 4px rgba(0,0,0,0.3);
            border: 2px solid white;
          ">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
          </div>`,
          iconSize: [24, 24],
          iconAnchor: [12, 24],
          popupAnchor: [0, -24]
        });

        L.marker([marker.lat, marker.lng], { icon })
          .addTo(group)
          .bindPopup(`<b>${marker.title}</b><br/><span style="font-size:10px; color:#666">${t.map.details}</span>`);
      });

      // Fit bounds to show all markers including user location if available
      const bounds = group.getBounds();
      if (userLocation) {
        bounds.extend([userLocation.latitude, userLocation.longitude]);
      }
      
      if (bounds.isValid()) {
        map.fitBounds(bounds, { padding: [50, 50], maxZoom: 16 });
      }
    }
  }, [poiMarkers, userLocation, t.map.details]);

  return (
    <div className="w-full h-full relative bg-slate-100 dark:bg-slate-900">
      <div ref={mapContainerRef} className="w-full h-full z-0" />
      
      {/* Loading Overlay */}
      {isSearching && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[400] bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 px-4 py-2 rounded-full shadow-lg text-xs font-bold flex items-center gap-2">
          <div className="w-3 h-3 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
          {t.map.searching}
        </div>
      )}
      
      {/* Search Result Count */}
      {!isSearching && poiMarkers.length > 0 && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[400] bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 px-4 py-2 rounded-full shadow-lg text-xs font-bold animate-in fade-in slide-in-from-top-4">
          {t.map.found(poiMarkers.length)}
        </div>
      )}
    </div>
  );
};

export default MapView;