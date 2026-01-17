export interface ILatLng {
    lat: number;
    lng: number;
}

export interface IPolygon {
    id?: string;
    points: ILatLng[];
}