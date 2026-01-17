
import { useEffect, useRef ,useState } from 'react';
//@ts-ignore
import maplibregl, { Map } from 'maplibre-gl';
//@ts-ignore
import { IMapViewProps } from './MapTypes.tsx';

interface Props {
    lstPolygons: any;
    currLstPoints: any;
    lstObjects: any;
    callbackfunctions:any
}

export const MapView = (props: Props) => {
    const mapRef = useRef<Map | null>(null);
    const mapContainerRef = useRef<HTMLDivElement | null>(null);
    const markersRef = useRef<maplibregl.Marker[]>([]);
    const [isMapReady, setIsMapReady] = useState(false);
    const startMarkerRef = useRef<maplibregl.Marker | null>(null);

    //comment: Remove start marker if there are no polygons
    useEffect(() => {
        if (!mapRef.current || !isMapReady) return;

        if (!props.lstPolygons?.length && startMarkerRef.current) {
            startMarkerRef.current.remove();
            startMarkerRef.current = null;
        }
    }, [props.lstPolygons, isMapReady]);

    useEffect(() => {
        initMap()
    }, []);

    const initMap = () => {
        if (mapRef.current) return;

        const currMap = new maplibregl.Map({
            container: mapContainerRef.current!,
            style: 'https://demotiles.maplibre.org/style.json',
            center: [34.7818, 32.0853],
            zoom: 8,
        });

        currMap.on('load', () => {
            setIsMapReady(true);
        });

        currMap.on('click', (e) => {
            props.callbackfunctions.handleMapClick(e?.lngLat?.lat, e?.lngLat?.lng);
        });

        mapRef.current = currMap;
    }

    //comment: Draw polygons on the map using GeoJSON
    const createPolygonsOnMap = () => {
        if (!mapRef.current || !isMapReady) return;
        if (!props.lstPolygons?.length) return;

        const geoJson = {
            type: 'FeatureCollection',
            features: props.lstPolygons?.map(p => ({
                type: 'Feature',
                geometry: {
                    type: 'Polygon',
                    coordinates: [[
                        ...p.points?.map(pt => [pt.lng, pt.lat]),
                        [p.points[0].lng, p.points[0].lat]
                    ]]
                },
                properties: { id: p.id }
            }))
        };

        const currMap = mapRef.current;

        if (currMap.getSource('polygons')) {
            (currMap.getSource('polygons') as any).setData(geoJson);
        }
        else {
            currMap.addSource('polygons', {
                type: 'geojson',
                data: geoJson
            });

            currMap.addLayer({
                id: 'polygon-layer',
                type: 'fill',
                source: 'polygons',
                paint: {
                    'fill-color': '#007bff',
                    'fill-opacity': 0.4
                }
            });

            //comment: Click on polygon triggers deletion via parent callback
            currMap.on('click', 'polygon-layer', (e: any) => {
                const polygonId = e.features[0].properties.id;
                props.callbackfunctions.handlePolygonClick(polygonId); // callback להורה
            });
        }
    }

    //comment: Redraw polygons whenever the list changes or map is ready
    useEffect(() => {
        createPolygonsOnMap()
    }, [props.lstPolygons, isMapReady]);

    //comment: Draw the temporary start point for a polygon
    useEffect(() => {
        drawStartPointsOnMap()
    }, [props.currLstPoints, isMapReady]);


    const drawStartPointsOnMap = () => {
        if (!mapRef.current || !isMapReady) return;
        if (!props.currLstPoints || props.currLstPoints.length === 0) return;

        const startPoint = props.currLstPoints[0];

        //comment: Remove previous start marker if exists
        if (startMarkerRef.current) {
            startMarkerRef.current.remove();
            startMarkerRef.current = null;
        }

        //comment: Create custom DOM element for the start marker
        const currElement = document.createElement('div');
        currElement.style.width = '12px';
        currElement.style.height = '12px';
        currElement.style.borderRadius = '50%';
        currElement.style.background = 'red';
        currElement.style.border = '2px solid white';
        currElement.style.cursor = 'pointer';

        //comment: Clicking start marker closes the polygon
        currElement.onclick = (prmEvent) => {
            prmEvent.stopPropagation(); // שלא יפעיל click על המפה
            props.callbackfunctions.handleClosePolygon();    // ⭐ סוגר פוליגון
        };

        startMarkerRef.current = new maplibregl.Marker({ element: currElement })
            .setLngLat([startPoint?.lng, startPoint.lat])
            .addTo(mapRef.current);
    }

    useEffect(() => {
        createMarkerOnMapInStartPoint()
    }, [props.lstObjects, isMapReady]);


    const createMarkerOnMapInStartPoint = () => {
        if (!mapRef.current || !isMapReady) return;

        //comment: Remove existing markers
        for (const currMarkers of markersRef.current) {
            currMarkers.remove()
        }

        markersRef.current = [];

        for (const currObject of props.lstObjects) {
            if (!mapRef.current
                || !currObject.lng || !currObject.lat) {
                return;
            }

            const currElement = document.createElement("div");
            currElement.style.fontSize = "24px";
            currElement.style.transform = "translate(-50%, -100%)";

            //comment: Set icon based on object type
            switch (currObject.type){
                case 'jeep':
                    currElement.innerHTML = '<i class="fas fa-car-side"></i>';
                    currElement.style.color = 'green';
                    break;
                case 'car':
                    currElement.innerHTML = '<i class="fas fa-car"></i>';
                    currElement.style.color = 'blue';
                    break;
                default:
                    currElement.innerHTML = '<i class="fas fa-map-marker-alt"></i>';
                    currElement.style.color = 'red';
            }

            //comment: Clicking marker deletes object (can change to selection before saving)
            currElement.addEventListener('click', () => {
                props.callbackfunctions.handleObjectClick(currObject.id); // callback להורה
            });

            const marker = new maplibregl.Marker({ element: currElement })
                ?.setLngLat([currObject.lng, currObject.lat])
                ?.addTo(mapRef.current!);

            markersRef.current.push(marker);
        }
    }

    return <div ref={mapContainerRef} style={{ width: '100%', height: '100%' }} />;
};