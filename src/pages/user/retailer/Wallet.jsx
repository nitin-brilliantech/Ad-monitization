import { useState, useEffect } from 'react';
import { FaRedo } from 'react-icons/fa';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import Button from "../../../components/ui/button/Button";
import ReusableTable from '../../../components/table/ReusableTable';
import { Modal } from '../../../components/ui/modal/Modal';
import WithdrawEarnings from './WithdrawEarning';
import ApprovalBadge from '../../../components/ui/badges/ApprovalBadge';
import { useDispatch, useSelector } from 'react-redux';
import { fetchWalletBalance, fetchWithdrawalRequests, cancelWithdrawalRequest } from '../../../redux/slices/user/walletSlice';
import Swal from 'sweetalert2';
import Loader from '../../../components/loader/Loader';
import Toast from "../../../components/ui/toast/Toast"
const Wallets = () => {
    const [balanceVisible, setBalanceVisible] = useState(false);
    const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false); // State for refresh animation

    const dispatch = useDispatch();
    const {
        balance = 0,
        loading,
        error,
        withdrawalRequests = [],
        withdrawalLoading,
        cancellationLoading,
        
    } = useSelector((state) => state.wallet);



    useEffect(() => {
        dispatch(fetchWalletBalance());
        dispatch(fetchWithdrawalRequests());
    }, [dispatch]);

    // Function to handle refresh button click
    const handleRefreshBalance = async () => {
        setIsRefreshing(true);
        try {
            await dispatch(fetchWalletBalance()).unwrap();
            // Animation will run for at least 1 second (matches CSS animation duration)
            setTimeout(() => setIsRefreshing(false), 1000);
        } catch (error) {
            setIsRefreshing(false);
            console.error("Failed to refresh balance:", error);
        }
    };

    const formatBalance = (amount) =>
        new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount);

    const toggleBalanceVisibility = (e) => {
        e?.stopPropagation();
        setBalanceVisible(!balanceVisible);
    };

    const openWithdrawModal = () => {
        const hasPending = withdrawalRequests.some((row) => row.status === "PENDING");

        if (hasPending) {
            Toast.warning("Pending Request Found","You already have a pending withdrawal request. Please wait for it to be approved or rejected before making a new request." )
            return;
        }
        setIsWithdrawModalOpen(true);
    };

    const closeWithdrawModal = () => setIsWithdrawModalOpen(false);

    const handleOpenDetailsModal = (row) => {
        setSelectedRow(row);
        setModalOpen(true);
    };

    const handleCloseModal = () => setModalOpen(false);

    const handleCancelRequest = async (walletId, e) => {
        e.stopPropagation();

        try {
            const result = await Swal.fire({
                position:"top-right",
                title: "Cancel Request?",
                text: "Are you sure you want to cancel this request?",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#d33",
                cancelButtonColor: "#445E94",
                confirmButtonText: "Yes, Cancel it",
                cancelButtonText: "No, Keep it",
            });

            if (result.isConfirmed) {
                await dispatch(cancelWithdrawalRequest(walletId)).unwrap();
                Toast.success("Cancelled!","Your withdrawal request has been cancelled.")

                
                dispatch(fetchWithdrawalRequests());
            }
        } catch (error) {
            Toast.error("Failed",error.message || "Failed to cancel withdrawal request. Please try again.")
        }
    };

    const columns = [
        { id: "requestCode", label: "Request ID" },
        { id: "amount", label: "Amount" },
        { id: "paymentMethod", label: "Payment Method" },
        { id: "reqDate", label: "Request Date" },
        {
            id: "status",
            label: "Status",
            render: (row) => <ApprovalBadge status={row.status} size={12} />,
        },
        { id: "action", label: "Action" },
    ];
    
    const rows = (withdrawalRequests || []).map((row) => ({
      ...row,
      _statusRaw: row.status,
      action: row.status === "PENDING" ? (
        cancellationLoading ? (
          <Loader size="vs" />
        ) : (
          <button
            className="px-3 py-1 rounded-lg text-white text-sm font-medium bg-red-800 hover:bg-red-700 hover:cursor-pointer"
            onClick={(e) => handleCancelRequest(row.walletId, e)}
            disabled={cancellationLoading}
          >
            Cancel Request
          </button>
        )
      ) : (
        <span className="text-gray-500 italic">No Action Available</span>
      ),
    }));

    return (
        <div className="p-4">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Wallets</h2>
            </div>

            {/* Balance Card */}
            <div className="flex justify-between mb-5 items-center bg-gradient-to-l from-blue-100 via-white to-white border-blue-100/50 p-4 rounded">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <h2 className="text-lg font-semibold">Current Balance</h2>
                        <FaRedo 
                            className={`h-3 w-3 hover:cursor-pointer ${isRefreshing ? 'spin-animation' : ''}`}
                            onClick={handleRefreshBalance}
                        />
                    </div>
                    <div className="flex items-center gap-2 mb-1">
                        {loading ? (
                            <p className="text-2xl font-bold text-blue-900">Loading...</p>
                        ) : error ? (
                            <p className="text-red-500">Error fetching balance</p>
                        ) : (
                            <p className="text-2xl font-bold text-blue-900">
                                {balanceVisible ? formatBalance(balance) : '₹ XXXXXX'}
                            </p>
                        )}
                        <button onClick={toggleBalanceVisibility} className="text-gray-500 hover:text-gray-700">
                            {balanceVisible ? <EyeSlashIcon className="h-5 w-5 hover:cursor-pointer" /> : <EyeIcon className="h-5 w-5 hover:cursor-pointer" />}
                        </button>
                    </div>

                </div>
                <Button
                    label="Withdraw Earnings"
                    onClick={openWithdrawModal}
                    isIcon={false}
                    className="hover:cursor-pointer"
                />
            </div>

            {/* Requests Table */}
            <ReusableTable
                columns={columns}
                rows={rows}
                filterKey="_statusRaw"
                filterOptions={["all", "Approved", "Pending", "Rejected"]}
                onRowClick={handleOpenDetailsModal}
                loading={withdrawalLoading}
                onRefresh={()=>dispatch(fetchWithdrawalRequests())}
                searchableColumns={["requestCode","amount","reqDate","paymentMethod"]}
            />

            {/* Withdraw Modal */}
            <Modal isOpen={isWithdrawModalOpen} onClose={closeWithdrawModal} size="md">
                <WithdrawEarnings onClose={closeWithdrawModal} balance={balance} />
            </Modal>

            {/* Details Modal */}
            <Modal isOpen={modalOpen} onClose={handleCloseModal} size="md" showCloseButton={true}>
                {selectedRow && (
                    <div className="space-y-6">
                        {/* Header */}
                        <div className="flex items-center justify-between -m-6 mb-0 p-6 pr-20 bg-[#4684ff] rounded-t-2xl">
                            <div className="flex gap-4">
                                <div className="w-15 h-15 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2} className="w-7 h-7">
                                        <path strokeLinecap="round" strokeLinejoin="round"
                                            d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-white">Withdrawal Request</h2>
                                    <p className="text-md text-white/70 mt-0.5">Request details and status</p>
                                </div>
                            </div>
                            <ApprovalBadge status={selectedRow.status} size={12} />
                        </div>

                        {/* Content */}
                        <div className="space-y-4 pt-2">
                            <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                                <span className="font-semibold text-md text-gray-900">Request Code</span>
                                <span className="text-sm text-gray-700">{selectedRow.requestCode}</span>
                            </div>

                            <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                                <span className="font-semibold text-md text-gray-900">Amount</span>
                                <span className="text-sm text-gray-900 font-bold">₹{selectedRow.amount}</span>
                            </div>

                            <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                                <span className="font-semibold text-md text-gray-900">Payment Method</span>
                                <span className="text-sm text-gray-700 uppercase">{selectedRow.paymentMethod}</span>
                            </div>

                            <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                                <span className="font-semibold text-md text-gray-900">Request Date</span>
                                <span className="text-sm text-gray-700">{selectedRow.reqDate}</span>
                            </div>

                            {selectedRow.status === "REJECTED" && selectedRow.cancelReqDate && (
                                <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                                    <span className="font-semibold text-md text-gray-900">Canceled At</span>
                                    <span className="text-sm text-gray-700">{selectedRow.cancelReqDate}</span>
                                </div>
                            )}

                            {selectedRow.status === "REJECTED" && selectedRow.adminRemark && (
                                <div className="pb-3 border-b border-gray-100">
                                    <span className="font-semibold text-md text-gray-900 block mb-2">Admin Remark</span>
                                    <div className="px-3 py-2 bg-red-50 rounded-md text-sm text-gray-700">
                                        {selectedRow.adminRemark}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </Modal>
            
        
        </div>
    );
};

export default Wallets;