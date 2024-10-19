import { cn } from "../utils/cn";

export function Alert({
    show = false,
    type,
    title,
}: {
    show?: boolean;
    type: 'success' | 'error' | 'warning' | 'info';
    title: string;
}) {
    if (!show) return <></>;
    return <div
        className={cn(
            'absolute top-4 right-4 px-4 py-2 min-w-[100px] rounded-md font-medium text-white',
            type === 'success' && 'bg-success',
            type === 'error' && 'bg-error',
            type === 'warning' && 'bg-warning',
            type === 'info' && 'bg-info',
            !type && 'bg-info'
        )}
    >
        <div className="flex flex-row">
            <slot name="icon"></slot>
            <div>{title}</div>
        </div>
    </div>;
}