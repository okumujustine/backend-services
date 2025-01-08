import { apiClient } from "../client/apiClient";
import { DB_QUERY_PATH } from "./const";


export const executeQueryRequest = async (query: string) => {
    try {
        const response = await apiClient.post(DB_QUERY_PATH, { query });
        return response.data["result"];
    } catch (error: any) {
        return error?.response?.data;
    }
};