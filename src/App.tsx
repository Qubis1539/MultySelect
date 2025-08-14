import { useEffect, useState } from "react";
import Multiselect from "./components/Multiselect";
import type { Option } from "./components/Multiselect";

export default function App() {
    const [timezones, setTimezones] = useState<Option[]>([]);
    const [selected, setSelected] = useState<string[]>([]);

    useEffect(() => {
        fetch("https://timeapi.io/api/timezone/availabletimezones")
            .then((res) => res.json())
            .then((data: string[]) => {
                const opts = data.map((tz) => ({ label: tz, value: tz }));
                setTimezones(opts);
            })
            .catch((err) => console.error("Error fetching timezones:", err));
    }, []);

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
            <h1 className="text-2xl font-bold mb-4">Timezone Multiselect</h1>
            <Multiselect
                options={timezones}
                selectedOptions={selected}
                onSelectionChange={setSelected}
                placeholder="Choose timezones..."
            />
            <div className="mt-6 w-full max-w-lg bg-white p-4 rounded shadow">
                <h2 className="font-semibold mb-2">Selected Timezones:</h2>
                {selected.length > 0 ? (
                    <ul className="list-disc list-inside">
                        {selected.map((val) => (
                            <li key={val}>{val}</li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-gray-500">No timezones selected.</p>
                )}
            </div>
        </div>
    );
}
