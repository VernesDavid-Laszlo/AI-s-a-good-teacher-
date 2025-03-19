import  { useState } from "react";
import { gsap } from "gsap";

const IntervalSearchAnimation = () => {
    const [array] = useState([10, 20, 30, 40, 50, 60, 70, 80, 90]);
    const [target, setTarget] = useState(50);
    const [message, setMessage] = useState("Click 'Start' to begin");
    const [explanation, setExplanation] = useState("");

    const intervalSearch = async () => {
        let low = 0, high = array.length - 1;
        let found = false;

        setMessage(`Searching for ${target}...`);
        setExplanation("");

        while (low <= high && array[low] !== array[high]) {
            let mid = low + Math.floor((high - low) * (target - array[low]) / (array[high] - array[low]));

            if (mid < low || mid > high) {
                setExplanation(`Calculated index ${mid} is out of bounds.`);
                break;
            }

            setExplanation(`Checking index ${mid}: Value ${array[mid]}`);
            await gsap.to(`#box-${mid}`, { backgroundColor: "yellow", duration: 0.5 });

            if (array[mid] === target) {
                setMessage(`Found ${target} at index ${mid}!`);
                setExplanation(`The value ${array[mid]} matches ${target}!`);
                await gsap.to(`#box-${mid}`, { backgroundColor: "green", duration: 0.5 });
                found = true;
                break;
            }

            if (array[mid] < target) {
                setExplanation(`Value ${array[mid]} is smaller than ${target}. Searching the right side.`);
                low = mid + 1;
            } else {
                setExplanation(`Value ${array[mid]} is larger than ${target}. Searching the left side.`);
                high = mid - 1;
            }

            await gsap.to(`#box-${mid}`, { backgroundColor: "red", duration: 0.5 });
        }

        if (!found) {
            setMessage(`Number ${target} not found`);
            setExplanation("Search ended. The number is not in the array.");
        }
    };

    return (
        <div style={{textAlign: "center", padding: "20px"}}>
            <h2>Interval Search Animation</h2>
            <input
                type="number"
                value={target || ""}
                onChange={(e) => {
                    const value = e.target.value;
                    setTarget(value === "" ? "" : Number(value));
                }}
                placeholder="Enter number"
            />
            <button onClick={intervalSearch}>Start</button>
            <p>{message}</p>
            <p style={{fontStyle: "italic", color: "blue"}}>{explanation}</p>
            <div style={{display: "flex", justifyContent: "center", gap: "10px", marginTop: "20px"}}>
                {array.map((num, index) => (
                    <div
                        key={index}
                        id={`box-${index}`}
                        style={{
                            width: "50px",
                            height: "50px",
                            backgroundColor: "#6200ea",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "white",
                            fontSize: "20px",
                            borderRadius: "5px",
                        }}
                    >
                        {num}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default IntervalSearchAnimation;
