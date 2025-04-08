import { useEffect, useState } from 'react';
import { gsap } from 'gsap';

const BubbleSortPractice = () => {
    const initialArray = [3, 2, 5, 9, 1, 8, 4];
    const sortedArray = [...initialArray].sort((a, b) => a - b);
    const [array, setArray] = useState([...initialArray]);
    const [selected, setSelected] = useState([]);
    const [message, setMessage] = useState('Select two adjacent elements to compare');
    const [feedback, setFeedback] = useState(null);
    const [finalizedIndices, setFinalizedIndices] = useState(new Set());
    const [currentPass, setCurrentPass] = useState(0);
    const [comparisonsInPass, setComparisonsInPass] = useState(0);
    const [totalComparisons, setTotalComparisons] = useState(0);
    const [expectingAction, setExpectingAction] = useState('compare'); // 'compare', 'swap', or 'continue'

    const handleElementClick = (index) => {
        if (expectingAction === 'compare') {
            handleCompareSelection(index);
        } else if (expectingAction === 'swap' || expectingAction === 'continue') {
            handleActionSelection(index);
        }
    };

    const handleCompareSelection = (index) => {
        // Only allow selection of elements that are not finalized
        if (finalizedIndices.has(index)) {
            setMessage('This element is already sorted. Focus on the unsorted portion.');
            return;
        }

        if (selected.length === 0) {
            setSelected([index]);
            highlightElement(index, 'yellow');
            setMessage('Now select an adjacent element to compare');
        } else if (selected.length === 1) {
            const firstIdx = selected[0];

            // Check if selected elements are adjacent
            if (Math.abs(firstIdx - index) === 1) {
                setSelected([firstIdx, index]);
                highlightElement(index, 'yellow');

                // Determine the correct action - swap or continue
                if (array[firstIdx] > array[index] && firstIdx < index) {
                    setMessage('Elements need to be swapped. Click "Swap" button below.');
                    setExpectingAction('swap');
                } else {
                    setMessage('Elements are in the correct order. Click "Continue" button below.');
                    setExpectingAction('continue');
                }
            } else {
                setMessage('Must select adjacent elements. Try again.');
                setSelected([]);
                resetHighlighting();
            }
        }
    };

    const handleActionSelection = (actionType) => {
        if (actionType === 'swap' && expectingAction === 'swap') {
            setMessage('Correct! Swapping elements...');
            setFeedback('✔️');
            const [firstIdx, secondIdx] = selected.sort((a, b) => a - b);
            animateSwap(firstIdx, secondIdx);
        } else if (actionType === 'continue' && expectingAction === 'continue') {
            setMessage('Correct! No swap needed.');
            setFeedback('✔️');
            processContinue();
        } else {
            setMessage(expectingAction === 'swap'
                ? 'Incorrect! These elements need to be swapped.'
                : 'Incorrect! These elements are already in order.');
            setFeedback('❌');

            // Flash error and reset after delay
            setTimeout(() => {
                resetHighlighting();
                setSelected([]);
                setMessage('Select two adjacent elements to compare');
                setFeedback(null);
                setExpectingAction('compare');
            }, 1500);
        }
    };

    const highlightElement = (index, color) => {
        const elements = document.querySelectorAll('.array-element');
        gsap.to(elements[index], { backgroundColor: color, duration: 0.3 });
    };

    const resetHighlighting = () => {
        const elements = document.querySelectorAll('.array-element');
        elements.forEach((element, idx) => {
            if (!finalizedIndices.has(idx)) {
                gsap.to(element, { backgroundColor: '#6200ea', duration: 0.3 });
            }
        });
    };

    const animateSwap = (firstIdx, secondIdx) => {
        const elements = document.querySelectorAll('.array-element');
        const firstElement = elements[firstIdx];
        const secondElement = elements[secondIdx];

        gsap.to([firstElement, secondElement], { y: -50, duration: 0.5 });

        setTimeout(() => {
            const newArray = [...array];
            [newArray[firstIdx], newArray[secondIdx]] = [newArray[secondIdx], newArray[firstIdx]];
            setArray(newArray);

            gsap.to([firstElement, secondElement], {
                y: 0,
                duration: 0.5,
                onComplete: () => {
                    resetHighlighting();
                    processAfterComparison(newArray);
                }
            });
        }, 1000);
    };

    const processContinue = () => {
        resetHighlighting();
        processAfterComparison(array);
    };

    const processAfterComparison = (currentArray) => {
        setSelected([]);
        setTotalComparisons(totalComparisons + 1);

        const newComparisonsInPass = comparisonsInPass + 1;
        setComparisonsInPass(newComparisonsInPass);

        // Check if we've completed all comparisons in this pass
        if (newComparisonsInPass >= array.length - 1 - currentPass) {
            // Mark the largest element in this pass as finalized
            const newFinalizedIndices = new Set(finalizedIndices);
            newFinalizedIndices.add(array.length - 1 - currentPass);
            setFinalizedIndices(newFinalizedIndices);

            // Highlight the newly sorted element
            const elements = document.querySelectorAll('.array-element');
            gsap.to(elements[array.length - 1 - currentPass], {
                backgroundColor: 'green',
                duration: 0.5
            });

            // Check if sorting is complete
            if (currentPass === array.length - 2) {
                // Add the last remaining element as sorted
                newFinalizedIndices.add(0);
                setFinalizedIndices(newFinalizedIndices);
                gsap.to(elements[0], { backgroundColor: 'green', duration: 0.5 });

                setMessage('Sorting complete! Well done!');
                setFeedback('🎉');
            } else {
                // Move to the next pass
                const nextPass = currentPass + 1;
                setCurrentPass(nextPass);
                setComparisonsInPass(0);
                setMessage('Starting next pass. Select two adjacent elements to compare.');
                setExpectingAction('compare');
                setFeedback(null);
            }
        } else {
            // Continue with the current pass
            setMessage('Select next two adjacent elements to compare');
            setExpectingAction('compare');
            setFeedback(null);
        }
    };

    const resetGame = () => {
        setArray([...initialArray]);
        setSelected([]);
        setMessage('Select two adjacent elements to compare');
        setFeedback(null);
        setFinalizedIndices(new Set());
        setCurrentPass(0);
        setComparisonsInPass(0);
        setTotalComparisons(0);
        setExpectingAction('compare');
    };

    return (
        <div style={{textAlign: 'center', fontFamily: 'Arial, sans-serif', maxWidth: '800px', margin: '0 auto'}}>
            <div style={{
                fontSize: "16px",
                color: "#333",
                textAlign: "left",
                maxWidth: "1000px",
                margin: "0px auto 20px",
                padding: "25px",
                backgroundColor: "#f9f9f9",
                borderRadius: "8px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                fontFamily: "Arial"
            }}>
                <p>This is an interactive practice for the bubble sort algorithm. In this exercise, you'll perform bubble sort yourself by selecting elements and deciding when to swap them.</p>
                <p><strong>Steps to follow:</strong></p>
                <ol style={{textAlign: "left"}}>
                    <li>Select two adjacent elements to compare them</li>
                    <li>Decide whether they need to be swapped or not</li>
                    <li>Click "Swap" if the left element is greater than the right element</li>
                    <li>Click "Continue (No Swap)" if the elements are already in order</li>
                    <li>After each complete pass, the largest unsorted element will be placed in its final position</li>
                    <li>Continue until all elements are sorted</li>
                </ol>
                <p><strong>Time Complexity:</strong> O(n²) - You'll need to make n-1 passes with decreasing comparisons</p>
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
                        <span>Unsorted element</span>
                    </div>
                    <div style={{display: "flex", alignItems: "center", gap: "5px"}}>
                        <div style={{
                            width: "20px",
                            height: "20px",
                            backgroundColor: "yellow",
                            borderRadius: "3px"
                        }}></div>
                        <span>Currently selected</span>
                    </div>
                    <div style={{display: "flex", alignItems: "center", gap: "5px"}}>
                        <div style={{
                            width: "20px",
                            height: "20px",
                            backgroundColor: "green",
                            borderRadius: "3px"
                        }}></div>
                        <span>In final sorted position</span>
                    </div>
                </div>
            </div>

            <div style={{
                backgroundColor: '#f0f0f0',
                padding: '15px',
                borderRadius: '10px',
                marginBottom: '20px'
            }}>
                <p style={{fontSize: '18px', fontWeight: 'bold'}}>
                    {message} {feedback && <span style={{fontSize: '24px', marginLeft: '10px'}}>{feedback}</span>}
                </p>
                <p style={{fontSize: '16px'}}>
                    Current pass: {currentPass + 1} | Comparisons in this pass: {comparisonsInPass} | Total comparisons: {totalComparisons}
                </p>
            </div>

            <div style={{position: 'relative', marginBottom: '40px', height: '100px'}}>
                <div style={{display: 'flex', justifyContent: 'center', gap: '10px'}}>
                    {array.map((value, index) => (
                        <div
                            key={index}
                            className="array-element"
                            style={{
                                width: '50px',
                                height: '50px',
                                lineHeight: '50px',
                                textAlign: 'center',
                                backgroundColor: finalizedIndices.has(index)
                                    ? 'green'
                                    : selected.includes(index)
                                        ? 'yellow'
                                        : '#6200ea',
                                border: '2px solid #000',
                                fontSize: '20px',
                                fontWeight: 'bold',
                                cursor: 'pointer',
                                borderRadius: '10px',
                                color: selected.includes(index) ? 'black' : 'white',
                                position: 'relative',
                            }}
                            onClick={() => handleElementClick(index)}
                        >
                            {value}
                            <div style={{
                                position: 'absolute',
                                bottom: '-35px',
                                left: '50%',
                                transform: 'translateX(-50%)',
                                fontSize: '14px',
                                color: '#333',
                            }}>
                                {index}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {expectingAction !== 'compare' && (
                <div style={{marginTop: '20px', marginBottom: '20px'}}>
                    <button
                        onClick={() => handleActionSelection('swap')}
                        style={{
                            padding: '10px 20px',
                            fontSize: '16px',
                            backgroundColor: 'black',
                            color: 'white',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer',
                            marginRight: '10px',
                            fontWeight: 'bold'
                        }}
                    >
                        Swap
                    </button>
                    <button
                        onClick={() => handleActionSelection('continue')}
                        style={{
                            padding: '10px 20px',
                            fontSize: '16px',
                            backgroundColor: 'black',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer',
                            fontWeight: 'bold'
                        }}
                    >
                        Continue (No Swap)
                    </button>
                </div>
            )}

            <div style={{marginTop: '20px'}}>
                <button
                    onClick={resetGame}
                    style={{
                        padding: '10px 20px',
                        fontSize: '16px',
                        backgroundColor: 'black',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer'
                    }}
                >
                    Restart
                </button>
            </div>

            <div style={{
                marginTop: '30px',
                backgroundColor: '#f9f9f9',
                padding: '15px',
                borderRadius: '10px',
                border: '1px solid #ddd',
                textAlign: 'left'
            }}>
                <h3>Bubble Sort Algorithm Steps:</h3>
                <ol style={{paddingLeft: '20px'}}>
                    <li>Compare adjacent elements and swap them if they are in the wrong order</li>
                    <li>After each pass, the largest unsorted element "bubbles up" to its correct position</li>
                    <li>Each pass requires less comparisons as more elements become sorted</li>
                    <li>Repeat until no more swaps are needed</li>
                </ol>
            </div>
        </div>
    );
};

export default BubbleSortPractice;