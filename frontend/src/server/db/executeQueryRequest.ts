import { apiClient } from "../client/apiClient";
import { DB_QUERY_PATH } from "./const";


export const executeQueryRequest = async (query: string, dbConnection: string = "perfectly") => {
    try {
        const response = await apiClient.post(`${DB_QUERY_PATH}/${dbConnection}`, { query });
        return response.data["result"];
    } catch (error: any) {
        return error?.response?.data;
    }
};