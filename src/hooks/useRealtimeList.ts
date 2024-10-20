import { BaseModel, onDocChange } from "pocketto";
import { ModelStatic } from "pocketto/dist/src/definitions/Model";
import { useEffect, useState } from "react";

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
        orderBy,
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

                    const sortBy = orderBy || 'createdAt';
                    newData.sort((a, b) => {
                        if (a[sortBy] > b[sortBy]) {
                            return order === "asc" ? 1 : -1;
                        }
                        if (a[sortBy] < b[sortBy]) {
                            return order === "asc" ? -1 : 1;
                        }
                        return 0;
                    });
                }
                onChange?.(newData);
                return newData;
            });
        }
    }, [changedDoc])

    return data;
}
