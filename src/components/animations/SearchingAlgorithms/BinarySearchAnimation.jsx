import  { useState, useEffect } from "react";
import { gsap } from "gsap";

const BinarySearchAnimation = () => {
    const [array, setArray] = useState([1, 3, 5, 7, 9, 11, 13, 15, 17]);
    const [target, setTarget] = useState(7);
    const [message, setMessage] = useState("Click 'Start' to begin");

    const binarySearch = async () => {
        let left = 0;
        let right = array.length - 1;
        let found = false;

        while (left <= right) {
            let mid = Math.floor((left + right) / 2);

            // Highlight the middle element
            await gsap.to(`#bar-${mid}`, { backgroundColor: "yellow", duration: 1 });

            if (array[mid] === target) {
                setMessage(`Found ${target} at index ${mid}`);
                await gsap.to(`#bar-${mid}`, { backgroundColor: "green", duration: 1 });
                found = true;
                break;
            } else if (array[mid] < target) {
                setMessage(`Searching right half...`);
                left = mid + 1;
            } else {
                setMessage(`Searching left half...`);
                right = mid - 1;
            }

            // Reset color of checked element
            await gsap.to(`#bar-${mid}`, { backgroundColor: "red", duration: 1 });
        }

        if (!found) {
            setMessage(`Number ${target} not found`);
        }
    };

    return (
        <div style={{ textAlign: "center", padding: "20px" }}>
            <input
                type="number"
                value={target}
                onChange={(e) => setTarget(Number(e.target.value))}
                placeholder="Enter number"
            />
            <button onClick={binarySearch}>Start</button>
            <p>{message}</p>
            <div style={{ display: "flex", justifyContent: "center", gap: "10px" }}>
                {array.map((num, index) => (
                    <div
                        key={index}
                        id={`bar-${index}`}
                        style={{
                            width: "40px",
                            height: "40px",
                            backgroundColor: "#6200ea",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "white",
                            fontSize: "20px",
                        }}
                    >
                        {num}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default BinarySearchAnimation;
