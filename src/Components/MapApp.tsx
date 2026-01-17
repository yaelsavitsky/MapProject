import { useEffect, useState ,useRef} from 'react';
//@ts-ignore
import { MapView } from './MapView.tsx';
//@ts-ignore
import { PolygonPanel } from './PolygonPanel.tsx';
//@ts-ignore
import { ObjectsPanel } from './ObjectsPanel.tsx';
//@ts-ignore
import { MapDataTable } from './MapDataTable.tsx';
//@ts-ignore
import { ILatLng, IPolygon } from '../Models/PolygonModel.tsx';
//@ts-ignore
import { IMapObject, MapObjectType } from '../Models/ObjectModel.tsx';
//@ts-ignore
import {getPolygons, savePolygon, deletePolygons, deleteAllPolygons, deletePolygon} from '../Services/polygonApi.tsx';
//@ts-ignore
import {getObjects, saveObjects, deleteAllObjects, deleteObject} from '../Services/objectApi.tsx';

enum eMapMode  {
    "Idle" = "idle" ,
    "Polygon" = "draw-polygon" ,
    "Object" = "add-object" ,
}

function MapApp() {
    const mapMode = useRef<any>(eMapMode.Idle);
    const lstPolygons = useRef<IPolygon[]>([]);
    const lstObjects = useRef<IMapObject[]>([]);
    const objectType = useRef<MapObjectType | null>(null);
    const [renderDT, setRenderDT] = useState(new Date())
    const isMapDrawing = useRef(false);
    const lstPoints = useRef<ILatLng[]>([]);

    const handleMapDrawingChange = () => {
        isMapDrawing.current = !isMapDrawing.current
        setRenderDT(new Date())
    }

    useEffect(() => {
        initData()
    }, []);


    //comment: Load initial data from server
    const initData = () => {
        getPolygons()?.then((prmResponse => {
            lstPolygons.current = prmResponse || []
            setRenderDT(new Date())
        }));

        getObjects()?.then((prmResponse => {
            lstObjects.current = prmResponse || []
            setRenderDT(new Date())
        }));
    }

    const handleMapClick = (prmLat: number, prmLng: number) => {
        if (prmLat && prmLng) {
            if (isMapDrawing.current && mapMode.current === eMapMode.Polygon) {
                // Add point to current polygon
                let currLstPoints = [...lstPoints.current]
                let newPoint:ILatLng = {lat:prmLat , lng:prmLng }//,id:-lstPolygons.current.length
                currLstPoints.push(newPoint)
                lstPoints.current = [...currLstPoints];

                setRenderDT(new Date())
            }
            else if (mapMode.current === eMapMode.Object && objectType.current) {
                // Add a new object/marker
                let currLstObjects = [...lstObjects.current]
                let newObject:IMapObject = {
                    //id:-lstObjects.current.length,
                    lat: prmLat,
                    lng: prmLng,
                    type: objectType.current
                }

                currLstObjects.push(newObject)
                lstObjects.current = currLstObjects;

                setRenderDT(new Date())
            }
        }
    };

    //comment: Set current object type and switch to object adding mode
    const handleAddObjectPoints = (prmTypeToAdd?:any) => {
        objectType.current  = prmTypeToAdd;
        mapMode.current = eMapMode.Object;
        handleMapDrawingChange()
    }

    //comment: Select object type from UI
    const handleSelectedObjectType = (prmTypeToAdd:any) => {
        objectType.current  = prmTypeToAdd;
        setRenderDT(new Date())
    }

    //comment: Delete all objects from map and server
    const handleDeleteObjectPoints = async () => {
        await deleteAllObjects().then((prmResponse:any) => {
            if (!!prmResponse) {
                lstObjects.current = prmResponse
                setRenderDT(new Date())
            }
        });
    }

    //comment: Save newly added objects to server
    const handleSaveObjectPoints = async () => {
        let lstNewObjects = lstObjects.current?.filter((prmItem:any) => !prmItem.id)

        if (lstNewObjects.length > 0) {
            await saveObjects(lstNewObjects).then((prmResponse:any) => {
                if (!!prmResponse) {
                    lstObjects.current = prmResponse
                    setRenderDT(new Date())
                }
            });
        }
    }

    //comment: Switch to polygon drawing mode
    const handleAddPolygonPoints = () => {
        mapMode.current = eMapMode.Polygon;
    }

    //comment: Delete all polygons from map and server
    const handleDeletePolygonPoints = async () => {
        await deleteAllPolygons().then((prmResponse:any) => {
            lstPoints.current = [];

            if (!!prmResponse) {
                lstPolygons.current = prmResponse
                mapMode.current = eMapMode.Idle;
                setRenderDT(new Date())
            }
        });

    }

    //comment: Save newly added polygons to server
    const handleSavePolygonPoints = async () => {
        let lstNewPolygon = lstPolygons.current?.filter((prmItem:any) => !prmItem.id)

        if (lstNewPolygon.length > 0) {
            await savePolygon(lstNewPolygon).then((prmResponse:any) => {
                lstPoints.current = [];

                if (!!prmResponse) {
                    lstPolygons.current = prmResponse
                    setRenderDT(new Date())
                }
            });
        }
    }

    //comment: Close current polygon and add to map
    const handleClosePolygon = () => {
        const newPolygon = {
            points: [...lstPoints.current]
        };

        lstPolygons.current = [...lstPolygons.current ,newPolygon ] ;
        lstPoints.current = [];
        setRenderDT(new Date())
    }

    //comment: Delete a specific polygon by ID
    const handlePolygonClick = async (prmID: any) => {
        if(prmID) {
            await deletePolygon(prmID).then((prmResponse: any) => {
                if (!!prmResponse) {
                    lstPolygons.current = prmResponse
                    setRenderDT(new Date())
                }
            });
        }

    };

    //comment: Delete a specific object by ID
    const handleObjectClick = async (prmID: any) => {
        if (prmID) {
            await deleteObject(prmID).then((prmResponse:any) => {
                if (!!prmResponse) {
                    lstObjects.current = prmResponse
                    setRenderDT(new Date())
                }
            });
        }
    };

    //comment: Store all callback functions to pass down to child components
    const callbackfunctions = useRef({
        handleAddPolygonPoints,
        handleSavePolygonPoints,
        handleDeletePolygonPoints,
        handleAddObjectPoints,
        handleDeleteObjectPoints,
        handleMapDrawingChange,
        handleClosePolygon,
        handleMapClick,
        handleSaveObjectPoints,
        handleSelectedObjectType,
        handlePolygonClick,
        handleObjectClick
    })

    return (
        <div style={{ display: 'grid', gridTemplateColumns: '70% 30%', height: '100vh' }}>
            <MapView
                lstPolygons={[...lstPolygons.current, ...(lstPoints.current.length ? [{ points: lstPoints.current }] : [])]}
                currLstPoints={lstPoints.current}
                lstObjects={lstObjects.current}
                callbackfunctions={callbackfunctions.current}
            />

            <div style={{ display: 'grid', gridTemplateRows: '30% 30% 40%', padding: 10 }}>
                <PolygonPanel
                    lstPolygons = {lstPolygons.current}
                    isDrawing={(mapMode.current == 'draw-polygon' && isMapDrawing.current)}
                    callbackfunctions={callbackfunctions.current}
                />

                <ObjectsPanel
                    lstObjects={lstObjects.current}
                    isDrawing={(mapMode.current == 'add-object' && isMapDrawing.current)}
                    callbackfunctions={callbackfunctions.current}
                />

                <MapDataTable lstObjects={lstObjects.current || []} />
            </div>
        </div>
    );
}

export default MapApp;
