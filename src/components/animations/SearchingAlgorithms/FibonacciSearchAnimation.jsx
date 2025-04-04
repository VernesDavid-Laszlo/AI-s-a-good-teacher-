import  { useState, useEffect } from "react";
import { gsap } from "gsap";

const FibonacciSearchAnimation = () => {
    const [array] = useState([1, 3, 5, 7, 9, 11, 13, 14, 15, 17, 23, 45, 53, 59, 61, 78, 81, 90, 98]);
    const [target, setTarget] = useState(61);
    const [message, setMessage] = useState("Click 'Start' to begin");
    const [step, setStep] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);
    const [showExplanation, setShowExplanation] = useState(true);

    // Fibonacci numbers explanation
    const fibonacciExplanation = [
        {
            title: "What is Fibonacci Search?",
            content: "Fibonacci search is a search algorithm that works on a sorted array by using Fibonacci numbers to determine search intervals. It can be more efficient than binary search in certain cases, especially when access is costly."
        },
        {
            title: "Fibonacci Numbers",
            content: "Each Fibonacci number is the sum of the two preceding ones: 0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55... The algorithm uses these to determine the jumps in the search."
        },
        {
            title: "Algorithm Steps",
            content: "1) Find the smallest Fibonacci number greater than or equal to the array length.\n2) Divide the array according to Fibonacci numbers.\n3) Compare the search value with the element at the division point.\n4) Based on the comparison, continue searching in smaller ranges."
        }
    ];

    // Reset colors function
    const resetColors = () => {
        gsap.to(".box", { backgroundColor: "#6200ea", duration: 0.5 });
    };

    // Fibonacci search algorithm with explanations
    const fibonacciSearch = async () => {
        if (isAnimating) return;

        setIsAnimating(true);
        resetColors();
        setStep(0);

        let n = array.length;
        let fibM2 = 0;  // (m-2)-th Fibonacci number
        let fibM1 = 1;  // (m-1)-th Fibonacci number
        let fibM = fibM2 + fibM1;  // m-th Fibonacci number

        // Find the smallest Fibonacci number greater than or equal to n
        while (fibM < n) {
            fibM2 = fibM1;
            fibM1 = fibM;
            fibM = fibM2 + fibM1;
        }

        let offset = -1;

        setMessage(`Starting search with Fibonacci number: ${fibM}`);
        setStep(1);
        await new Promise((resolve) => setTimeout(resolve, 3500));

        while (fibM > 1) {
            // Calculate valid index
            let i = Math.min(offset + fibM2, n - 1);

            setMessage(`Checking index ${i}, value: ${array[i]}`);
            await gsap.to(`#box-${i}`, { backgroundColor: "yellow", duration: 3 });
            setStep(2);
            await new Promise((resolve) => setTimeout(resolve, 3500));

            // If target is found
            if (array[i] === target) {
                setMessage(`Found ${target} at index ${i}! ✅`);
                await gsap.to(`#box-${i}`, { backgroundColor: "green", duration: 3 });
                setIsAnimating(false);
                return;
            }
            // If target is greater than the value at index
            else if (array[i] < target) {
                setMessage(`Going right (new offset: ${i}), because ${array[i]} < ${target} ❌`);
                await gsap.to(`#box-${i}`, { backgroundColor: "red", duration: 3 });
                setStep(3);

                // Update Fibonacci numbers for the right part
                fibM = fibM1;
                fibM1 = fibM2;
                fibM2 = fibM - fibM1;
                offset = i;
            }
            // If target is less than the value at index
            else {
                setMessage(`Going left, because ${array[i]} > ${target} ❌`);
                await gsap.to(`#box-${i}`, { backgroundColor: "red", duration: 3 });
                setStep(4);

                // Update Fibonacci numbers for the left part
                fibM = fibM2;
                fibM1 = fibM1 - fibM2;
                fibM2 = fibM - fibM1;
            }

            await new Promise((resolve) => setTimeout(resolve, 3500));
        }

        // Check last element
        if (fibM1 && offset + 1 < n && array[offset + 1] === target) {
            setMessage(`Found ${target} at index ${offset + 1}! ✅`);
            await gsap.to(`#box-${offset + 1}`, { backgroundColor: "green", duration: 3 });
            setIsAnimating(false);
            return;
        }

        setMessage(`Number ${target} not found in array ❌`);
        setIsAnimating(false);
    };

    // Reset animation
    const resetAnimation = () => {
        resetColors();
        setMessage("Click 'Start' to begin");
        setStep(0);
    };


    return (
        <div style={{
            fontFamily: "Arial, sans-serif",
            maxWidth: "1000px",
            margin: "0 auto",
            padding: "20px",
            backgroundColor: "#f5f5f5",
            borderRadius: "10px",
            boxShadow: "0 4px 8px rgba(0,0,0,0.1)"
        }}>


            {/* Introduction and explanation toggle */}
            <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "15px"
            }}>
                <button
                    onClick={() => setShowExplanation(!showExplanation)}
                    style={{
                        backgroundColor: "#6200ea",
                        color: "white",
                        border: "none",
                        padding: "8px 15px",
                        borderRadius: "5px",
                        cursor: "pointer",
                        fontSize: "14px"
                    }}
                >
                    {showExplanation ? "Hide Explanation" : "Show Explanation"}
                </button>
            </div>

            {/* Explanation panel */}
            {showExplanation && (
                <div style={{
                    backgroundColor: "white",
                    padding: "15px",
                    borderRadius: "8px",
                    marginBottom: "20px",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.05)"
                }}>
                    {/* Display all explanations at once */}
                    {fibonacciExplanation.map((explanation, index) => (
                        <div key={index} style={{ marginBottom: index < fibonacciExplanation.length - 1 ? "15px" : "0" }}>
                            <h3 style={{
                                color: "#4a148c",
                                marginTop: index === 0 ? "0" : "15px",
                                fontSize: "18px"
                            }}>{explanation.title}</h3>
                            <p style={{
                                lineHeight: "1.6",
                                whiteSpace: "pre-line"
                            }}>{explanation.content}</p>
                        </div>
                    ))}

                    {step > 0 && (
                        <div style={{
                            backgroundColor: "#e8eaf6",
                            padding: "10px",
                            borderRadius: "5px",
                            marginTop: "15px"
                        }}>
                            <p style={{ margin: "0", fontWeight: "bold" }}>Current Step Explanation:</p>
                            {step === 1 && <p style={{ margin: "5px 0 0" }}>The search algorithm is now finding the smallest Fibonacci number that is greater than or equal to the array size (19). This will determine the next index to examine.</p>}
                            {step === 2 && <p style={{ margin: "5px 0 0" }}>The algorithm is now comparing the value in the yellow box with the target value.</p>}
                            {step === 3 && <p style={{ margin: "5px 0 0" }}>The value is less than the target number, so we shift our search range to the right. The new starting point will be the current index.</p>}
                            {step === 4 && <p style={{ margin: "5px 0 0" }}>The value is greater than the target number, so we narrow our search range to the left.</p>}
                        </div>
                    )}
                </div>
            )}

            {/* Search controls */}
            <div style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "10px",
                marginBottom: "20px"
            }}>
                <input
                    type="number"
                    value={target || ""}
                    onChange={(e) => {
                        const value = e.target.value;
                        setTarget(value === "" ? "" : Number(value));
                    }}
                    placeholder="Enter number"
                    style={{
                        padding: "10px",
                        borderRadius: "5px",
                        border: "1px solid #bbb",
                        width: "120px",
                        fontSize: "16px"
                    }}
                    disabled={isAnimating}
                />
                <button
                    onClick={fibonacciSearch}
                    style={{
                        backgroundColor: "#6200ea",
                        color: "white",
                        border: "none",
                        padding: "10px 20px",
                        borderRadius: "5px",
                        cursor: isAnimating ? "not-allowed" : "pointer",
                        fontSize: "16px",
                        fontWeight: "bold",
                        opacity: isAnimating ? 0.7 : 1
                    }}
                    disabled={isAnimating}
                >
                    {isAnimating ? "Running..." : "Start"}
                </button>
                <button
                    onClick={resetAnimation}
                    style={{
                        backgroundColor: "#f50057",
                        color: "white",
                        border: "none",
                        padding: "10px 20px",
                        borderRadius: "5px",
                        cursor: isAnimating ? "not-allowed" : "pointer",
                        fontSize: "16px",
                        fontWeight: "bold",
                        opacity: isAnimating ? 0.7 : 1
                    }}
                    disabled={isAnimating}
                >
                    Reset
                </button>
            </div>

            {/* Status message */}
            <div style={{
                backgroundColor: "#e8eaf6",
                color: "#283593",
                padding: "15px",
                borderRadius: "8px",
                marginBottom: "20px",
                textAlign: "center",
                fontSize: "18px",
                fontWeight: "bold"
            }}>
                {message}
            </div>

            {/* Array visualization */}
            <div style={{
                display: "flex",
                justifyContent: "center",
                flexWrap: "wrap",
                gap: "10px",
                padding: "10px",
                backgroundColor: "white",
                borderRadius: "8px"
            }}>
                {array.map((num, index) => (
                    <div
                        key={index}
                        id={`box-${index}`}
                        className="box"
                        style={{
                            width: "40px",
                            height: "40px",
                            backgroundColor: "#6200ea",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "white",
                            fontSize: "16px",
                            fontWeight: "bold",
                            borderRadius: "5px",
                            boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                            position: "relative"
                        }}
                    >
                        {num}
                        <div style={{
                            position: "absolute",
                            bottom: "-20px",
                            fontSize: "12px",
                            color: "#666"
                        }}>
                            {index}
                        </div>
                    </div>
                ))}
            </div>

            {/* Legend */}
            <div style={{
                display: "flex",
                justifyContent: "center",
                gap: "15px",
                marginTop: "30px",
                flexWrap: "wrap"
            }}>
                <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                    <div style={{ width: "20px", height: "20px", backgroundColor: "#6200ea", borderRadius: "3px" }}></div>
                    <span>Not examined</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                    <div style={{ width: "20px", height: "20px", backgroundColor: "yellow", borderRadius: "3px" }}></div>
                    <span>Currently examining</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                    <div style={{ width: "20px", height: "20px", backgroundColor: "green", borderRadius: "3px" }}></div>
                    <span>Found</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                    <div style={{ width: "20px", height: "20px", backgroundColor: "red", borderRadius: "3px" }}></div>
                    <span>Not a match</span>
                </div>
            </div>
        </div>
    );
};

export default FibonacciSearchAnimation;