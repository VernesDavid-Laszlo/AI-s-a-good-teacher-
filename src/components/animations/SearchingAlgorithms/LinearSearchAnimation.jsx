import React, { useState } from "react";
import { gsap } from "gsap";

const LinearSearchAnimation = () => {
    const [array] = useState([5, 12, 8, 19, 3, 7, 25]);
    const [target, setTarget] = useState(7);
    const [message, setMessage] = useState("Click 'Start' to begin");

    const linearSearch = async () => {
        let found = false;

        for (let i = 0; i < array.length; i++) {
            await gsap.to(`#box-${i}`, { backgroundColor: "yellow", duration: 1.2 });

            if (array[i] === target) {
                setMessage(`Found ${target} at index ${i}`);
                await gsap.to(`#box-${i}`, { backgroundColor: "green", duration: 1.2 });
                found = true;
                break;
            }

            await gsap.to(`#box-${i}`, { backgroundColor: "red", duration: 1.2 });
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
                <p>This animation demonstrates the linear search algorithm in action. Linear search is a simple method
                    to find a target value in an array by checking each element sequentially.</p>
                <p><strong>How the algorithm works:</strong></p>
                <ol style={{textAlign: "left"}}>
                    <li>Examine each element in the array from start to finish</li>
                    <li>Compare the current element (yellow) with the target value</li>
                    <li>If they match, the search is complete (green)</li>
                    <li>If they don't match, move to the next element</li>
                    <li>Elements checked but not matching turn red</li>
                </ol>
                <p><strong>Time Complexity:</strong> O(n) - Each element may need to be checked in the worst case</p>
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
            <h2>Linear Search Animation</h2>
            <input
                type="number"
                value={target || ""}
                onChange={(e) => {
                    const value = e.target.value;
                    setTarget(value === "" ? "" : Number(value));
                }}
                placeholder="Enter number"
            />
            <button onClick={linearSearch}>Start</button>
            <p>{message}</p>
            <div style={{display: "flex", justifyContent: "center", gap: "10px"}}>
                {array.map((num, index) => (
                    <div
                        key={index}
                        id={`box-${index}`}
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

export default LinearSearchAnimation;