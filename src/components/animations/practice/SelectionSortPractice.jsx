import { useEffect, useState } from 'react';
import { gsap } from 'gsap';

const SelectionSortPractice = () => {
    const initialArray = [3, 2, 5, 9, 1, 8, 4];
    const [array, setArray] = useState([...initialArray]);
    const [selected, setSelected] = useState([]);
    const [message, setMessage] = useState('Find the smallest element in the unsorted portion');
    const [feedback, setFeedback] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [minIndexFound, setMinIndexFound] = useState(null);
    const [finalizedIndices, setFinalizedIndices] = useState(new Set());
    const [practiceStep, setPracticeStep] = useState('findMin'); // 'findMin' or 'swap'

    const handleElementClick = (index) => {
        if (practiceStep === 'findMin') {
            handleFindMinStep(index);
        } else if (practiceStep === 'swap') {
            handleSwapStep(index);
        }
    };

    const handleFindMinStep = (index) => {
        // Only allow clicks on elements that are not finalized
        if (finalizedIndices.has(index)) {
            setMessage('This element is already sorted. Focus on the unsorted portion.');
            return;
        }

        // Only allow selection of elements from the unsorted portion
        if (index < currentIndex) {
            setMessage('This element is already sorted. Focus on the unsorted portion.');
            return;
        }

        // Find the actual minimum in the current unsorted portion
        let actualMinIndex = currentIndex;
        for (let i = currentIndex + 1; i < array.length; i++) {
            if (array[i] < array[actualMinIndex]) {
                actualMinIndex = i;
            }
        }

        if (index === actualMinIndex) {
            setMessage('Correct! Now click on the position to swap with.');
            setFeedback('✔️');
            setMinIndexFound(index);
            setPracticeStep('swap');

            // Highlight the found minimum
            const elements = document.querySelectorAll('.array-element');
            gsap.to(elements[index], {
                backgroundColor: 'yellow',
                color:'black',
                duration: 0.5
            });
        } else {
            setMessage(`Incorrect! That's not the smallest element. Try again.`);
            setFeedback('❌');

            // Flash the incorrect selection
            const elements = document.querySelectorAll('.array-element');
            gsap.to(elements[index], {
                backgroundColor: 'red',
                duration: 0.3,
                yoyo: true,
                repeat: 1,
                onComplete: () => {
                    if (!finalizedIndices.has(index)) {
                        gsap.to(elements[index], { backgroundColor: '#6200ea', duration: 0.3 });
                    }
                }
            });
        }
    };

    const handleSwapStep = (index) => {
        // Only allow selection of the current position to swap with
        if (index === currentIndex) {
            if (minIndexFound === currentIndex) {
                // No swap needed, just mark it as sorted
                setMessage('This element is already in the correct position!');
                finalizeCurrent();
            } else {
                setMessage('Correct! Swapping elements...');
                setFeedback('✔️');
                animateSwap(minIndexFound, currentIndex);
            }
        } else {
            setMessage('Incorrect! You need to swap with the current position in the iteration.');
            setFeedback('❌');

            // Flash the incorrect selection
            const elements = document.querySelectorAll('.array-element');
            gsap.to(elements[index], {
                backgroundColor: 'red',
                duration: 0.3,
                yoyo: true,
                repeat: 1,
                onComplete: () => {
                    if (!finalizedIndices.has(index)) {
                        gsap.to(elements[index], { backgroundColor: '#6200ea', duration: 0.3 });
                    }
                }
            });
        }
    };

    const animateSwap = (minIdx, targetIdx) => {
        const elements = document.querySelectorAll('.array-element');
        const minElement = elements[minIdx];
        const targetElement = elements[targetIdx];

        gsap.to([minElement, targetElement], {
            y: -50,
            duration: 0.5
        });

        setTimeout(() => {
            const newArray = [...array];
            [newArray[targetIdx], newArray[minIdx]] = [newArray[minIdx], newArray[targetIdx]];
            setArray(newArray);

            gsap.to([minElement, targetElement], {
                y: 0,
                duration: 0.5,
                onComplete: () => {
                    finalizeCurrent();
                }
            });
        }, 1000);
    };

    const finalizeCurrent = () => {
        // Mark the current position as finalized
        const newFinalizedIndices = new Set(finalizedIndices);
        newFinalizedIndices.add(currentIndex);
        setFinalizedIndices(newFinalizedIndices);

        // Move to the next position
        const nextIndex = currentIndex + 1;

        // Highlight the current position in green
        const elements = document.querySelectorAll('.array-element');
        gsap.to(elements[currentIndex], {
            backgroundColor: 'green',
            duration: 0.5
        });

        setTimeout(() => {
            if (nextIndex >= array.length) {
                // Sorting complete
                setMessage('Sorting complete! Well done!');
                setFeedback('🎉');
            } else {
                setCurrentIndex(nextIndex);
                setMinIndexFound(null);
                setPracticeStep('findMin');
                setMessage('Find the smallest element in the remaining unsorted portion');
                setFeedback(null);

                // Highlight the next current position
                gsap.to(elements[nextIndex], {
                    scale: 1.1,
                    duration: 0.3,
                    yoyo: true,
                    repeat: 1
                });
            }
        }, 1000);
    };

    const resetGame = () => {
        setArray([...initialArray]);
        setSelected([]);
        setMessage('Find the smallest element in the unsorted portion');
        setFeedback(null);
        setCurrentIndex(0);
        setMinIndexFound(null);
        setFinalizedIndices(new Set());
        setPracticeStep('findMin');
    };

    return (
        <div style={{textAlign: 'center', fontFamily: 'Arial, sans-serif', maxWidth: '800px', margin: '0 auto'}}>
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
                    {practiceStep === 'findMin'
                        ? `Current step: Find the smallest element from position ${currentIndex} to the end`
                        : `Current step: Swap the minimum element with position ${currentIndex}`}
                </p>
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
                    <div style={{display: "flex", alignItems: "center", gap: "5px"}}>
                        <div style={{
                            width: "20px",
                            height: "20px",
                            backgroundColor: "red",
                            borderRadius: "3px"
                        }}></div>
                        <span>Not a match</span>
                    </div>
                </div>
            </div>
            <br/>
            <br/>
            <div style={{position: 'relative', marginBottom: '40px', height: '100px'}}>
                {/* Current index indicator - positioned higher */}
                {currentIndex < array.length && (
                    <div style={{
                        position: 'absolute',
                        left: `calc(50% - ${(array.length * 60) / 2}px + ${currentIndex * 60}px + 25px)`,
                        top: '-40px', // Moved higher
                        transform: 'translateX(-50%)',
                        color: '#333',
                        fontWeight: 'bold',
                    }}>
                        Current Position
                        <div style={{
                            width: '0',
                            height: '0',
                            borderLeft: '10px solid transparent',
                            borderRight: '10px solid transparent',
                            borderTop: '10px solid #333',
                            position: 'absolute',
                            left: '50%',
                            transform: 'translateX(-50%)',
                        }}></div>
                    </div>
                )}

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
                                    : index === minIndexFound && practiceStep === 'swap'
                                        ? 'yellow'
                                        : '#6200ea',
                                border: '2px solid #000',
                                fontSize: '20px',
                                fontWeight: 'bold',
                                cursor: 'pointer',
                                borderRadius: '10px',
                                color: 'white',
                                position: 'relative',
                                transition: 'transform 0.2s',
                                transform: index === currentIndex && !finalizedIndices.has(index) ? 'scale(1.05)' : 'scale(1)'
                            }}
                            onClick={() => handleElementClick(index)}
                        >
                            {value}
                            {/* Index labels - positioned lower */}
                            <div style={{
                                position: 'absolute',
                                bottom: '-35px', // Moved lower
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

            <div style={{marginTop: '40px'}}>
                <button
                    onClick={resetGame}
                    style={{
                        padding: '10px 20px',
                        fontSize: '16px',
                        backgroundColor: 'black',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        marginRight: '10px'
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
                <h3>Selection Sort Algorithm Steps:</h3>
                <ol style={{paddingLeft: '20px'}}>
                    <li>Find the smallest element in the unsorted portion</li>
                    <li>Swap it with the element at the current position</li>
                    <li>Move the boundary between sorted and unsorted portions one element to the right</li>
                    <li>Repeat until the entire array is sorted</li>
                </ol>
            </div>
        </div>
    );
};

export default SelectionSortPractice;