import  { useState, useEffect } from "react";
import { gsap } from "gsap";

const BinarySearchAnimation = () => {
    const [array, setArray] = useState([1, 5, 7, 9, 11, 13, 15, 17, 23, 45, 53, 59,98]);
    const [target, setTarget] = useState(13);
    const [message, setMessage] = useState("Click 'Start' to begin");

    const binarySearch = async () => {
        let left = 0;
        let right = array.length - 1;
        let found = false;

        while (left <= right) {
            let mid = Math.floor((left + right) / 2);

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

            await gsap.to(`#bar-${mid}`, { backgroundColor: "red", duration: 1 });
        }

        if (!found) {
            setMessage(`Number ${target} not found`);
        }
    };

    return (
        <div style={{textAlign: "center", padding: "20px", fontFamily: "Arial"}}>
            <div style={{
                fontSize: "16px",
                color: "#333",
                textAlign: "left",
                maxWidth: "1000px",
                margin: "0px auto",
                padding: "25px",
                backgroundColor: "#f9f9f9",
                borderRadius: "8px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
            }}>
                <p>This animation demonstrates the binary search algorithm in action. Binary search is an efficient way
                    to find a target value in a <strong>sorted array</strong>.</p>
                <p><strong>How the algorithm works:</strong></p>
                <ol style={{textAlign: "left"}}>
                    <li>Calculate the middle index of the current search range</li>
                    <li>Compare the middle element (yellow) with the target value</li>
                    <li>If they match, the search is complete (green)</li>
                    <li>If the target is greater, search the right half</li>
                    <li>If the target is smaller, search the left half</li>
                    <li>Elements checked but not matching turn red</li>
                </ol>
                <p><strong>Time Complexity:</strong> O(log n) - Much faster than linear search's O(n)</p>
                <div style={{
                    display: "flex",
                    justifyContent: "center",
                    gap: "15px",
                    marginTop: "30px",
                    flexWrap: "wrap"
                }}>
                    <div style={{display: "flex", alignItems: "center", gap: "5px"}}>
                        <div style={{
                            width: "20px",
                            height: "20px",
                            backgroundColor: "#6200ea",
                            borderRadius: "3px"
                        }}></div>
                        <span>Not examined</span>
                    </div>
                    <div style={{display: "flex", alignItems: "center", gap: "5px"}}>
                        <div style={{
                            width: "20px",
                            height: "20px",
                            backgroundColor: "yellow",
                            borderRadius: "3px"
                        }}></div>
                        <span>Currently examining</span>
                    </div>
                    <div style={{display: "flex", alignItems: "center", gap: "5px"}}>
                        <div style={{
                            width: "20px",
                            height: "20px",
                            backgroundColor: "green",
                            borderRadius: "3px"
                        }}></div>
                        <span>Found</span>
                    </div>
                    <div style={{display: "flex", alignItems: "center", gap: "5px"}}>
                        <div style={{width: "20px", height: "20px", backgroundColor: "red", borderRadius: "3px"}}></div>
                        <span>Not a match</span>
                    </div>
                </div>
            </div>
            <br/>
            <input
                type="number"
                value={target || ""}
                onChange={(e) => {
                    const value = e.target.value;
                    setTarget(value === "" ? "" : Number(value));
                }}
                placeholder="Enter number"
            />
            <button onClick={binarySearch}>Start</button>
            <p>{message}</p>
            <div style={{display: "flex", justifyContent: "center", gap: "10px"}}>
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