import { ChevronLeft } from 'lucide-react';

export function BackButton({
    onClick,
}: {
    onClick?: () => void;
}) {
    return <button
        className="flex flex-row my-4 text-vue-700 font-medium py-2 px-4 active:scale-90 rounded"
        onClick={() => onClick?.()}
    >
        <ChevronLeft className="w-5 h-5 inline-block mr-1 mt-0.5" />
        <div>Back</div>
    </button>;
}