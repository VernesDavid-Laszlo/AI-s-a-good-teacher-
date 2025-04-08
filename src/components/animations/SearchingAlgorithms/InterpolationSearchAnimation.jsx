import React, { useState } from "react";
import { gsap } from "gsap";

const InterpolationSearchAnimation = () => {
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
        <div style={{textAlign: "center", padding: "20px", fontFamily: "Arial"}}>
            <div style={{
                fontSize: "16px",
                color: "#333",
                textAlign: "left",
                maxWidth: "1000px",
                margin: "20px auto",
                padding: "25px",
                backgroundColor: "#f9f9f9",
                borderRadius: "8px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
            }}>
                <h3 style={{marginBottom: "20px", borderBottom: "1px solid #ddd", paddingBottom: "10px"}}>How Does
                    Interpolation Search Work?</h3>
                <p style={{marginBottom: "15px", lineHeight: "1.6"}}>
                    Interpolation Search is an advanced searching algorithm designed for sorted arrays. It improves upon Binary Search by estimating where the target value might be based on its actual value relative to the range of the array. Instead of always checking the middle of the search range (like Binary Search does), Interpolation Search tries to guess a more accurate position for the target, assuming that the values in the array are evenly distributed.
                </p>
                <p style={{marginBottom: "15px", lineHeight: "1.6"}}>
                    <strong>Interpolation Formula:</strong> mid = low + ⌊(high - low) × (target - A[low]) ÷ (A[high] -
                    A[low])⌋
                </p>


            </div>
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

export default InterpolationSearchAnimation;
