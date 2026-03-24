import { useEffect, useRef, useState } from 'react';
import { MapPin } from 'lucide-react';

interface StoreMapProps {
  stores: Array<{
    id: string;
    name: string;
    address?: string;
    city?: string;
  }>;
}

export default function StoreMap({ stores }: StoreMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    let map: any;
    let L: any;

    async function initMap() {
      try {
        L = await import('leaflet');
        await import('leaflet/dist/leaflet.css');

        if (!mapRef.current) return;

        map = L.map(mapRef.current).setView([19.4326, -99.1332], 12);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; OpenStreetMap contributors',
        }).addTo(map);

        // Custom icon
        const icon = L.divIcon({
          html: `<div style="background:#3b82f6;color:white;border-radius:50%;width:32px;height:32px;display:flex;align-items:center;justify-content:center;font-size:16px;box-shadow:0 2px 8px rgba(0,0,0,0.3);">📍</div>`,
          iconSize: [32, 32],
          className: '',
        });

        // Add markers for stores with addresses
        const markers: any[] = [];
        stores.forEach((store) => {
          if (store.address || store.city) {
            // For demo: spread markers around default center
            const lat = 19.4326 + (Math.random() - 0.5) * 0.1;
            const lng = -99.1332 + (Math.random() - 0.5) * 0.1;
            const marker = L.marker([lat, lng], { icon }).addTo(map);
            marker.bindPopup(`<b>${store.name}</b><br/>${store.address || ''}<br/>${store.city || ''}`);
            markers.push(marker);
          }
        });

        if (markers.length > 0) {
          const group = L.featureGroup(markers);
          map.fitBounds(group.getBounds().pad(0.2));
        }

        setMapLoaded(true);
      } catch {
        setError(true);
      }
    }

    initMap();

    return () => {
      if (map) map.remove();
    };
  }, [stores]);

  if (error) {
    return (
      <div className="bg-gray-100 dark:bg-gray-700 rounded-xl p-8 text-center">
        <MapPin size={40} className="mx-auto text-gray-400 mb-3" />
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          No se pudo cargar el mapa
        </p>
      </div>
    );
  }

  return (
    <div className="relative">
      <div
        ref={mapRef}
        className="w-full h-80 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700"
      />
      {!mapLoaded && (
        <div className="absolute inset-0 bg-gray-100 dark:bg-gray-700 rounded-xl flex items-center justify-center">
          <div className="text-gray-400 text-sm">Cargando mapa...</div>
        </div>
      )}
    </div>
  );
}
