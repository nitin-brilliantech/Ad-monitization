import { useState/*, useEffect*/ } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { addTicket /*, fetchTickets, updateTicketStatus*/ } from "../../../redux/slices/user/ticketsSlice";
import Button from "../../../components/ui/button/Button";
import ReusableTable from "../../../components/table/ReusableTable";
import { Modal } from "../../../components/ui/modal/Modal";
import FormBuilder from "../../../components/form/FromBuilder";
import Swal from "sweetalert2";
import TicketDetailsModal from "./TicketDetailsModal";

const TicketRaise = () => {
    const dispatch = useDispatch();
    const { list: tickets, loading } = useSelector((state) => state.tickets);

    const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

    const methods = useForm();

    // Commented out fetchTickets
    /*
    useEffect(() => {
        dispatch(fetchTickets());
    }, [dispatch]);
    */

    const openTicketModal = () => setIsTicketModalOpen(true);
    const closeTicketModal = () => setIsTicketModalOpen(false);

    const handleOpenDetailsModal = (ticket) => {
        setSelectedTicket(ticket);
        setIsDetailsModalOpen(true);
    };

    const handleCloseDetailsModal = () => {
        setIsDetailsModalOpen(false);
        setSelectedTicket(null);
    };

    // Commented out updateTicketStatus
    /*
    const handleStatusUpdate = (updatedTicket) => {
        dispatch(updateTicketStatus({
            ticketID: updatedTicket.ticketID,
            status: updatedTicket.status,
        }));
    };
    */

    const columns = [
        {
            id: "ticketID",
            label: "Ticket ID ",
            render: (row) => (
                <span
                    onClick={(e) => {
                        e.stopPropagation();
                        handleOpenDetailsModal(row);
                    }}
                    className="cursor-pointer hover:text-blue-600 hover:underline "
                >
                    {row.ticketID}
                </span>
            ),
        },
        {
            id: "subject",
            label: "Subject",
            render: (row) => (
                <span
                    onClick={(e) => {
                        e.stopPropagation();
                        handleOpenDetailsModal(row);
                    }}
                    className="cursor-pointer hover:text-blue-600 hover:underline "
                >
                    {row.subject}
                </span>
            ),
        },
        { id: "raisedAt", label: "Raised At" },
        {
            id: "status",
            label: "Status",
            render: (row) => {
                const styles = {
                    OPEN: "bg-orange-100 text-orange-700",
                    INPROGRESS: "bg-yellow-100 text-yellow-700",
                    RESOLVED: "bg-blue-100 text-blue-700",
                    REOPEN: "bg-red-100 text-red-700",
                    CLOSED: "bg-green-100 text-green-700",
                };
                return (
                    <span
                        className={`px-3 py-1 rounded text-sm ${styles[row.status] || "bg-gray-100 text-gray-700"
                            }`}
                    >
                        {row.status}
                    </span>
                );
            },
        },
    ];

    const ticketFields = [
        [
            {
                name: "subject",
                label: "Subject",
                type: "input",
                placeholder: "Brief description of your issue",
                required: true,
                gridSpan: 3,
                className: "mb-4",
            },
        ],
        [
            {
                name: "category",
                label: "Category",
                type: "select",
                options: [
                    { label: "Software", value: "Software" },
                    { label: "Hardware", value: "Hardware" },
                    { label: "Other", value: "other" },
                ],
                required: true,
                gridSpan: 1,
                className: "mb-4",
            },
        ],
        [
            {
                name: "description",
                label: "Description",
                type: "input",
                placeholder: "Please describe your issue in detail...",
                required: true,
                gridSpan: 3,
                className: "mb-4",
            },
        ],
        [
            {
                name: "attachments",
                label: "Upload Media",
                type: "file",
                accept: "image/*,.pdf,.doc,.docx",
                multiple: true,
                gridSpan: 3,
                helperText: "Format: jpeg, png, mp4. Max file size: 5MB.",
                className: "mb-4",
            },
        ],
    ];

    const handleSubmitTicket = async (data) => {
        console.log("submitting data",data)
        await dispatch(addTicket(data));
        closeTicketModal();
        methods.reset();
        Swal.fire({
            title: "Ticket raised!",
            text: "Updated status has been sent!",
            icon: "success",
            confirmButtonText: "OK",
        });
    };

    return (
        <div className="p-4">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-800">Tickets history</h2>
            </div>

            <div className="flex justify-end rounded-2xl mb-5 bg-gradient-to-l from-blue-100 via-white to-white border-blue-100/50 p-4">
                <Button isIcon={false} label="Raise Ticket" onClick={openTicketModal} type="button" />
            </div>

            <ReusableTable
                columns={columns}
                rows={tickets}
                filterOptions={["all", "OPEN", "INPROGRESS", "RESOLVED", "REOPEN", "CLOSED"]}
                filterKey="status"
                onRowClick={() => { }}
                loading={loading}
            />

            <Modal
                isOpen={isTicketModalOpen}
                onClose={closeTicketModal}
                size="lg"
                showCloseButton={true}
            >
                <div className="space-y-6">
                    {/* Blue Header */}
                    <div className="flex items-center -m-6 mb-0 p-6 pr-20 bg-[#4684ff] rounded-t-2xl">
                        <div className="flex gap-4">
                            <div className="w-15 h-15 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                                <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2} className="w-7 h-7">
                                    <path strokeLinecap="round" strokeLinejoin="round"
                                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                                </svg>
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-white">Raise Ticket</h2>
                                <p className="text-md text-white/70 mt-0.5">Submit your issue or concern</p>
                            </div>
                        </div>
                    </div>

                    {/* Form Content */}
                    <div className="pt-2">
                        <FormBuilder
                            onSubmit={handleSubmitTicket}
                            fieldsConfig={ticketFields}
                            methods={methods}
                            submitLabel="Submit Ticket"
                            isPlus={false}
                            title="" // Empty title since we have custom header
                        />
                    </div>
                </div>
            </Modal>

            <TicketDetailsModal
                isOpen={isDetailsModalOpen}
                onClose={handleCloseDetailsModal}
                ticket={selectedTicket}
                // onStatusUpdate={handleStatusUpdate} // commented out
            />
        </div>
    );
};

export default TicketRaise;








// import { useState } from 'react';
// import { useForm } from 'react-hook-form';
// import Button from "../../components/ui/button/Button";
// import ReusableTable from '../../components/table/ReusableTable';
// import { Modal } from '../../components/ui/modal/Modal';
// import FormBuilder from '../../components/form/FromBuilder';
// import Swal from 'sweetalert2';
// import TicketDetailsModal from './TicketDetailsModal';
// import { Toaster } from 'react-hot-toast';

// const TicketRaise = () => {
//     const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);
//     const [selectedTicket, setSelectedTicket] = useState(null);
//     const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
//     const [rows, setRows] = useState([
//         {
//             id: 1,
//             srNo: 1,
//             ticketID: "TKT-1001",
//             userName: "John Carter",
//             businessName: "QuickKart",
//             role: "Retailer",
//             subject: "Campaign approval delay",
//             status: "INPROGRESS",
//             priority: "Critical",
//             raisedAt: "2023-05-15",
//             mobile: "+1 555-123-4567",
//             email: "john.carter@quickkart.com",
//             category: "Software",
//             media: [
//                 "/src/pages/TicketSystem/mediaTicket/m2.jpg",
//                 "/src/pages/TicketSystem/mediaTicket/m3.jpg"
//             ],
//             adminRemark: "",
//             userRemark: "",
//             description: "The summer campaign needs urgent approval as the launch date is approaching. We've submitted all required creative assets and targeting parameters. Please review and approve at the earliest to meet our marketing timeline."
//         },
//         {
//             id: 2,
//             srNo: 2,
//             ticketID: "TKT-1002",
//             userName: "Jane Williams",
//             businessName: "AdPro",
//             role: "Ad Agency",
//             subject: "Payment discrepancy",
//             status: "OPEN",
//             priority: "Moderate",
//             raisedAt: "2023-05-16",
//             mobile: "+1 555-234-5678",
//             email: "jane.williams@adpro.com",
//             category: "Software",
//             media: [
//                 "/src/pages/TicketSystem/mediaTicket/m4.jpg"
//             ],
//             adminRemark: "",
//             userRemark: "",
//             description: "Invoice #12345 for the May campaign shows an incorrect amount of $5,000 instead of the agreed $4,200. We've attached the contract and our calculations. Please verify and issue a corrected invoice."
//         },
//         {
//             id: 3,
//             srNo: 3,
//             ticketID: "TKT-1003",
//             userName: "Robert Chen",
//             businessName: "TechSolutions",
//             role: "Retailer",
//             subject: "Dashboard not loading",
//             status: "REOPEN",
//             priority: "Low",
//             raisedAt: "2023-05-17",
//             mobile: "+1 555-345-6789",
//             email: "robert.chen@techsolutions.com",
//             category: "Hardware",
//             media: [
//                 "/src/pages/TicketSystem/mediaTicket/m5.jpg"
//             ],
//             adminRemark: "The issue was initially marked as resolved after clearing cache, but it appears to be a deeper compatibility issue with the latest browser updates.",
//             userRemark: "The dashboard is still not loading after trying different browsers and clearing cache multiple times. We need this fixed urgently for our monthly reporting.",
//             description: "The analytics dashboard fails to load with a 502 error. This started after the recent system update. We've tried clearing cache and different browsers. Screenshot of the error is attached."
//         },
//         {
//             id: 4,
//             srNo: 4,
//             ticketID: "TKT-1004",
//             userName: "Emily Park",
//             businessName: "DigitalMedia",
//             role: "Ad Agency",
//             subject: "Bid adjustment request",
//             status: "INPROGRESS",
//             priority: "Moderate",
//             raisedAt: "2023-05-18",
//             mobile: "+1 555-456-7890",
//             email: "emily.park@digitalmedia.com",
//             category: "Software",
//             media: [
//                 "/src/pages/TicketSystem/mediaTicket/m6.jpg",
//                 "/src/pages/TicketSystem/mediaTicket/m1.mp4"
//             ],
//             adminRemark: "",
//             userRemark: "",
//             description: "Requesting to increase max bid for campaign 'Summer Sale' from $1.50 to $2.00 due to increased competition. The campaign is underperforming on key metrics and needs this adjustment to remain competitive."
//         },
//         {
//             id: 5,
//             srNo: 5,
//             ticketID: "TKT-1005",
//             userName: "Michael Brown",
//             businessName: "ElectroWorld",
//             role: "Retailer",
//             subject: "Reporting data mismatch",
//             status: "OPEN",
//             priority: "Low",
//             raisedAt: "2023-05-19",
//             mobile: "+1 555-567-8901",
//             email: "michael.brown@electroworld.com",
//             category: "Hardware",
//             media: [
//                 "/src/pages/TicketSystem/mediaTicket/m7.jpg",
//                 "/src/pages/TicketSystem/mediaTicket/m8.png"
//             ],
//             adminRemark: "",
//             userRemark: "",
//             description: "The sales report for May shows discrepancies between our internal records and the platform data. Specifically, the conversions for product SKU#EW-345 are underreported by approximately 15%. Need clarification on data sources."
//         },
//         {
//             id: 6,
//             srNo: 6,
//             ticketID: "TKT-1006",
//             userName: "Sarah Miller",
//             businessName: "CreativeAds",
//             role: "Ad Agency",
//             subject: "Urgent: Campaign pause request",
//             status: "RESOLVED",
//             priority: "Critical",
//             raisedAt: "2023-05-20",
//             mobile: "+1 555-678-9012",
//             email: "sarah.miller@creativeads.com",
//             category: "Software",
//             media: [
//                 "/src/pages/TicketSystem/mediaTicket/m9.jpg",
//                 "/src/pages/TicketSystem/mediaTicket/m10.jpg"
//             ],
//             adminRemark: "Campaign has been paused and confirmation email sent to user. Awaiting corrected product feed.",
//             userRemark: "Thank you for the quick response. We've uploaded the corrected product feed and will notify you when we're ready to relaunch the campaign.",
//             description: "Need to immediately pause campaign 'Summer Promo' as we've discovered incorrect pricing in the product feed. Continuing to run ads would result in significant financial loss. Please confirm pause and we'll follow up with corrected feed."
//         }
//     ]);
//     const methods = useForm();

//     const openTicketModal = () => setIsTicketModalOpen(true);
//     const closeTicketModal = () => setIsTicketModalOpen(false);

//     const handleOpenDetailsModal = (ticket) => {
//         setSelectedTicket(ticket);
//         setIsDetailsModalOpen(true);
//     };

//     const handleCloseDetailsModal = () => {
//         setIsDetailsModalOpen(false);
//         setSelectedTicket(null);
//     };

//     const handleStatusUpdate = (updatedTicket) => {
//         setRows(rows.map(ticket =>
//             ticket.ticketID === updatedTicket.ticketID ? updatedTicket : ticket
//         ));
//     };

//     const columns = [
//         {
//             id: "ticketID",
//             label: "Ticket ID ",
//             render: (row) => (
//                 <span
//                     onClick={(e) => {
//                         e.stopPropagation();
//                         handleOpenDetailsModal(row);
//                     }}
//                     className="cursor-pointer hover:text-blue-600 hover:underline "
//                 >
//                     {row.ticketID}
//                 </span>
//             ),
//         },
//         {
//             id: "subject",
//             label: "Subject",
//             render: (row) => (
//                 <span
//                     onClick={(e) => {
//                         e.stopPropagation();
//                         handleOpenDetailsModal(row);
//                     }}
//                     className="cursor-pointer hover:text-blue-600 hover:underline "
//                 >
//                     {row.subject}
//                 </span>
//             ),
//         },
//         { id: "raisedAt", label: "Raised At" },
//         {
//             id: "status",
//             label: "Status",
//             render: (row) => {
//                 const styles = {
//                     OPEN: "bg-orange-100 text-orange-700",
//                     INPROGRESS: "bg-yellow-100 text-yellow-700",
//                     RESOLVED: "bg-blue-100 text-blue-700",
//                     REOPEN: "bg-red-100 text-red-700",
//                     CLOSED: "bg-green-100 text-green-700",
//                 };

//                 return (
//                     <span
//                         className={`px-3 py-1 rounded text-sm ${styles[row.status] || "bg-gray-100 text-gray-700"
//                             }`}
//                     >
//                         {row.status}
//                     </span>
//                 );
//             },
//         },
//     ];

//     // Form configuration
//     const ticketFields = [
//         [
//             {
//                 name: "subject",
//                 label: "Subject",
//                 type: "input",
//                 placeholder: "Brief description of your issue",
//                 required: true,
//                 gridSpan: 3,
//                 className: "mb-4",
//             }
//         ],
//         [
//             {
//                 name: "category",
//                 label: "Category",
//                 type: "select",
//                 options: [
//                     { label: "Software", value: "Software" },
//                     { label: "Hardware", value: "Hardware" },
//                     { label: "Other", value: "other" }
//                 ],
//                 required: true,
//                 gridSpan: 1,
//                 className: "mb-4",
//             }
//         ],
//         [
//             {
//                 name: "description",
//                 label: "Description",
//                 type: "input",
//                 placeholder: "Please describe your issue in detail...",
//                 required: true,
//                 gridSpan: 3,
//                 className: "mb-4"
//             }
//         ],
//         [
//             {
//                 name: "attachments",
//                 label: "Upload Media",
//                 type: "file",
//                 accept: "image/*,.pdf,.doc,.docx",
//                 multiple: true,
//                 gridSpan: 3,
//                 helperText: "Format: jpeg, png, mp4. Max file size: 5MB.",
//                 className: "mb-4"
//             }
//         ]
//     ];

//     const handleSubmitTicket = (data) => {
//         console.log("Ticket data:", data);
//         closeTicketModal();
//         methods.reset();

//         Swal.fire({
//             title: "Ticket raised!",
//             text: "Updated status has been sent!",
//             icon: "success",
//             confirmButtonText: "OK"
//         });
//     };

//     return (
//         <div className="p-4">
//             <Toaster position="bottom-right" />
//             <div className="flex justify-between items-center mb-4">
//                 <h2 className="text-2xl font-bold text-gray-800">Tickets history</h2>
//             </div>

//             <div className="flex justify-end rounded-2xl mb-5 bg-gradient-to-l from-blue-100 via-white to-white border-blue-100/50 p-4">
//                 <Button
//                     isIcon={false}
//                     label="Raise Ticket"
//                     onClick={openTicketModal}
//                     type="button"
//                 />
//             </div>

//             <ReusableTable
//                 columns={columns}
//                 rows={rows}
//                 filterOptions={["all", "OPEN", "INPROGRESS", "RESOLVED", "REOPEN", "CLOSED"]}
//                 filterKey="status"
//                 onRowClick={() => { }}
//             />

//             <Modal
//                 isOpen={isTicketModalOpen}
//                 onClose={closeTicketModal}
//                 size="lg"
//                 containerClassName="bg-white rounded-xl w-full max-w-3xl"
//             >
//                 <FormBuilder
//                     title="Ticket Form"
//                     onSubmit={handleSubmitTicket}
//                     fieldsConfig={ticketFields}
//                     methods={methods}
//                     submitLabel="Submit Ticket"
//                     isPlus={false}
//                 />
//             </Modal>

//             <TicketDetailsModal
//                 isOpen={isDetailsModalOpen}
//                 onClose={handleCloseDetailsModal}
//                 ticket={selectedTicket}
//                 onStatusUpdate={handleStatusUpdate}
//             />
//         </div>
//     );
// };

// export default TicketRaise;
















// Main is above this






// import { useState } from 'react';
// import { useForm } from 'react-hook-form';
// import Button from "../../components/ui/button/Button";
// import ReusableTable from '../../components/table/ReusableTable';
// import { Modal } from '../../components/ui/modal/Modal';
// import FormBuilder from '../../components/form/FromBuilder';
// import Swal from 'sweetalert2';
// import TicketDetailsModal from './TicketDetailsModal';
// import { toast, Toaster } from 'react-hot-toast';

// const TicketRaise = () => {
//     const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);
//     const [selectedTicket, setSelectedTicket] = useState(null);
//     const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
//     const methods = useForm();

//     const openTicketModal = () => setIsTicketModalOpen(true);
//     const closeTicketModal = () => setIsTicketModalOpen(false);

//     const handleOpenDetailsModal = (ticket) => {
//         setSelectedTicket(ticket);
//         setIsDetailsModalOpen(true);
//     };

//     const handleCloseDetailsModal = () => {
//         setIsDetailsModalOpen(false);
//         setSelectedTicket(null);
//     };

//     const columns = [
//         {
//             id: "ticketID",
//             label: "Ticket ID ",
//             render: (row) => (
//                 <span
//                     onClick={(e) => {
//                         e.stopPropagation();
//                         handleOpenDetailsModal(row);
//                     }}
//                     className="cursor-pointer hover:text-blue-600 hover:underline "
//                 >
//                     {row.ticketID}
//                 </span>
//             ),
//         },
//         {
//             id: "subject",
//             label: "Subject",
//             render: (row) => (
//                 <span
//                     onClick={(e) => {
//                         e.stopPropagation();
//                         handleOpenDetailsModal(row);
//                     }}
//                     className="cursor-pointer hover:text-blue-600 hover:underline "
//                 >
//                     {row.subject}
//                 </span>
//             ),
//         },
//         { id: "raisedAt", label: "Raised At" },
//         {
//             id: "status",
//             label: "Status",
//             render: (row) => {
//                 const styles = {
//                     OPEN: "bg-orange-100 text-orange-700",
//                     INPROGRESS: "bg-yellow-100 text-yellow-700",
//                     RESOLVED: "bg-blue-100 text-blue-700",
//                     REOPEN: "bg-red-100 text-red-700",
//                     CLOSED: "bg-green-100 text-green-700",
//                 };

//                 return (
//                     <span
//                         className={`px-3 py-1 rounded text-sm ${
//                             styles[row.status] || "bg-gray-100 text-gray-700"
//                         }`}
//                     >
//                         {row.status}
//                     </span>
//                 );
//             },
//         },
//     ];

//     const rows = [
//     {
//         ticketID: "TKT-1001",
//         subject: "Ad campaign not displaying",
//         raisedAt: "2023-05-15",
//         status: "OPEN",
//         description: "The ad campaign I created last week is not showing up in the dashboard. I've checked all settings and they appear correct.",
//         adminRemark: "We've identified a caching issue with new campaigns. Our engineering team is working on a fix expected by EOD tomorrow."
//     },
//     {
//         ticketID: "TKT-1002",
//         subject: "Payment withdrawal issue",
//         raisedAt: "2023-05-10",
//         status: "RESOLVED",
//         description: "Unable to withdraw my earnings. The system says 'processing' but it's been 7 days.",
//         adminRemark: "Payment was processed successfully on 2023-05-12. The delay was due to additional fraud verification checks. Funds should now be in your account."
//     },
//     {
//         ticketID: "TKT-1003",
//         subject: "Dashboard metrics incorrect",
//         raisedAt: "2023-05-08",
//         status: "INPROGRESS",
//         description: "The click-through rate shown on my dashboard doesn't match my analytics reports.",
//         adminRemark: "We're investigating the discrepancy between our tracking and your analytics. Preliminary findings suggest a timezone setting mismatch."
//     },
//     {
//         ticketID: "TKT-1004",
//         subject: "Account verification problem",
//         raisedAt: "2023-05-05",
//         status: "REOPEN",
//         description: "Submitted documents for verification but account still shows 'pending verification'.",
//         adminRemark: "Your documents were initially rejected due to blurry images. Please re-upload clear copies of your ID and utility bill. We'll expedite the review."
//     },
//     {
//         ticketID: "TKT-1005",
//         subject: "Ad performance discrepancies",
//         raisedAt: "2023-05-01",
//         status: "CLOSED",
//         description: "The reported conversions don't match what I'm seeing in my backend system.",
//         adminRemark: "After investigation, we found your backend was counting all conversions while our system only counts unique conversions. This explains the 15% variance."
//     },
//     {
//         ticketID: "TKT-1006",
//         subject: "Location targeting not working",
//         raisedAt: "2023-04-28",
//         status: "OPEN",
//         description: "Ads are being shown outside my targeted geographic area despite correct settings.",
//         adminRemark: "Our ad delivery team has confirmed the issue and applied a temporary fix. A permanent solution will be deployed in the next platform update."
//     },
//     {
//         ticketID: "TKT-1007",
//         subject: "API integration questions",
//         raisedAt: "2023-04-25",
//         status: "RESOLVED",
//         description: "Need clarification on the API documentation for campaign management endpoints.",
//         adminRemark: "We've updated the API documentation with more detailed examples. Please see section 4.2 for campaign management specifics. Let us know if you need further assistance."
//     }
// ];
//     // Form configuration
//     const ticketFields = [
//         [
//             {
//                 name: "subject",
//                 label: "Subject",
//                 type: "input",
//                 placeholder: "Brief description of your issue",
//                 required: true,
//                 gridSpan: 3,
//                 className: "mb-4",
//             }
//         ],
//         [
//             {
//                 name: "category",
//                 label: "Category",
//                 type: "select",
//                 options: [
//                     { label: "Software", value: "Software" },
//                     { label: "Hardware", value: "Hardware" },
//                     { label: "Other", value: "other" }
//                 ],
//                 required: true,
//                 gridSpan: 1,
//                 className: "mb-4",
//             }
//         ],
//         [
//             {
//                 name: "description",
//                 label: "Description",
//                 type: "input",
//                 placeholder: "Please describe your issue in detail...",
//                 required: true,
//                 gridSpan: 3,
//                 className: "mb-4"
//             }
//         ],
//         [
//             {
//                 name: "attachments",
//                 label: "Upload Media",
//                 type: "file",
//                 accept: "image/*,.pdf,.doc,.docx",
//                 multiple: true,
//                 gridSpan: 3,
//                 helperText: "Format: jpeg, png, mp4. Max file size: 5MB.",
//                 className: "mb-4"
//             }
//         ]
//     ];

//     const handleSubmitTicket = (data) => {
//         console.log("Ticket data:", data);
//         closeTicketModal();
//         methods.reset();

//         Swal.fire({
//             title: "Ticket raised!",
//             text: "Updated status has been sent !",
//             icon: "success",
//             confirmButtonText: "OK"
//         });
//     };

//     return (
//         <div className="p-4">
//             <div className="flex justify-between items-center mb-4">
//                 <h2 className="text-2xl font-bold text-gray-800">Tickets history</h2>
//             </div>

//             <div className="flex justify-end rounded-2xl mb-5 bg-gradient-to-l from-blue-100 via-white to-white border-blue-100/50 p-4">
//                 <Button
//                     isIcon={false}
//                     label="Raise Ticket"
//                     onClick={openTicketModal}
//                     type="button"
//                 />
//             </div>

//             <ReusableTable
//                 columns={columns}
//                 rows={rows}
//                 filterOptions={["all", "OPEN", "INPROGRESS", "RESOLVED", "REOPEN", "CLOSED"]}
//                 filterKey="status"
//                 onRowClick={() => {}}
//             />

//             <Modal
//                 isOpen={isTicketModalOpen}
//                 onClose={closeTicketModal}
//                 size="lg"
//                 containerClassName="bg-white rounded-xl w-full max-w-3xl"
//             >
//                 <FormBuilder
//                     title="Ticket Form"
//                     onSubmit={handleSubmitTicket}
//                     fieldsConfig={ticketFields}
//                     methods={methods}
//                     submitLabel="Submit Ticket"
//                     isPlus={false}
//                 />
//             </Modal>

//             <TicketDetailsModal
//                 isOpen={isDetailsModalOpen}
//                 onClose={handleCloseDetailsModal}
//                 ticket={selectedTicket}
//             />
//         </div>
//     );
// };

// export default TicketRaise;