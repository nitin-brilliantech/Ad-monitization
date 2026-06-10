import { useState } from "react";
import Button from "../../../components/ui/button/Button";
const Reports = () => {

    const options = ["Campaign Report", "Store Report", "Impressions", "Reports"];
    const [selected, setSelected] = useState("Campaign Report");

    return (
        <div>
            <h2 className="text-xl font-semibold mb-6">Reports</h2>
            
            <div className="flex gap-2 mt-6">
                {options.map((option) => (
                    <Button
                        key={option}
                        label={option}
                        type="button"
                        isIcon={false}
                        variant="custom"
                        onClick={() => setSelected(option)}
                        className={`px-6 py-2 rounded-full text-sm font-semibold border-2 transition-all duration-150 ${
                            selected === option 
                                ? "bg-[#4684ff] text-white border-[#4684ff] shadow-md" 
                                : "bg-white text-[#4684ff] border-[#4684ff] hover:bg-blue-50"
                        }`}
                    />
                ))}
            </div>
        </div>
    )
};

export default Reports;
