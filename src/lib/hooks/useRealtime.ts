import { BaseModel, onDocChange } from "pocketto";
import { ModelStatic } from "pocketto/dist/src/definitions/Model";
import { useEffect, useState } from "react";

export function useRealtime<T extends BaseModel>(type: ModelStatic<T>, id?: string, onChange?: (value: T) => void) {
    const [data, setData] = useState<T>(new type());

    const [changedDoc, setChangedDoc] = useState<T>();
    useEffect(() => {
        const docChange = async (id: string) => {
            const modelName = new type().getClass().collectionName as string + '.';
            id = id.replace(modelName, '');
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
        if (id) {
            data.getClass().find(id).then((doc) => {
                setData(doc as T);
            });
        }
    }, [id]);

    useEffect(() => {
        if (changedDoc) {
            setData(changedDoc);
            onChange?.(changedDoc);
        }
    }, [changedDoc]);

    return data;
}
