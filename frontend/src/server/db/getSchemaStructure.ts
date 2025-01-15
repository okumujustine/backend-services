import { apiClient } from "../client/apiClient";
import { DB_SCHEMA_STRUCTURE_PATH } from "./const";


export const fetchSchemas = async (dbConnection: string = "perfectly") => {
    try {
        const response = await apiClient.post(`${DB_SCHEMA_STRUCTURE_PATH}/${dbConnection}?id_name=${dbConnection}`);
        return response.data["result"];
    } catch (error: any) {
        return error?.response?.data;
    }
};