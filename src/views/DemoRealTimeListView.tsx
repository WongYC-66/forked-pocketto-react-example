import { useCallback, useState } from "react";
import { SalesInvoice } from "../models/SalesInvoice.p";
import { useLocation } from "wouter";
import { faker } from '@faker-js/faker';
import { cn } from "../utils/cn";
import { formatNumber } from "../utils/number";
import { HighlightableTr } from "../components/HighlightableTr";
import { useRealtimeList } from "pocketto-react";

export function DemoRealTimeListView() {
    const [changedItem, setChangedItem] = useState<SalesInvoice>();
    const salesInvoices = useRealtimeList(SalesInvoice, {
        animationDelay: 2000,
        onItemChange: value => setChangedItem(value),
    });
    const [_, setLocation] = useLocation();

    const getPaidColor = useCallback((percentage: number) => {
        if (percentage >= 50) {
            return 'bg-success';
        }
        if (percentage >= 20) {
            return 'bg-warning';
        }
        return 'bg-error';
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

                    const customerName = `${faker.person.firstName()} ${faker.person.lastName()}`;
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
        <div className="flex justify-end">
            <div className="table-container">
                <table width="100%">
                    <thead>
                        <tr>
                            <th width="5%" className="rounded-tl-md bg-react-700 text-white font-medium px-4 py-2"></th>
                            <th width="30%" className="bg-react-700 text-white font-medium px-4 py-2">Customer Name</th>
                            <th width="15%" className="bg-react-700 text-white font-medium px-4 py-2"><div className="text-right">Subtotal</div></th>
                            <th width="10%" className="bg-react-700 text-white font-medium px-4 py-2"><div className="text-right">Tax</div></th>
                            <th width="15%" className="bg-react-700 text-white font-medium px-4 py-2"><div className="text-right">Total</div></th>
                            <th width="20%" className="rounded-tr-md bg-react-700 text-white font-medium px-4 py-2"><div className="text-right">Paid Amount</div></th>
                        </tr>
                    </thead>
                </table>

                <div className="table-body border-slate-300 rounded-bl-md rounded-br-md border mt-[-2px]">
                    <table width="100%">
                        <tbody>
                            {
                                salesInvoices.map((invoice) => {
                                    return <HighlightableTr
                                        start={changedItem?.id === invoice.id}
                                        color={'#B3ECFF'}
                                        key={invoice.id}
                                        className="bg-white hover:bg-gray-200 text-gray-800 border-b border-slate-300 cursor-pointer"
                                        onClick={() => setLocation(`/realtime/${invoice.id}`)}
                                    >
                                        <td width="5%" className="pt-4 px-4 py-2">
                                            <div style={{ backgroundColor: invoice.color }} className="w-4 h-4 rounded-full"></div>
                                        </td>
                                        <td width="30%" className="px-4 py-2">{invoice.customerName}</td>
                                        <td width="15%" className="px-4 py-2"><div className="text-right">{formatNumber(invoice.subtotalAmount)}</div></td>
                                        <td width="10%" className="px-4 py-2"><div className="text-right">{formatNumber(invoice.taxAmount)}</div></td>
                                        <td width="15%" className="px-4 py-2"><div className="text-right">{formatNumber(invoice.totalAmount)}</div></td>
                                        <td width="20%" className="py-2">
                                            <div className={cn(
                                                'h-1 rounded-full bg-gray-300 mt-[-12px]',
                                            )}>
                                                <div
                                                    className={cn(
                                                        'h-1 rounded-full',
                                                        getPaidColor(invoice.paidPercentage),
                                                    )}
                                                    style={{
                                                        width: invoice.paidPercentage + '%',
                                                    }}
                                                ></div>
                                                <div className="text-right">{formatNumber(invoice.paidAmount)}</div>
                                            </div>
                                        </td>
                                    </HighlightableTr>
                                })
                            }

                        </tbody>
                    </table>
                    {
                        salesInvoices.length === 0 && <div
                            className="flex items-center justify-center h-full"
                        >
                            <div className="text-slate-500">No data available, click the button above to add fake data</div>
                        </div>
                    }
                </div>
            </div>
        </div>

    </div>;
}
DemoRealTimeListView.displayName = 'DemoRealTimeListView';