import {useState} from "react";

interface Props {
    lstPolygons:any,
    isDrawing: boolean,
    callbackfunctions:any
}

export const PolygonPanel = (props: Props) => {

    const handleChangePolygonDrawing = () => {
        props.callbackfunctions.handleMapDrawingChange()
        props.callbackfunctions.handleAddPolygonPoints()
    }

    return (
        <div>
            <h3>Polygon</h3>
            <button onClick={() => handleChangePolygonDrawing()}>{!props.isDrawing ? <span>Open To Edit</span> : <span>Close Edit</span>}</button>
            <button disabled={!props.isDrawing} onClick={() => props.callbackfunctions.handleSavePolygonPoints()}>Save</button>
            <button disabled={props.lstPolygons.length == 0} onClick={() => props.callbackfunctions.handleDeletePolygonPoints()}>Delete All</button>

            {props.isDrawing &&
                <div>map can to edit in polygon mode</div>
            }
        </div>
    )

};