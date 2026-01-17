export type MapObjectType = 'marker' | 'jeep';

export interface IMapObject {
    id?: string;
    lat: number;
    lng: number;
    type: MapObjectType;
}