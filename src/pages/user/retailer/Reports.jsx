import { useState } from "react";
import Button from "../../../components/ui/button/Button";
const Reports = () => {


    const options = ["Campaign Report", "Store Report", "Impressions", "Reports"];
    const [selected, setSelected] = useState("Campaign Report");

    return (

        <div>
            <h2 className="text-xl font-semibold">Reports</h2>
            <div className="flex w-full mt-10 rounded-lg overflow-hidden bg-gray-200">
                {options.map((option) => (
                    <Button
                        key={option}
                        label={option}
                        className={`flex-1 px-4 py-3 text-sm rounded-none transition-all duration-200 text-center ${selected === option
                                ? "bg-blue-900 text-white !important" 
                                : "bg-white !text-black hover:!text-white"
                            }`}

                        onClick={() => setSelected(option)}
                        type="button"
                        loading={false}
                        disabled={false}
                        isIcon={false}
                    />
                ))}
            </div>

        </div>
    )
};

export default Reports;
