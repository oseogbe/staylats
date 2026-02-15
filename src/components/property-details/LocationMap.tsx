import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { cn } from "@/lib/utils";

interface LocationMapProps {
  /** Approximate latitude */
  latitude: number;
  /** Approximate longitude */
  longitude: number;
  /** Location label displayed under the map (e.g. "Ikoyi, Lagos") */
  locationLabel?: string;
  className?: string;
  /** Zoom level — kept low since coordinates are approximate */
  zoom?: number;
  height?: string;
}

export function LocationMap({
  latitude,
  longitude,
  locationLabel,
  className,
  zoom = 13,
  height = "320px",
}: LocationMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const marker = useRef<mapboxgl.Marker | null>(null);

  const hasCoords = latitude !== 0 && longitude !== 0;

  useEffect(() => {
    if (!mapContainer.current || !hasCoords) return;
    if (map.current) return;

    mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN || "";

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/light-v11",
      center: [longitude, latitude],
      zoom,
      attributionControl: false,
    });

    map.current.addControl(
      new mapboxgl.NavigationControl({ showCompass: false }),
      "top-right"
    );

    map.current.addControl(
      new mapboxgl.AttributionControl({ compact: true }),
      "bottom-left"
    );

    map.current.on("load", () => {
      if (!map.current) return;

      // Theme-aware marker color
      const root = document.documentElement;
      const styles = getComputedStyle(root);
      const primaryColor = styles.getPropertyValue("--primary").trim();
      const markerColor = primaryColor
        ? `hsl(${primaryColor.replace(/\s+/g, ", ")})`
        : "#D4AF37";

      marker.current = new mapboxgl.Marker({ color: markerColor })
        .setLngLat([longitude, latitude])
        .addTo(map.current!);
    });

    return () => {
      if (marker.current) {
        marker.current.remove();
        marker.current = null;
      }
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [latitude, longitude, zoom, hasCoords]);

  // Fallback when coordinates are missing / zero
  if (!hasCoords) {
    return (
      <div
        className={cn(
          "rounded-lg border bg-muted flex items-center justify-center text-muted-foreground text-sm",
          className
        )}
        style={{ height }}
      >
        {locationLabel ? `Map not available — ${locationLabel}` : "Map not available"}
      </div>
    );
  }

  return (
    <div className={cn("space-y-3", className)}>
      <div className="relative rounded-lg overflow-hidden border shadow-sm" style={{ height }}>
        <div ref={mapContainer} className="w-full h-full" />

        <style>{`
          .mapboxgl-ctrl-group {
            background: hsl(var(--card)) !important;
            border-radius: 0.5rem !important;
            box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1) !important;
          }
          .mapboxgl-ctrl-group button {
            background: hsl(var(--card)) !important;
            border: none !important;
          }
          .mapboxgl-ctrl-group button:hover {
            background: hsl(var(--accent)) !important;
          }
          .mapboxgl-ctrl-group button + button {
            border-top: 1px solid hsl(var(--border)) !important;
          }
          .mapboxgl-ctrl button .mapboxgl-ctrl-icon {
            filter: brightness(0) saturate(100%) invert(46%) sepia(8%) saturate(0%) hue-rotate(244deg) brightness(93%) contrast(87%);
          }
          .mapboxgl-ctrl-attrib {
            background: hsl(var(--card) / 0.9) !important;
            backdrop-filter: blur(8px);
            border-radius: 0.375rem !important;
            padding: 0.25rem 0.5rem !important;
            font-size: 0.75rem !important;
            color: hsl(var(--muted-foreground)) !important;
          }
          .mapboxgl-ctrl-attrib a {
            color: hsl(var(--primary)) !important;
          }
        `}</style>
      </div>
    </div>
  );
}
