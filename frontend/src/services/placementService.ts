import api from "./api";

export async function getPlacements() {
    const response = await api.get("/placements");
    return response.data;
}

export async function createPlacement(data: any) {
    const response = await api.post("/placements", data);
    return response.data;
}
