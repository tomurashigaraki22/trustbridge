'use client';

interface NotificationDialogProps {
    notice: {
        id: number;
        title: string;
        message: string;
        created_at: string;
    } | null;
    onClose: () => void;
    onRead: (id: number) => void;
}

export function NotificationDialog({ notice, onClose, onRead }: NotificationDialogProps) {
    if (!notice) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <div className="fixed inset-0 bg-black/50" onClick={onClose} />
            <div className="relative bg-[#1A1A1A] rounded-lg w-full max-w-md p-6">
                <h3 className="text-lg font-medium mb-2">{notice.title}</h3>
                <p className="text-gray-400 mb-4">{notice.message}</p>
                <div className="text-xs text-gray-500 mb-4">
                    {new Date(notice.created_at).toLocaleString()}
                </div>
                <div className="flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm bg-gray-800 hover:bg-gray-700 rounded-lg"
                    >
                        Close
                    </button>
                    <button
                        onClick={() => {
                            onRead(notice.id);
                            onClose();
                        }}
                        className="px-4 py-2 text-sm bg-purple-500 hover:bg-purple-600 rounded-lg"
                    >
                        Mark as Read
                    </button>
                </div>
            </div>
        </div>
    );
}