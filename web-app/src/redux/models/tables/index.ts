import { createModel } from "@rematch/core";
import { RootModel } from '..';
import axiosInstance from "../../../utils/axiosInstance";

interface Table {
    value: string,
    label: string,
}

interface Tables {
    [schema_name: string] : Table[]
}

export const tables = createModel<RootModel>()({
    state: {} as Tables,
    reducers: {
        SET_TABLES: (state, payload) => {
            console.log({payload})
            let {tables, schema_name} = payload
            tables = tables.map((tableName: string) => {return {value: tableName, label: tableName }})
            return {
                ...state,
                [schema_name] : tables
            }
        }
    },
    effects:(dispatch) => ({
        getTables: async(schema_name) => {
            const response = await axiosInstance.get(`/v1/triggers/tables/${schema_name}`)
            const tables = response.data.tables;
            dispatch.tables.SET_TABLES({tables,schema_name});
        }
    })
})