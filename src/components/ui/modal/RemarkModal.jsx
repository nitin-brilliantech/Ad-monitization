import { Modal } from "./Modal";
import { MessageSquare } from "lucide-react";

const RemarkModal = ({ isOpen, onClose, onSubmit, remark, setRemark, label = "Reject Request" }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm" showCloseButton={true}>
      <div className="space-y-6">
        {/* Blue Header */}
        <div className="flex items-center -m-6 mb-0 p-6 pr-20 bg-[#4684ff] rounded-t-2xl">
          <div className="flex gap-4">
            <div className="w-15 h-15 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <MessageSquare className="w-7 h-7 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">{label}</h2>
              <p className="text-md text-white/70 mt-0.5">Provide a reason for rejection</p>
            </div>
          </div>
        </div>

        {/* Textarea */}
        <div className="pt-2 space-y-2">
          <label className="text-sm font-semibold text-gray-700">Remark</label>
          <textarea
            rows={4}
            value={remark}
            onChange={(e) => setRemark(e.target.value)}
            placeholder="Enter remark..."
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#4684ff]/40 resize-none bg-white"
          />
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 transition"
          >
            Cancel
          </button>
          <button
            onClick={onSubmit}
            disabled={!remark.trim()}
            className="px-4 py-2 rounded-lg text-sm bg-red-500 hover:bg-red-600 text-white transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Confirm
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default RemarkModal;
