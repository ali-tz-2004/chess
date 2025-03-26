interface PopupHistoryType{
    onClose: () => void;
    children: React.ReactNode;
}

export const PopupHistory = ({onClose, children}: PopupHistoryType) => {
    return(
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-primary p-6 rounded-2xl shadow-lg w-96 text-white">
                <h2 className="text-xl font-semibold mb-4 text-center">History</h2>
                {children}
                <button
                    className="mt-4 w-full bg-blue-100 text-black py-2 rounded-lg hover:bg-blue-600"
                    onClick={onClose}
                >
                    Close
                </button>
            </div>
        </div>
    )
};