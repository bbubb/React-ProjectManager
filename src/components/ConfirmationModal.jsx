const ConfirmationModal = ({ show, onClose, onConfirm, title, message }) => {
    if (!show) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-8">
            <h2 className="text-xl font-bold mb-4">{title}</h2>
            <p className="mb-4">{message}</p>
            <div className="flex justify-end space-x-2">
              <button
                className="bg-red-500 text-white px-4 py-2 rounded"
                onClick={onConfirm}
              >
                Confirm
              </button>
              <button
                className="bg-gray-300 text-black px-4 py-2 rounded"
                onClick={onClose}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      );
    };
    
    export default ConfirmationModal;