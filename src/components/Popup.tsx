interface PopupType {
    title: string;
    description: string;
    messageClose: string;
    messageReset: string;
    isOpen: boolean;
    onClose: () => void;
    onReset: () => void;
}
export const Popup = ({ title, description, messageClose,messageReset, isOpen, onClose,onReset }: PopupType) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-primary p-6 rounded-2xl shadow-lg w-96 text-white">
                <h2 className="text-xl font-semibold mb-4 text-center">{title}</h2>
                <p>{description}</p>
                <button
                    onClick={onClose}
                    className="mt-4 w-full bg-blue-100 text-black py-2 rounded-lg hover:bg-blue-600"
                >
                    {messageClose}
                </button>
                <button
                    onClick={onReset}
                    className="mt-4 w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
                >
                    {messageReset}
                </button>
            </div>
        </div>
    );
};