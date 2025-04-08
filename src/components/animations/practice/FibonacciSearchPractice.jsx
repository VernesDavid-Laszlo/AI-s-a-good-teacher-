import { useState, useEffect } from "react";
import { gsap } from "gsap";

const FibonacciSearchPractice = () => {
    const [array] = useState([1, 3, 5, 7, 9, 11, 13, 14, 15, 17, 23, 45, 53, 59, 61, 78, 81, 90, 98]);
    const [target, setTarget] = useState(61);
    const [message, setMessage] = useState("Click 'Start Practice' to begin");
    const [practiceStep, setPracticeStep] = useState(0);
    const [isPracticing, setIsPracticing] = useState(false);
    const [fibNumbers, setFibNumbers] = useState({ fibM: 0, fibM1: 0, fibM2: 0 });
    const [offset, setOffset] = useState(0);
    const [currentRangeStart, setCurrentRangeStart] = useState(0);
    const [currentRangeEnd, setCurrentRangeEnd] = useState(array.length - 1);
    const [feedbackVisible, setFeedbackVisible] = useState(false);
    const [feedbackCorrect, setFeedbackCorrect] = useState(false);
    const [feedbackMessage, setFeedbackMessage] = useState("");
    const [nextStepHint, setNextStepHint] = useState("");
    const [clickableElements, setClickableElements] = useState([]);
    const [disabledElements, setDisabledElements] = useState([]);

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

    // Reset colors and practice state
    const resetPractice = () => {
        gsap.to(".box", { backgroundColor: "#6200ea", duration: 0.5 });
        gsap.to(".box", { opacity: 1, duration: 0.5 });
        setPracticeStep(0);
        setOffset(0);
        setFeedbackVisible(false);
        setFeedbackCorrect(false);
        setCurrentRangeStart(0);
        setCurrentRangeEnd(array.length - 1);
        setDisabledElements([]);
        setClickableElements([]);
    };

    // Start practice
    const startPractice = () => {
        resetPractice();
        setIsPracticing(true);
        initializeFibonacciNumbers();
        setMessage("First, we need to find the position to start our search. Try to find the correct position!");
    };

    // Initialize fibonacci numbers for the search
    const initializeFibonacciNumbers = () => {
        let n = array.length;

        // Find the smallest Fibonacci number greater than or equal to n
        let fibM2 = 0;  // (m-2)'th Fibonacci number
        let fibM1 = 1;  // (m-1)'th Fibonacci number
        let fibM = fibM1 + fibM2;  // m'th Fibonacci number

        while (fibM < n) {
            fibM2 = fibM1;
            fibM1 = fibM;
            fibM = fibM1 + fibM2;
        }

        setFibNumbers({ fibM, fibM1, fibM2 });

        // Initial search index is offset + fibM2 position
        const firstIndex = Math.min(fibM2 - 1, n - 1);
        setClickableElements([firstIndex]);
        setNextStepHint(`Click on index ${firstIndex}, which is the initial position (min(fibM2-1, array.length-1)) to start Fibonacci search.`);
    };

    // Handle box click in practice mode
    const handleBoxClick = (index) => {
        if (!isPracticing || feedbackVisible) return;

        // If this index is not clickable, show error
        if (!clickableElements.includes(index)) {
            showFeedback(false, "Incorrect position! Follow the hint to find where to click next.");
            return;
        }

        // Highlight the clicked element
        gsap.to(`#box-${index}`, { backgroundColor: "yellow", duration: 0.5 });

        // Check if target found at current position
        if (array[index] === target) {
            showFeedback(true, `Great job! You found ${target} at index ${index}!`);
            gsap.to(`#box-${index}`, { backgroundColor: "green", duration: 0.5 });
            setPracticeStep(practiceStep + 1);
            return;
        }

        // Get the current Fibonacci numbers
        const { fibM, fibM1, fibM2 } = fibNumbers;

        if (array[index] < target) {
            // Need to search right
            showFeedback(true, `Correct! ${array[index]} < ${target}, so we need to search to the right.`);
            setTimeout(() => {
                gsap.to(`#box-${index}`, { backgroundColor: "red", duration: 0.5 });

                // Update Fibonacci numbers for the right subdivision
                // In Fibonacci search, when going right:
                // - fibM becomes fibM1
                // - fibM1 becomes fibM2
                // - fibM2 becomes fibM - fibM1 (= fibM1 - fibM2)
                const newFibM = fibM1;
                const newFibM1 = fibM2;
                const newFibM2 = fibM1 - fibM2;

                // Update offset
                const newOffset = index + 1;

                // Update state
                setFibNumbers({ fibM: newFibM, fibM1: newFibM1, fibM2: newFibM2 });
                setOffset(newOffset);
                setCurrentRangeStart(newOffset);

                // Disable elements up to and including the current index
                const newDisabled = Array.from({length: index + 1}, (_, i) => i);
                setDisabledElements([...disabledElements, ...newDisabled]);

                // Gray out disabled elements
                newDisabled.forEach(i => {
                    if (!disabledElements.includes(i)) {
                        gsap.to(`#box-${i}`, { opacity: 0.3, duration: 0.5 });
                    }
                });

                // Calculate next position to check
                // Next index = offset + fibM2 - 1 (adjusted by 1 as per Fibonacci search algorithm)
                const nextPos = Math.min(newOffset + Math.max(0, newFibM2 - 1), currentRangeEnd);

                if (nextPos <= newOffset || newFibM2 <= 0) {
                    // We've exhausted Fibonacci numbers, check elements sequentially
                    const remainingIndices = Array.from(
                        {length: currentRangeEnd - newOffset + 1},
                        (_, i) => i + newOffset
                    ).filter(i => !disabledElements.includes(i));

                    if (remainingIndices.length > 0) {
                        setClickableElements([remainingIndices[0]]);
                        setNextStepHint(`Fibonacci sequence exhausted. Check remaining elements sequentially. Click on index ${remainingIndices[0]}.`);
                    } else {
                        showFeedback(false, `The target ${target} is not in the array.`);
                        setTimeout(() => resetPractice(), 1500);
                        return;
                    }
                } else {
                    setClickableElements([nextPos]);
                    setNextStepHint(`Click on index ${nextPos}, which is offset(${newOffset}) + fibM2(${newFibM2}) - 1 = ${nextPos}`);
                }

                setPracticeStep(practiceStep + 1);
                setMessage("Continue searching in the right portion. Where should you check next?");
            }, 1500);
        } else {
            // Need to search left
            showFeedback(true, `Correct! ${array[index]} > ${target}, so we need to search to the left.`);
            setTimeout(() => {
                gsap.to(`#box-${index}`, { backgroundColor: "red", duration: 0.5 });

                // Update Fibonacci numbers for the left subdivision
                // In Fibonacci search, when going left:
                // - fibM becomes fibM2
                // - fibM1 becomes fibM1 - fibM2
                // - fibM2 becomes fibM - fibM1 (= fibM2)
                const newFibM = fibM2;
                const newFibM1 = fibM1 - fibM2;
                const newFibM2 = fibM - fibM1; // This equals fibM2 in standard implementation

                // Update search range
                const newRangeEnd = index - 1;

                // Update state
                setFibNumbers({ fibM: newFibM, fibM1: newFibM1, fibM2: newFibM2 });
                setCurrentRangeEnd(newRangeEnd);

                // Disable elements from index to end
                const newDisabled = Array.from({length: array.length - index}, (_, i) => i + index);
                setDisabledElements([...disabledElements, ...newDisabled]);

                // Gray out disabled elements
                newDisabled.forEach(i => {
                    if (!disabledElements.includes(i)) {
                        gsap.to(`#box-${i}`, { opacity: 0.3, duration: 0.5 });
                    }
                });

                // Calculate next position - for left search it's offset + fibM2 - 1
                const nextPos = Math.min(offset + Math.max(0, newFibM2 - 1), newRangeEnd);

                if (nextPos < currentRangeStart || nextPos > newRangeEnd || newFibM2 <= 0) {
                    // We've exhausted our search or Fibonacci numbers, check elements sequentially
                    const remainingIndices = Array.from(
                        {length: newRangeEnd - currentRangeStart + 1},
                        (_, i) => i + currentRangeStart
                    ).filter(i => !disabledElements.includes(i));

                    if (remainingIndices.length > 0) {
                        setClickableElements([remainingIndices[0]]);
                        setNextStepHint(`Fibonacci sequence exhausted. Check remaining elements sequentially. Click on index ${remainingIndices[0]}.`);
                    } else {
                        showFeedback(false, `The target ${target} is not in the array.`);
                        setTimeout(() => resetPractice(), 1500);
                        return;
                    }
                } else {
                    setClickableElements([nextPos]);
                    setNextStepHint(`Click on index ${nextPos}, which is offset(${offset}) + fibM2(${newFibM2}) - 1 = ${nextPos}`);
                }

                setPracticeStep(practiceStep + 1);
                setMessage("Continue searching in the left portion. Where should you check next?");
            }, 1500);
        }
    };

    // Show feedback message
    const showFeedback = (correct, message) => {
        setFeedbackVisible(true);
        setFeedbackCorrect(correct);
        setFeedbackMessage(message);

        setTimeout(() => {
            setFeedbackVisible(false);
            if (!correct && message !== `The target ${target} is not in the array.`) {
                // Reset practice on incorrect
                resetPractice();
                startPractice();
            }
        }, 3000);
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
            </div>

            {/* Practice controls */}
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
                    disabled={isPracticing}
                />
                <button
                    onClick={startPractice}
                    style={{
                        backgroundColor: "#6200ea",
                        color: "white",
                        border: "none",
                        padding: "10px 20px",
                        borderRadius: "5px",
                        cursor: "pointer",
                        fontSize: "16px",
                        fontWeight: "bold"
                    }}
                >
                    {isPracticing ? "Restart Practice" : "Start Practice"}
                </button>
            </div>

            {/* Status message */}
            <div style={{
                backgroundColor: "#e8eaf6",
                color: "#283593",
                padding: "15px",
                borderRadius: "8px",
                marginBottom: "10px",
                textAlign: "center",
                fontSize: "18px",
                fontWeight: "bold"
            }}>
                {message}
            </div>

            {/* Hint message */}
            {isPracticing && (
                <div style={{
                    backgroundColor: "#fff3e0",
                    color: "#e65100",
                    padding: "10px",
                    borderRadius: "8px",
                    marginBottom: "20px",
                    textAlign: "center",
                    fontSize: "14px"
                }}>
                    <strong>Hint:</strong> {nextStepHint}
                </div>
            )}

            {/* Fibonacci numbers display */}
            {isPracticing && (
                <div style={{
                    backgroundColor: "#e1f5fe",
                    color: "#01579b",
                    padding: "10px",
                    borderRadius: "8px",
                    marginBottom: "20px",
                    fontSize: "14px"
                }}>
                    <strong>Current Fibonacci numbers:</strong>
                    <div style={{ display: "flex", justifyContent: "space-around", marginTop: "5px" }}>
                        <div>fibM = {fibNumbers.fibM}</div>
                        <div>fibM1 = {fibNumbers.fibM1}</div>
                        <div>fibM2 = {fibNumbers.fibM2}</div>
                    </div>
                    <div style={{ marginTop: "5px" }}>
                        <strong>Current offset:</strong> {offset}
                    </div>
                    <div style={{ marginTop: "5px" }}>
                        <strong>Search range:</strong> [{currentRangeStart} - {currentRangeEnd}]
                    </div>
                    {clickableElements.length > 0 && (
                        <div style={{ marginTop: "5px" }}>
                        </div>
                    )}
                </div>
            )}

            {/* Feedback message */}
            {feedbackVisible && (
                <div style={{
                    backgroundColor: feedbackCorrect ? "#e8f5e9" : "#ffebee",
                    color: feedbackCorrect ? "#2e7d32" : "#c62828",
                    padding: "15px",
                    borderRadius: "8px",
                    marginBottom: "20px",
                    textAlign: "center",
                    fontSize: "18px",
                    fontWeight: "bold",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "10px"
                }}>
                    {feedbackCorrect ? "✅" : "❌"} {feedbackMessage}
                </div>
            )}

            {/* Array visualization */}
            <div style={{
                display: "flex",
                justifyContent: "center",
                height:'80px',
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
                        onClick={() => handleBoxClick(index)}
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
                            position: "relative",
                            opacity: disabledElements.includes(index) ? 0.3 : 1,
                            cursor: isPracticing && !disabledElements.includes(index) ? "pointer" : "default",
                            border: isPracticing && clickableElements.includes(index) ? "2px solid #6200ea" : "none"
                        }}
                    >
                        {num}
                        <div style={{
                            position: "absolute",
                            bottom: "-20px",
                            fontSize: "12px",
                            color: "#666",
                            fontWeight: "normal"
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
                <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                    <div style={{ width: "20px", height: "20px", backgroundColor: "#6200ea", opacity: 0.3, borderRadius: "3px" }}></div>
                    <span>Excluded from search</span>
                </div>

            </div>
        </div>
    );
};

export default FibonacciSearchPractice;