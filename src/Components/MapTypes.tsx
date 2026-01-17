//@ts-ignore
import { IPolygon } from '../Models/PolygonModel.tsx';
//@ts-ignore
import { IMapObject } from '../Models/ObjectModel.tsx';

export interface IMapViewProps {
    polygons: IPolygon[];
    objects: IMapObject[];
    currentPoints: { lat: number; lng: number }[];
    onMapClick?: (lat: number, lng: number) => void;
}