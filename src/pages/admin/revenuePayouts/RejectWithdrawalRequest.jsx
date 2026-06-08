import React from "react";
import { Modal } from "../../../components/ui/modal/Modal";

const RejectWithdrawalModal = ({ isOpen, onClose, remark, setRemark, onSubmit }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md" showCloseButton={true}>
      <div className="p-4 space-y-3">
        <h3 className="text-lg font-semibold">Reject Withdrawal Request</h3>
        <textarea
          value={remark}
          onChange={(e) => setRemark(e.target.value)}
          placeholder="Reason for rejection..."
          className="w-full h-24 p-2 border rounded"
        />
        <div className="flex justify-end gap-2">
          <button className="bg-gray-300 px-4 py-2 rounded" onClick={onClose}>
            Cancel
          </button>
          <button
            className={`px-4 py-2 text-white rounded ${
              remark.trim()
                ? "bg-red-600 hover:bg-red-700 hover:cursor-pointer"
                : "bg-red-300 cursor-not-allowed"
            }`}
            onClick={onSubmit}
            disabled={!remark.trim()}
          >
            Submit
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default RejectWithdrawalModal;
