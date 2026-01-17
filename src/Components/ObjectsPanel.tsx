//@ts-ignore
import { MapObjectType } from '../Models/ObjectModel.tsx';
import {useState} from "react";

interface Props {
    lstObjects:any,
    isDrawing:any
    callbackfunctions:any
}

export const ObjectsPanel = (props: Props) => {


    const OBJECT_TYPES:any = [
        { label: "Marker", icon: "📍", value: "marker" },
        { label: "Jeep", icon: "🚙", value: "jeep" },
        { label: "Car", icon: "🚗", value: "car" },
    ];

    const [objectSelected, setObjectSelected] = useState(OBJECT_TYPES[0].value);

    const handleChange = (prmEvent:any) => {
        setObjectSelected(prmEvent.target.value);
        props.callbackfunctions.handleSelectedObjectType(prmEvent.target.value);
    };

    return (
    <div>
        <h3>Objects</h3>
        <div>
            <button onClick={() => props.callbackfunctions.handleAddObjectPoints(objectSelected)}>{!props.isDrawing ? <span>Open To Edit</span> : <span>Close Edit</span>}</button>
        </div>

        <div className="gap-50">

            <select value={objectSelected} disabled={!props.isDrawing} onChange={(prmEvent:any) => handleChange(prmEvent)}>
                {OBJECT_TYPES.map((prmObj:any) => (
                    <option key={prmObj.value} value={prmObj.value}>
                        {prmObj.icon} {prmObj.label}
                    </option>
                ))}
            </select>

            <button onClick={() => props.callbackfunctions.handleSaveObjectPoints()}>Save</button>
            <button onClick={() => props.callbackfunctions.handleDeleteObjectPoints()}>Delete All</button>
        </div>

        {props.isDrawing &&
            <div>map can to edit in object mode</div>
        }
    </div>
    )
};