import { apiClient } from "../client/apiClient";
import { AI_QUERY_DB_PATH } from "./const";


// TODO: find ways of handling db connection
export const getQueryFromLLMRequest = async (queryRequest: string, dbConnection: string = "perfectly") => {
    try {
        const response = await apiClient.post(`${AI_QUERY_DB_PATH}/${dbConnection}`, { query: queryRequest });
        return response.data["result"]["data"];
    } catch (error: any) {
        return error?.response?.data;
    }
};