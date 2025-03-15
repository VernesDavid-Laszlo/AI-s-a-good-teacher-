import React, { useState } from "react";
import { gsap } from "gsap";

const FibonacciSearchAnimation = () => {
    const [array] = useState([1, 3, 7, 10, 14, 18, 21, 24, 30]);
    const [target, setTarget] = useState(14);
    const [message, setMessage] = useState("Click 'Start' to begin");

    const fibonacciSearch = async () => {
        let n = array.length;
        let fibM2 = 0;
        let fibM1 = 1;
        let fibM = fibM2 + fibM1;

        while (fibM < n) {
            fibM2 = fibM1;
            fibM1 = fibM;
            fibM = fibM2 + fibM1;
        }

        let offset = -1;

        setMessage(`Starting search with Fibonacci number: ${fibM}`);
        await new Promise((resolve) => setTimeout(resolve, 1000));

        while (fibM > 1) {
            let i = Math.min(offset + fibM2, n - 1);

            setMessage(`Checking index ${i}, value: ${array[i]}`);
            await gsap.to(`#box-${i}`, { backgroundColor: "yellow", duration: 3 });

            if (array[i] === target) {
                setMessage(`Found ${target} at index ${i}!`);
                await gsap.to(`#box-${i}`, { backgroundColor: "green", duration: 3 });
                return;
            } else if (array[i] < target) {
                setMessage(`Going right (new offset: ${i})`);
                await gsap.to(`#box-${i}`, { backgroundColor: "red", duration: 3 });

                fibM = fibM1;
                fibM1 = fibM2;
                fibM2 = fibM - fibM1;
                offset = i;
            } else {
                setMessage(`Going left`);
                await gsap.to(`#box-${i}`, { backgroundColor: "red", duration: 3 });

                fibM = fibM2;
                fibM1 -= fibM2;
                fibM2 = fibM - fibM1;
            }

            await new Promise((resolve) => setTimeout(resolve, 1000));
        }

        if (fibM1 && array[offset + 1] === target) {
            setMessage(`Found ${target} at index ${offset + 1}!`);
            await gsap.to(`#box-${offset + 1}`, { backgroundColor: "green", duration: 1 });
            return;
        }

        setMessage(`Number ${target} not found`);
    };

    return (
        <div style={{ textAlign: "center", padding: "20px" }}>
            <h2>Fibonacci Search Animation</h2>
            <input
                type="number"
                value={target}
                onChange={(e) => setTarget(Number(e.target.value))}
                style={{ marginBottom: "10px" }}
            />
            <br />
            <button onClick={fibonacciSearch} style={{ marginBottom: "10px" }}>Start</button>
            <p>{message}</p>
            <div style={{ display: "flex", justifyContent: "center", gap: "10px" }}>
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

export default FibonacciSearchAnimation;
