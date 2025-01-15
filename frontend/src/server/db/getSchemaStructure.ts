import { apiClient } from "../client/apiClient";
import { DB_SCHEMA_STRUCTURE_PATH } from "./const";


export const fetchSchemas = async (dbConnection: string = "perfectly") => {
    const response = await apiClient.get(`${DB_SCHEMA_STRUCTURE_PATH}/?id_name=${dbConnection}`);
    return response.data
};