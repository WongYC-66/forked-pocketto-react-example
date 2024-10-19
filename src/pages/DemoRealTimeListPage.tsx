import { useEffect, useState } from "react";
import { SalesInvoice } from "../models/SalesInvoice.p";
import { useRealtimeList } from "../hooks/useRealtimeList";
import { useLocation, useRouter } from "wouter";
import { faker } from '@faker-js/faker';

export function DemoRealTimeListPage() {
    const [initList, setInitList] = useState<SalesInvoice[]>([]);
    const salesInvoices = useRealtimeList(SalesInvoice, {
        value: initList,
        order: 'desc',
    });
    const [location, setLocation] = useLocation();

    useEffect(() => {
        SalesInvoice.query()
            .orderBy('createdAt', 'desc')
            .get()
            .then((result) => setInitList(result));
    }, []);

    return <div>
        <div className="flex justify-end gap-4">
            <button
                className="my-4 bg-react-700 hover:bg-react-900 text-white active:scale-90 font-medium py-2 px-4 rounded"
                onClick={() => setLocation('/realtime/new')}
            >
                Add New
            </button>
            <button
                className="my-4 bg-react-700 hover:bg-react-900 text-white active:scale-90 font-medium py-2 px-4 rounded"
                onClick={async () => {
                    const taxRate = 7;
                    const subtotalAmount = faker.number.float({ min: 1, max: 500, fractionDigits: 0 });
                    let taxAmount = subtotalAmount * taxRate / 100;
                    taxAmount = Math.round(taxAmount * 100) / 100;
                    const totalAmount = subtotalAmount + taxAmount;

                    const customerName = `${faker.name.firstName()} ${faker.name.lastName()}`;
                    const invoice = new SalesInvoice();
                    invoice.fill({
                        customerName,
                        subtotalAmount,
                        taxRate,
                        taxAmount,
                        totalAmount,
                        paidAmount: faker.number.float({ min: 0, max: totalAmount, fractionDigits: 0 }),
                    });
                    await invoice
                        .setRandomHexColor()
                        .save();
                }}
            >
                Create Fake Data
            </button>
        </div>
    </div>;
}
DemoRealTimeListPage.displayName = 'DemoRealTimeListPage';