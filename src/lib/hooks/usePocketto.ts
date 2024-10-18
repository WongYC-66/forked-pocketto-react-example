import { BaseModel, onDocChange } from "pocketto";
import { ModelStatic } from "pocketto/dist/src/definitions/Model";
import { useEffect, useState } from "react";

export function useRealtimeValue<T extends BaseModel>(value: T, onChange?: (value: T) => void) {
    const [data, setData] = useState<T>(value);

    useEffect(() => {
        onDocChange(async (id) => {
            if (id !== data.id) return;
            const doc = await data.getClass().query().find(id) as T;
            onChange?.(doc as T);
            setData(doc as T);
        });

        return () => {
        };

    }, [data]);

    return data;
}

export function useRealtimeArray<T extends BaseModel>(type: ModelStatic<T>, config: {
    value?: Array<T>;
    onChange?: (value: Array<T>) => void;
    order?: "asc" | "desc";
    orderBy?: keyof T;
    disableAutoAppend?: boolean;
} = {}) {
    const {
        value,
        onChange,
        order,
        disableAutoAppend,
    } = config;
    const [data, setData] = useState<T[]>(value || []);

    useEffect(() => {
        if (value) {
            setData(value);
        }
    }, [value]);

    useEffect(() => {
        onDocChange(async (id) => {
            if (!(data instanceof Array)) return;
            const doc = await new type().getClass().query().find(id) as T;
            const sameModelType = new type().cName === doc.cName;
            if (!sameModelType) return;

            const index = data.findIndex(v => v.id === id);
            const dataFound = index !== -1;
            if (dataFound) {
                const newData = [...data];
                newData[index] = doc as T;
                onChange?.(newData);
                setData(newData);
                return;
            }

            if (disableAutoAppend) return;
            if (dataFound) return;
            const newData = [...data];
            if (!order || order === "asc") {
                newData.push(doc as T);
            } else if (order === "desc") {
                newData.unshift(doc as T);
            }
            onChange?.(newData);
            setData(newData);
        });

        return () => {
        };
    }, [data]);

    return data;
}