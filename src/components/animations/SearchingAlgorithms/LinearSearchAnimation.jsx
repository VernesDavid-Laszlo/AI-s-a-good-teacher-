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
        <div style={{ textAlign: "center", padding: "20px" }}>
            <h2>Linear Search Animation</h2>
            <input
                type="number"
                value={target}
                onChange={(e) => setTarget(Number(e.target.value))}
            />
            <button onClick={linearSearch}>Start</button>
            <p>{message}</p>
            <div style={{ display: "flex", justifyContent: "center", gap: "10px" }}>
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
