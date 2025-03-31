import React, { useState } from "react";
import { gsap } from "gsap";

const FibonacciSearchPractice = () => {
    const [array] = useState([1, 3, 7, 10, 14, 18, 21, 24, 30, 35, 42, 50]);
    const [target, setTarget] = useState(14);
    const [message, setMessage] = useState("Select the largest Fibonacci number within the array length.");
    const [step, setStep] = useState("selectFib");
    const [fibSequence, setFibSequence] = useState([]);
    const [fibIndex, setFibIndex] = useState(null);
    const [offset, setOffset] = useState(-1);
    const [fibM1, setFibM1] = useState(null);
    const [fibM2, setFibM2] = useState(null);
    const [fibM, setFibM] = useState(null);

    const generateFibSequence = (n) => {
        let fibs = [0, 1];
        while (fibs[fibs.length - 1] < n) {
            fibs.push(fibs[fibs.length - 2] + fibs[fibs.length - 1]);
        }
        fibs.pop();
        return fibs;
    };

    const startPractice = () => {
        const fibs = generateFibSequence(array.length);
        setFibSequence(fibs);
        setStep("selectFib");
        setMessage("Select the largest Fibonacci number within the array length.");
    };

    const handleFibSelection = (fib) => {
        if (fib !== fibSequence[fibSequence.length - 1]) {
            setMessage("Incorrect! ❌ Try again.");
            startPractice();
            return;
        }
        setMessage(`Correct! ✅ Now check index ${fib - 1}.`);
        setFibM(fib);
        setFibM1(fibSequence[fibSequence.length - 2]);
        setFibM2(fibSequence[fibSequence.length - 3]);
        setFibIndex(fib - 1);
        setStep("search");
    };

    const handleSearchSelection = (index) => {
        if (index !== fibIndex) {
            setMessage("Incorrect! ❌ Restarting...");
            startPractice();
            return;
        }

        gsap.to(`#box-${index}`, { backgroundColor: "yellow", duration: 0.5 });

        if (array[index] === target) {
            setMessage(`Found ${target} at index ${index}! ✅`);
            gsap.to(`#box-${index}`, { backgroundColor: "green", duration: 0.5 });
            return;
        } else if (array[index] < target) {
            setMessage(`Going right. ✅ New offset: ${index}`);
            gsap.to(`#box-${index}`, { backgroundColor: "red", duration: 0.5 });
            setOffset(index);
            setFibM(fibM1);
            setFibM1(fibM2);
            setFibM2(fibM - fibM1);
            setFibIndex(Math.min(offset + fibM2, array.length - 1));
        } else {
            setMessage(`Going left. ✅`);
            gsap.to(`#box-${index}`, { backgroundColor: "red", duration: 0.5 });
            setFibM(fibM2);
            setFibM1(fibM1 - fibM2);
            setFibM2(fibM - fibM1);
            setFibIndex(offset + fibM2);
        }
    };

    return (
        <div style={{ textAlign: "center", padding: "20px" }}>
            <h2>Fibonacci Search Practice</h2>
            <p>{message}</p>
            <input
                type="number"
                value={target || ""}
                onChange={(e) => setTarget(Number(e.target.value) || "")}
                placeholder="Enter number"
            />
            <br/>
            <button onClick={startPractice}>Restart</button>
            <div style={{ display: "flex", justifyContent: "center", gap: "10px", marginTop: "20px" }}>
                {array.map((num, index) => (
                    <div
                        key={index}
                        id={`box-${index}`}
                        onClick={() => (step === "selectFib" ? handleFibSelection(index + 1) : handleSearchSelection(index))}
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
                            cursor: "pointer",
                        }}
                    >
                        {num}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FibonacciSearchPractice;
