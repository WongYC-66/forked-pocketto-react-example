import { useEffect, useState } from "react";
import { SalesInvoice } from "../models/SalesInvoice.p";
import { useLocation, useRoute } from "wouter";
import { useRealtime } from "../hooks/useRealtime";
import { BackButton } from "../components/BackButton";
import { cn } from "../utils/cn";
import { formatNumber } from "../utils/number";
import { Alert } from "../components/Alert";

export function DemoRealTimeView() {
    const [match, params] = useRoute("/realtime/:id");
    const id = params?.id === 'new' ? undefined : params?.id;
    const [invoice, setInvoice] = useRealtime(SalesInvoice, id);
    const [location, setLocation] = useLocation();
    const [saved, setSaved] = useState(false);
    const [beingUpdated, setBeingUpdated] = useState(false);

    useEffect(() => {
        if (id) {
            SalesInvoice.find(id).then((doc) => {
                setInvoice(doc as SalesInvoice);
            });
        }
    }, [id]);

    const [rev, setRev] = useState('');
    useEffect(() => {
        if (invoice._meta._rev !== rev && rev && !saved) {
            setBeingUpdated(true);
            setTimeout(() => setBeingUpdated(false), 3000);
        } else {
            setRev(invoice._meta._rev);
        }
    }, [invoice._meta._rev, rev, saved]);

    return <div>
        <Alert type='success' title="Invoice saved!" show={saved} />
        <Alert type='info' title="Invoice was updated by other user!" show={beingUpdated} />

        <div className="flex justify-between">
            <div className="text-2xl font-semibold">{id ? 'Update invoice' : 'Create new invoice'}</div>
            <div className="flex flex-row gap-4">
                <BackButton
                    onClick={() => setLocation('/realtime-list', { replace: true })}
                />
                <button
                    className="my-4 bg-react-700 hover:bg-react-900 text-white active:scale-90 font-medium py-2 px-4 rounded"
                    onClick={async () => {
                        setInvoice(await invoice.save());
                        setSaved(true);
                        setTimeout(() => setSaved(false), 3000);
                    }}
                >
                    Save
                </button>
            </div>
        </div>
        <div className="flex flex-row gap-6">
            <div className="mt-4 w-[5%]">
                <label className="font-medium text-sm text-slate-500">Color</label>
                <div
                    className={cn(
                        'w-8 h-8 mt-2 mx-1 rounded-full cursor-pointer',
                        !invoice.color && 'border border-slate-300',
                    )}
                    style={{
                        backgroundColor: invoice.color,
                    }}
                    onClick={() => setInvoice(invoice.setRandomHexColor())}
                ></div>
            </div>
            <div className="mt-4 w-[95%]">
                <label className="font-medium text-sm text-slate-500">Customer Name</label>
                <input
                    className="border rounded-md px-2 focus:outline-react-500 h-12 w-full"
                    value={invoice.customerName}
                    onChange={(e) => {
                        const value = e.target.value;
                        invoice.customerName = value;
                        setInvoice(invoice);
                    }}
                />
            </div>
        </div>
        <div className="flex flex-row gap-4">
            <div className="mt-4 w-1/2">
                <label className="font-medium text-sm text-slate-500">Subtotal Amount</label>
                <input
                    className="border rounded-md px-2 focus:outline-react-500 h-12 w-full"
                    value={invoice.subtotalAmount}
                    onChange={(event) => {
                        const value = parseFloat(event.target.value || '0');
                        invoice.taxAmount = value * invoice.taxRate / 100;
                        const totalAmount = Number(value) + Number(invoice.taxAmount);
                        invoice.totalAmount = totalAmount;
                        invoice.subtotalAmount = Number(value);
                        setInvoice(invoice);
                    }}
                />
            </div>
            <div className="mt-4 w-1/2">
                <label className="font-medium text-sm text-slate-500">Tax Rate (%)</label>
                <input
                    className="border rounded-md px-2 focus:outline-react-500 h-12 w-full"
                    value={invoice.taxRate}
                    onChange={(event) => {
                        const value = parseFloat(event.target?.value || '0');
                        invoice.taxAmount = invoice.subtotalAmount * value / 100;
                        const totalAmount = Number(invoice.subtotalAmount) + Number(invoice.taxAmount);
                        invoice.totalAmount = totalAmount;
                        invoice.taxRate = Number(value);
                        setInvoice(invoice);
                    }}
                />
            </div>
        </div>
        <div className="flex flex-row gap-4">
            <div className="mt-4 w-1/2">
                <label className="font-medium text-sm text-slate-500">Tax Amount</label>
                <input className="border rounded-md px-2 focus:outline-react-500 h-12 w-full disabled:opacity-50" disabled value={formatNumber(invoice.taxAmount || 0)} />
            </div>
            <div className="mt-4 w-1/2">
                <label className="font-medium text-sm text-slate-500">Grant Total Amount</label>
                <input className="border rounded-md px-2 focus:outline-react-500 h-12 w-full disabled:opacity-50" disabled value={formatNumber(invoice.totalAmount || 0)} />
            </div>
        </div>

        <div className="mt-4 w-full">
            <label className="font-medium text-sm text-slate-500">Paid Amount</label>
            <input
                className={cn(
                    'border rounded-md px-2 focus:outline-react-500 h-12 w-full',
                    Number(invoice.paidAmount) > Number(invoice.totalAmount) && 'border-error focus:outline-error',
                )}
                value={invoice.paidAmount}
                onChange={(event) => {
                    const value = parseFloat(event.target.value || '0');
                    invoice.paidAmount = value;
                    setInvoice(invoice);
                }}
            />
            {Number(invoice.paidAmount) > Number(invoice.totalAmount) && <div className="text-xs text-error">Paid amount should be less than total amount</div>}
            {Number(invoice.paidAmount) === Number(invoice.totalAmount) && <div className="text-xs text-success">All cleared!</div>}
        </div>
    </div >;
}