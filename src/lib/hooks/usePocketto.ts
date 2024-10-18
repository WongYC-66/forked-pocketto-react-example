import { BaseModel, onDocChange } from "pocketto";
import { ModelStatic } from "pocketto/dist/src/definitions/Model";
import { useEffect, useState } from "react";

export function useRealtimeValue<T extends BaseModel>(value: T, onChange?: (value: T) => void) {
    const [data, setData] = useState<T>(value);

    const [changedDoc, setChangedDoc] = useState<T>();
    useEffect(() => {
        const docChange = async (id: string) => {
            if (id !== data.id) return;
            const doc = await data.getClass().query().find(id) as T;
            setChangedDoc(doc);
        }
        const event = onDocChange(docChange);
        return () => {
            event.off('docChange', docChange);
        }
    }, []);

    useEffect(() => {
        if (changedDoc) {
            setData(changedDoc);
            onChange?.(changedDoc);
        }
    }, [changedDoc]);

    return data;
}

export function useRealtimeList<T extends BaseModel>(type: ModelStatic<T>, config: {
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
    const [data, setData] = useState<Array<T>>(value || []);

    useEffect(() => {
        if (value) {
            setData(value);
        }
    }, [value]);

    const [changedDoc, setChangedDoc] = useState<T>();
    useEffect(() => {
        const docChange = async (id: string) => {
            if (!(data instanceof Array)) return;
            const doc = await new type().getClass().query().find(id) as T;
            const sameModelType = new type().cName === doc.cName;
            if (!sameModelType) return;
            setChangedDoc(doc);
        };
        const event = onDocChange(docChange);
        return () => {
            event.off('docChange', docChange);
        };
    }, []);

    useEffect(() => {
        if (changedDoc) {
            setData((prev) => {
                const newData = [...prev];
                const sameIdIndex = newData.findIndex((d) => d.id === changedDoc.id);
                if (sameIdIndex !== -1) {
                    newData[sameIdIndex] = changedDoc;
                } else if (!disableAutoAppend) {
                    if (!order || order === "desc") {
                        newData.unshift(changedDoc as T);
                    } else if (order === "asc") {
                        newData.push(changedDoc as T);
                    }
                }
                onChange?.(newData);
                return newData;
            });
        }
    }, [changedDoc])

    return data;
}