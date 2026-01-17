const API_BASE = "https://localhost:7094/api";


export const getObjects  = async () => {
    const res = await fetch(`${API_BASE}/objects`);
    return await res.json();
};

export const saveObjects  = async (objects: any[]) => {
    const res = await fetch(`${API_BASE}/objects`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(objects)
    });

    return await res.json();
};

export const deleteObject  = async (id:any) => {
    const res = await fetch(`${API_BASE}/objects/${id}`, { method: "DELETE" });
    return await res.json();
};

export const deleteAllObjects  = async () => {
    const res = await fetch(`${API_BASE}/objects`, { method: "DELETE" });
    return await res.json();
};