import { useCallback, useEffect, useState } from "react";
import { SalesInvoice } from "../models/SalesInvoice.p";
import { useLocation, useRoute } from "wouter";
import { BackButton } from "../components/BackButton";
import { cn } from "../utils/cn";
import { formatNumber } from "../utils/number";
import { Alert } from "../components/Alert";
import { CheckCircle, InfoIcon } from "lucide-react";
import { useRealtime } from "pocketto-react";

export function DemoRealTimeView() {
    const [_, params] = useRoute("/realtime/:id");
    const [id, setId] = useState<string | undefined>(params?.id === 'new' ? undefined : params?.id);
    const [invoice, setInvoice] = useRealtime(SalesInvoice, id);
    const [__, setLocation] = useLocation();
    const [saved, setSaved] = useState(false);
    const [beingUpdated, setBeingUpdated] = useState(false);

    useEffect(() => {
        setId(params?.id === 'new' ? undefined : params?.id);
    }, [params?.id]);

    const [rev, setRev] = useState('');
    useEffect(() => {
        if (invoice.rev !== rev && rev && invoice.rev && !saved) {
            setBeingUpdated(true);
            setTimeout(() => setBeingUpdated(false), 3000);
        } else {
            setRev(invoice.rev);
        }
    }, [invoice.rev, rev, saved]);

    const save = useCallback(async () => {
        invoice.subtotalAmount = Number(invoice.subtotalAmount);
        invoice.taxRate = Number(invoice.taxRate);
        invoice.taxAmount = Number(invoice.taxAmount);
        invoice.totalAmount = Number(invoice.totalAmount);
        invoice.paidAmount = Number(invoice.paidAmount);
        setInvoice(await invoice.save());
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    }, [invoice]);

    const del = useCallback(async () => {
        await invoice.delete(true);
        setLocation('/realtime-list', { replace: true });
    }, [invoice, setLocation]);

    return <div>
        <Alert type='success' title="Invoice saved!" show={saved} icon={<CheckCircle className="w-5 h-5 inline-block mr-2 mt-0.5" />} />
        <Alert type='info' title="Invoice was updated by other user!" show={beingUpdated} icon={<InfoIcon className="w-5 h-5 inline-block mr-2 mt-0.5" />} />

        <div className="flex justify-between">
            <div className="text-2xl font-semibold">{id ? 'Update invoice' : 'Create new invoice'}</div>
            <div className="flex flex-row gap-4">
                <BackButton
                    onClick={() => setLocation('/realtime-list', { replace: true })}
                />
                <button
                    className="my-4 bg-react-700 hover:bg-react-900 text-white active:scale-90 font-medium py-2 px-4 rounded"
                    onClick={save}
                >
                    Save
                </button>
                <button
                    disabled={!id}
                    className="my-4 bg-error text-white active:scale-90 disabled:active:scale-100 disabled:opacity-50 font-medium py-2 px-4 rounded"
                    onClick={del}
                >
                    Delete
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
                        invoice.subtotalAmount = event.target.value;
                        const value = Number(event.target.value || '0');
                        invoice.taxAmount = Number(value) * Number(invoice.taxRate) / 100;
                        const totalAmount = Number(value) + Number(invoice.taxAmount);
                        invoice.totalAmount = totalAmount;
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
                        invoice.taxRate = event.target.value;
                        const value = Number(event.target?.value || '0');
                        invoice.taxAmount = Number(invoice.subtotalAmount) * value / 100;
                        const totalAmount = Number(invoice.subtotalAmount) + Number(invoice.taxAmount);
                        invoice.totalAmount = totalAmount;
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
                    invoice.paidAmount = event.target.value;
                    setInvoice(invoice);
                }}
            />
            {Number(invoice.paidAmount) > Number(invoice.totalAmount) && <div className="text-xs text-error">Paid amount should be less than total amount</div>}
            {Number(invoice.paidAmount) === Number(invoice.totalAmount) && <div className="text-xs text-success">All cleared!</div>}
        </div>
    </div >;
}