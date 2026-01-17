const API_BASE = "https://localhost:7094/api";

export const getPolygons  = async () => {
    const res = await fetch(`${API_BASE}/polygons`);

    return await res.json();
};


export const savePolygon  = async (polygon: any) => {
    const res = await fetch(`${API_BASE}/polygons`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(polygon)
    });

    return await res.json();
};


export const deleteAllPolygons = async () => {
    const res = await fetch(`${API_BASE}/polygons`, {
        method: "DELETE",
    });

    return await res.json();
};

export const deletePolygon = async (id: string) => {
    const res = await fetch(`${API_BASE}/polygons/${id}`, {
        method: "DELETE",
    });

    return await res.json();
};
export const deletePolygons  = async () => {
    const res = await fetch(`${API_BASE}/polygons`, { method: "DELETE" });

    return await res.json();
};