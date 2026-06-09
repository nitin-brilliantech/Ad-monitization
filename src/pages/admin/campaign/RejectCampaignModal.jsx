import { Modal } from "../../../components/ui/modal/Modal";

const RejectCampaignModal = ({
  isOpen,
  onClose,
  remark,
  setRemark,
  onSubmit,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md" showCloseButton={true}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center -m-6 mb-0 p-6 pr-20 bg-red-500 rounded-t-2xl">
          <h2 className="text-2xl font-bold text-white">Reject Campaign</h2>
        </div>
        <div className="space-y-4 pt-2">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Reason for Rejection <span className="text-red-500">*</span></label>
            <textarea value={remark} onChange={(e) => setRemark(e.target.value)} placeholder="Provide a clear reason for rejection..."
              className="w-full h-28 p-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-300 focus:border-red-400 resize-none" />
          </div>
          <div className="flex justify-end gap-3 pt-2 border-t border-gray-100">
            <button onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-500 bg-gray-100 hover:bg-gray-200 rounded-full transition-all duration-150 cursor-pointer">
              Cancel
            </button>
            <button onClick={onSubmit} disabled={!remark.trim()}
              className={`px-5 py-2 text-sm font-medium text-white rounded-full transition-all duration-150 cursor-pointer ${
                remark.trim() ? "bg-red-500 hover:bg-red-600 shadow-md" : "bg-red-300 cursor-not-allowed"
              }`}>
              Reject Campaign
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default RejectCampaignModal;
