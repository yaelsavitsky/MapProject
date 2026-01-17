//@ts-ignore
import { IMapObject } from '../Models/ObjectModel.tsx';

interface Props {
    lstObjects: IMapObject[];
}

export const MapDataTable = (props: Props) => (
    <div>
        <h3>Map Data</h3>
        <table border={1} width="100%">
            <thead>
            <tr>
                <th>Object</th>
                <th>Lat</th>
                <th>Lon</th>
            </tr>
            </thead>
            <tbody>
            {props.lstObjects?.map((currObject, prmIndex) => (
                <tr key={prmIndex}>
                    <td>{currObject.type}</td>
                    <td>{currObject.lat?.toFixed(5)}</td>
                    <td>{currObject.lng?.toFixed(5)}</td>
                </tr>
            ))}
            </tbody>
        </table>
    </div>
);