import { useState } from "react";
import ReusableTable from "../../../components/table/ReusableTable";
import Button from "../../../components/ui/button/Button";
const Campaigns = () => {

    const options = ["Day", "Week", "Month"];
    const [selected, setSelected] = useState("Day");

    const columns = [
        {
            id: "campaignName",
            label: "Campaign Name",

        },
        { id: "StartingDate", label: "Starting Date" },
        { id: "EndingDate", label: "Ending Date" },
        { id: "roi", label: "ROI" },
    ];

    const rows = "";
    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Campaigns</h2>
                <div className="flex items-center rounded-lg">
                    {options.map((option) => (
                        <Button
                            key={option}
                            label={option}
                            className={`rounded-none ${selected === option ? "" : "bg-gray-200 text-gray-700"}`}
                            onClick={() => setSelected(option)}
                            type="button"
                            loading={false}
                            disabled={false}
                            isIcon={false}
                        />
                    ))}
                </div>
            </div>
            <ReusableTable 
            columns={columns} 
            rows={rows} 
            />
        </div>
    )
};

export default Campaigns;
