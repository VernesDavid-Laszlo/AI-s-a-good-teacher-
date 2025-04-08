import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const InterpolationSearchPractice = () => {
    const [array] = useState([10, 20, 30, 40, 50, 60, 70, 80, 90]);
    const [target, setTarget] = useState(50);
    const [status, setStatus] = useState('initial'); // 'initial', 'running', 'correct', 'incorrect'
    const [message, setMessage] = useState('Select a target value and click "Start" to begin!');
    const [explanation, setExplanation] = useState('');
    const [formula, setFormula] = useState('');
    const [low, setLow] = useState(0);
    const [high, setHigh] = useState(array.length - 1);
    const [expectedMid, setExpectedMid] = useState(null);
    const [showFeedback, setShowFeedback] = useState(false);

    const boxRefs = useRef([]);
    const formulaRef = useRef(null);
    const feedbackRef = useRef(null);

    useEffect(() => {
        boxRefs.current = boxRefs.current.slice(0, array.length);
    }, [array.length]);

    const resetAnimation = () => {
        // Reset all boxes to default color
        array.forEach((_, index) => {
            gsap.to(boxRefs.current[index], {
                backgroundColor: '#6200ea',
                scale: 1,
                duration: 0.3
            });
        });

        // Reset status indicators
        setStatus('initial');
        setShowFeedback(false);
        setLow(0);
        setHigh(array.length - 1);
        setExpectedMid(null);
        setMessage('Select a target value and click "Start" to begin!');
        setExplanation('');
        setFormula('');
    };

    const startPractice = () => {
        resetAnimation();
        setStatus('running');

        // Highlight the current search range
        gsap.to(boxRefs.current.slice(low, high + 1), {
            backgroundColor: '#9d46ff',
            duration: 0.5
        });

        // Calculate the expected mid using interpolation formula
        const expectedMidVal = low + Math.floor((high - low) * (target - array[low]) / (array[high] - array[low]));
        setExpectedMid(expectedMidVal);

        // Show the formula with actual values
        const formulaText = `mid = low + ⌊(high - low) × (target - A[low]) ÷ (A[high] - A[low])⌋`;
        const calculationText = `mid = ${low} + ⌊(${high} - ${low}) × (${target} - ${array[low]}) ÷ (${array[high]} - ${array[low]})⌋ = ${expectedMidVal}`;
        setFormula(`${formulaText}\n${calculationText}`);

        // Animate the formula appearing
        if (formulaRef.current) {
            gsap.fromTo(formulaRef.current,
                { opacity: 0, y: -20 },
                { opacity: 1, y: 0, duration: 0.5 }
            );
        }

        setMessage('Which element should be checked based on the interpolation formula? Click on it!');
        setExplanation('Interpolation search estimates the next position to check based on the target value and the values in the current range.');
    };

    const handleBoxClick = (index) => {
        if (status !== 'running') return;

        if (index === expectedMid) {
            // Correct choice
            setStatus('correct');
            setShowFeedback(true);

            gsap.to(boxRefs.current[index], {
                backgroundColor: 'green',
                scale: 1.1,
                duration: 0.5
            });

            if (array[index] === target) {
                setMessage(`Correct! You found the value ${target} at index ${index}!`);
                setExplanation(`The searched value ${target} matches the examined element ${array[index]}.`);
            } else if (array[index] < target) {
                setMessage(`Correct! The value ${array[index]} is less than ${target}, so we need to search the right side.`);
                setExplanation(`In the next step, the low value changes to ${index + 1}.`);
            } else {
                setMessage(`Correct! The value ${array[index]} is greater than ${target}, so we need to search the left side.`);
                setExplanation(`In the next step, the high value changes to ${index - 1}.`);
            }

            // Animate feedback
            if (feedbackRef.current) {
                gsap.fromTo(feedbackRef.current,
                    { opacity: 0, scale: 0 },
                    { opacity: 1, scale: 1, duration: 0.5, ease: "back.out" }
                );
            }
        } else {
            // Incorrect choice
            setStatus('incorrect');
            setShowFeedback(true);

            gsap.to(boxRefs.current[index], {
                backgroundColor: 'red',
                scale: 1.1,
                duration: 0.3
            });

            gsap.to(boxRefs.current[expectedMid], {
                backgroundColor: 'green',
                scale: 1.1,
                delay: 0.5,
                duration: 0.5
            });

            setMessage(`Incorrect! The correct choice would have been index ${expectedMid}.`);
            setExplanation(`Based on the interpolation formula: ${low} + ⌊(${high} - ${low}) × (${target} - ${array[low]}) ÷ (${array[high]} - ${array[low]})⌋ = ${expectedMid}`);

            // Animate feedback
            if (feedbackRef.current) {
                gsap.fromTo(feedbackRef.current,
                    { opacity: 0, scale: 0 },
                    { opacity: 1, scale: 1, duration: 0.5, ease: "back.out" }
                );
            }

            // Set timer to reset after error
            setTimeout(() => {
                resetAnimation();
            }, 3000);
        }
    };

    const continueSearch = () => {
        if (status !== 'correct') return;

        // Update search range based on comparison
        if (array[expectedMid] === target) {
            // Target found, reset for a new search
            setMessage('Search completed! Start a new search.');
            setTimeout(() => {
                resetAnimation();
            }, 2000);
        } else if (array[expectedMid] < target) {
            // Search right side
            setLow(expectedMid + 1);
            setHigh(high);
            setStatus('running');
            setShowFeedback(false);

            // Update visuals
            gsap.to(boxRefs.current.slice(0, expectedMid + 1), {
                backgroundColor: '#cccccc', // Grayed out eliminated section
                duration: 0.5
            });

            gsap.to(boxRefs.current.slice(expectedMid + 1, high + 1), {
                backgroundColor: '#9d46ff',
                duration: 0.5
            });

            // Calculate new expected mid
            const newLow = expectedMid + 1;
            const newMid = newLow + Math.floor((high - newLow) * (target - array[newLow]) / (array[high] - array[newLow]));
            setExpectedMid(newMid);

            // Update formula display
            const formulaText = `mid = low + ⌊(high - low) × (target - A[low]) ÷ (A[high] - A[low])⌋`;
            const calculationText = `mid = ${newLow} + ⌊(${high} - ${newLow}) × (${target} - ${array[newLow]}) ÷ (${array[high]} - ${array[newLow]})⌋ = ${newMid}`;
            setFormula(`${formulaText}\n${calculationText}`);

            setMessage('Which element should be checked based on the interpolation formula? Click on it!');
        } else {
            // Search left side
            setLow(low);
            setHigh(expectedMid - 1);
            setStatus('running');
            setShowFeedback(false);

            // Update visuals
            gsap.to(boxRefs.current.slice(expectedMid), {
                backgroundColor: '#cccccc', // Grayed out eliminated section
                duration: 0.5
            });

            gsap.to(boxRefs.current.slice(low, expectedMid), {
                backgroundColor: '#9d46ff',
                duration: 0.5
            });

            // Calculate new expected mid
            const newHigh = expectedMid - 1;
            if (newHigh >= low) {
                const newMid = low + Math.floor((newHigh - low) * (target - array[low]) / (array[newHigh] - array[low]));
                setExpectedMid(newMid);

                // Update formula display
                const formulaText = `mid = low + ⌊(high - low) × (target - A[low]) ÷ (A[high] - A[low])⌋`;
                const calculationText = `mid = ${low} + ⌊(${newHigh} - ${low}) × (${target} - ${array[low]}) ÷ (${array[newHigh]} - ${array[low]})⌋ = ${newMid}`;
                setFormula(`${formulaText}\n${calculationText}`);

                setMessage('Which element should be checked based on the interpolation formula? Click on it!');
            } else {
                // No more elements to search
                setMessage('Search completed! The element is not in the array.');
                setTimeout(() => {
                    resetAnimation();
                }, 2000);
            }
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
                <p style={{marginBottom: "15px", lineHeight: "1.6"}}>
                    Interpolation search can be more efficient than binary search for sorted arrays with uniformly
                    distributed values because it estimates the probable position of the target value.
                </p>
                <p style={{marginBottom: "15px", lineHeight: "1.6"}}>
                    <strong>Interpolation Formula:</strong> mid = low + ⌊(high - low) × (target - A[low]) ÷ (A[high] -
                    A[low])⌋
                </p>
                <p style={{marginBottom: "10px", lineHeight: "1.6"}}>
                    <strong>Steps:</strong>
                </p>
                <ol style={{paddingLeft: "25px", lineHeight: "1.8"}}>
                    <li style={{marginBottom: "10px"}}>Calculate the next position to check using the interpolation
                        formula
                    </li>
                    <li style={{marginBottom: "10px"}}>Check if the value at the calculated position matches the target
                        value
                    </li>
                    <li style={{marginBottom: "10px"}}>If yes, the search is successful</li>
                    <li style={{marginBottom: "10px"}}>If not, narrow the search range based on comparing the found
                        value with the target value
                    </li>
                    <li style={{marginBottom: "10px"}}>Repeat the steps until you find the value or the search range is
                        empty
                    </li>
                </ol>
            </div>
            <div style={{margin: "30px 0"}}>
                <label style={{marginRight: "15px"}}>
                    Target Value:
                    <input
                        type="number"
                        value={target || ""}
                        onChange={(e) => {
                            const value = e.target.value;
                            setTarget(value === "" ? "" : Number(value));
                            resetAnimation();
                        }}
                        style={{margin: "0 15px", padding: "8px", borderRadius: "4px", border: "1px solid #ccc"}}
                        disabled={status === 'running' || status === 'correct' || status === 'incorrect'}
                    />
                </label>
                <button
                    onClick={startPractice}
                    style={{
                        backgroundColor: "black",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                    }}
                    disabled={status === 'running' || status === 'correct' || status === 'incorrect'}
                >
                    Start
                </button>

                <button
                    onClick={resetAnimation}
                    style={{
                        backgroundColor: "red",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                        marginRight:'20px'
                    }}
                >
                    Restart
                </button>
                {status === 'correct' && array[expectedMid] !== target && (
                    <button
                        onClick={continueSearch}
                        style={{
                            padding: "8px 16px",
                            backgroundColor: "#2196F3",
                            color: "white",
                            border: "none",
                            borderRadius: "4px",
                            cursor: "pointer"
                        }}
                    >
                        Next Step
                    </button>
                )}
            </div>

            <div style={{margin: "30px 0", minHeight: "70px"}}>
                <p style={{fontWeight: "bold", fontSize: "18px", marginBottom: "15px"}}>{message}</p>
                <p style={{fontStyle: "italic", color: "#555"}}>{explanation}</p>
            </div>

            {formula && (
                <div
                    ref={formulaRef}
                    style={{
                        backgroundColor: "#f8f9fa",
                        padding: "20px",
                        borderRadius: "8px",
                        margin: "30px auto",
                        maxWidth: "700px",
                        fontFamily: "monospace",
                        whiteSpace: "pre-wrap",
                        fontSize: "16px",
                        lineHeight: "1.6"
                    }}
                >


                </div>
            )}

            <div style={{position: "relative", marginTop: "50px"}}>
                <div style={{display: "flex", justifyContent: "center", gap: "20px", marginTop: "30px"}}>
                    {array.map((num, index) => (
                        <div
                            key={index}
                            ref={el => boxRefs.current[index] = el}
                            onClick={() => handleBoxClick(index)}
                            style={{
                                width: "60px",
                                height: "60px",
                                backgroundColor: "#6200ea",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                color: "white",
                                fontSize: "22px",
                                borderRadius: "5px",
                                cursor: status === 'running' ? "pointer" : "default",
                                position: "relative",
                                boxShadow: "0 2px 5px rgba(0,0,0,0.2)"
                            }}
                        >
                            {num}
                            <div style={{
                                position: "absolute",
                                bottom: "-30px",
                                fontSize: "16px",
                                color: "black",
                                fontWeight: "bold"
                            }}>
                                {index}
                            </div>
                        </div>
                    ))}
                </div>

                {showFeedback && (
                    <div
                        ref={feedbackRef}
                        style={{
                            position: "absolute",
                            top: "-50px",
                            left: "50%",
                            transform: "translateX(-50%)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            padding: "10px 20px",
                            borderRadius: "20px",
                            backgroundColor: status === 'correct' ? "rgba(0, 200, 0, 0.2)" : "rgba(255, 0, 0, 0.2)",
                            color: status === 'correct' ? "green" : "red",
                            fontWeight: "bold",
                            fontSize: "18px"
                        }}
                    >
                        {status === 'correct' ? (
                            <>
                                <div style={{marginRight: "10px", display: "flex", alignItems: "center"}}>
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                         strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="20 6 9 17 4 12"></polyline>
                                    </svg>
                                </div>
                                Correct!
                            </>
                        ) : (
                            <>
                                <div style={{marginRight: "10px", display: "flex", alignItems: "center"}}>
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                         strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <line x1="18" y1="6" x2="6" y2="18"></line>
                                        <line x1="6" y1="6" x2="18" y2="18"></line>
                                    </svg>
                                </div>
                                Incorrect!
                            </>
                        )}
                    </div>
                )}
            </div>

        </div>
    );
};

export default InterpolationSearchPractice;