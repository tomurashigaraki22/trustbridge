interface NotificationModalProps {
    notice: {
        id: number;
        title: string;
        message: string;
        created_at: string;
        type: string;
    } | null;
    onClose: () => void;
}

export function NotificationModal({ notice, onClose }: NotificationModalProps) {
    if (!notice) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="fixed inset-0 bg-black/50" onClick={onClose} />
            <div className="relative w-full max-w-lg bg-[#1A1A1A] rounded-lg p-6">
                <div className="mb-6">
                    <h2 className="text-xl font-semibold mb-2">{notice.title}</h2>
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                        <span className="capitalize">{notice.type}</span>
                        <span>•</span>
                        <span>{new Date(notice.created_at).toLocaleString()}</span>
                    </div>
                </div>
                <p className="text-gray-300 mb-6 whitespace-pre-wrap">{notice.message}</p>
                <button
                    onClick={onClose}
                    className="w-full bg-purple-500 hover:bg-purple-600 text-white py-2 rounded-lg transition-colors"
                >
                    Close
                </button>
            </div>
        </div>
    );
}