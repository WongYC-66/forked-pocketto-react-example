import { BaseModel, onDocChange } from "pocketto";
import { ModelStatic } from "pocketto/dist/src/definitions/Model";
import { useEffect, useState } from "react";

export function usePockettoState<T extends BaseModel>(initialValue: T, onChange?: (value: T) => void) {
    const [data, setData] = useState<T>(initialValue);

    useEffect(() => {
        onDocChange(async (id, doc) => {
            doc = await data.getClass().query().find(id) as T;
            if (id === data.id) {
                onChange?.(doc as T);
                setData(doc as T);
            }
        });

        return () => {
        };

    }, [data]);

    return data;
}

export function usePockettoArray<T extends BaseModel>(type: ModelStatic<T>, {
    initialValue,
    onChange,
    order,
}: {
    initialValue?: Array<T>;
    onChange?: (value: Array<T>) => void;
    order?: "asc" | "desc";
    orderBy?: keyof T;
} = {}) {
    const [data, setData] = useState<T[]>(initialValue || []);

    useEffect(() => {
        if (initialValue) {
            setData(initialValue);
        }
    }, [initialValue]);

    useEffect(() => {
        onDocChange(async (id, doc) => {
            doc = await new type().getClass().query().find(id) as T;
            if (typeof data === "object" && data instanceof Array) {
                const index = (data as BaseModel[]).findIndex(v => v.id === id);
                if (index !== -1) {
                    const newData = [...data];
                    newData[index] = doc as T;
                    onChange?.(newData);
                    setData(newData);
                }
                const sameModelType = new type().cName === doc.cName;
                if (sameModelType && !data.find(v => v.id === id)) {
                    const newData = [...data];
                    if (!order || order === "asc") {
                        newData.push(doc as T);
                    } else if (order === "desc") {
                        newData.unshift(doc as T);
                    }
                    onChange?.(newData);
                    setData(newData);
                }
            }
        });

        return () => {
        };

    }, [data]);

    return data;
}