import { useEffect, useState } from 'react';
import { gsap } from 'gsap';
import './InsertionSortAnimation.css';

const insertionSortSteps = (array) => {
    const arr = [...array];
    const steps = [];
    const sortedIndices = new Set();


    for (let i = 1; i < arr.length; i++) {
        const current = arr[i];
        steps.push({ type: 'select', index: i, value: current });

        let j = i - 1;

        while (j >= 0) {
            steps.push({ type: 'compare', indices: [j, i] });

            if (arr[j] > current) {
                arr[j + 1] = arr[j];
                steps.push({ type: 'shift', fromIndex: j, toIndex: j + 1, array: [...arr] });
                j--;
            } else {
                break;
            }
        }

        arr[j + 1] = current;
        steps.push({ type: 'insert', index: j + 1, value: current, array: [...arr] });
    }

    const sortedArr = [...array].sort((a, b) => a - b);
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] === sortedArr[i]) {
            steps.push({ type: 'finalPosition', index: i });
        }
    }

    return steps;
};

const InsertionSortAnimation = () => {
    const [arrayInput, setArrayInput] = useState('3, 2, 5, 9, 1, 8, 4');
    const [currentArray, setCurrentArray] = useState([3, 2, 5, 9, 1, 8, 4]);
    const [steps, setSteps] = useState([]);
    const [currentStep, setCurrentStep] = useState(0);
    const [isSorting, setIsSorting] = useState(false);
    const [selectedElement, setSelectedElement] = useState(null);
    const [sortedIndices, setSortedIndices] = useState(new Set());

    const handleArrayChange = () => {
        try {
            const parsedArray = arrayInput
                .split(',')
                .map((num) => parseInt(num.trim(), 10))
                .filter((num) => !isNaN(num));
            setCurrentArray(parsedArray);
            setSteps([]);
            setCurrentStep(0);
            setIsSorting(false);
            setSelectedElement(null);
            setSortedIndices(new Set());

            const elements = document.querySelectorAll('.insertion-array-element');
            elements.forEach(el => {
                el.classList.remove('insertion-compare', 'insertion-sorted', 'insertion-selected');
            });
        } catch {
            alert('Invalid input. Please provide a comma-separated list of numbers.');
        }
    };

    const startSorting = () => {
        if (currentArray.length === 0) {
            alert('Array is empty.');
            return;
        }

        const elements = document.querySelectorAll('.insertion-array-element');
        elements.forEach(el => {
            el.classList.remove('insertion-compare', 'insertion-sorted', 'insertion-selected');
        });

        setSortedIndices(new Set());
        setSteps(insertionSortSteps(currentArray));
        setIsSorting(true);
        setCurrentStep(0);
    };

    useEffect(() => {
        if (!isSorting || currentStep >= steps.length) {
            if (currentStep >= steps.length && steps.length > 0) {
                setIsSorting(false);

                const sortedArr = [...currentArray].sort((a, b) => a - b);
                const newSortedIndices = new Set();

                currentArray.forEach((value, index) => {
                    if (value === sortedArr[index]) {
                        newSortedIndices.add(index);
                    }
                });

                setSortedIndices(newSortedIndices);

                const elements = document.querySelectorAll('.insertion-array-element');
                elements.forEach((el, idx) => {
                    if (newSortedIndices.has(idx)) {
                        el.classList.add('insertion-sorted');
                    } else {
                        el.classList.remove('insertion-sorted');
                    }
                });
            }
            return;
        }

        const step = steps[currentStep];

        if (step.type === 'select') {
            selectElement(step.index);
            setSelectedElement(step.value);
        } else if (step.type === 'compare') {
            highlightCompare(step.indices);
        } else if (step.type === 'shift') {
            shiftElement(step.fromIndex, step.toIndex, step.array);
        } else if (step.type === 'insert') {
            insertElement(step.index, step.value, step.array);
        } else if (step.type === 'finalPosition') {
            markAsFinalPosition(step.index);
        }

        const timeout = setTimeout(() => {
            setCurrentStep((prev) => prev + 1);
        }, 1000);

        return () => clearTimeout(timeout);
    }, [isSorting, currentStep, steps, currentArray]);

    const selectElement = (index) => {
        const elements = document.querySelectorAll('.insertion-array-element');
        elements.forEach((el, idx) => {
            if (idx === index) {
                el.classList.add('insertion-selected');
            } else {
                el.classList.remove('insertion-selected');
            }
        });
    };

    const highlightCompare = (indices) => {
        const elements = document.querySelectorAll('.insertion-array-element');
        elements.forEach((el, idx) => {
            if (indices.includes(idx)) {
                el.classList.add('insertion-compare');
            } else if (!el.classList.contains('insertion-sorted') && !el.classList.contains('insertion-selected')) {
                el.classList.remove('insertion-compare');
            }
        });
    };

    const shiftElement = (fromIndex, toIndex, newArray) => {
        const elements = document.querySelectorAll('.insertion-array-element');

        gsap.to(elements[fromIndex], {
            y: -30,
            duration: 0.3,
            onComplete: () => {
                gsap.to(elements[fromIndex], {
                    x: 50,
                    duration: 0.3,
                    onComplete: () => {
                        setCurrentArray(newArray);
                        gsap.to(elements[fromIndex], { y: 0, x: 0, duration: 0.3 });
                    }
                });
            }
        });
    };

    const insertElement = (index, value, newArray) => {
        setCurrentArray(newArray);

        setTimeout(() => {
            const elements = document.querySelectorAll('.insertion-array-element');
            if (elements[index]) {
                elements[index].classList.add('insertion-inserted');

                setTimeout(() => {
                    elements[index].classList.remove('insertion-inserted');
                }, 500);
            }
        }, 100);
    };

    const markAsFinalPosition = (index) => {
        const elements = document.querySelectorAll('.insertion-array-element');
        if (elements[index]) {
            const newSortedIndices = new Set(sortedIndices);
            newSortedIndices.add(index);
            setSortedIndices(newSortedIndices);

            elements[index].classList.add('insertion-sorted');
        }
    };

    const isInFinalPosition = (index) => {

        const sortedArr = [...currentArray].sort((a, b) => a - b);
        return currentArray[index] === sortedArr[index];
    };

    return (
        <div className="insertion-sort-container">
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
                <p>This animation demonstrates the insertion sort algorithm in action. Insertion sort builds the final sorted array one item at a time, similar to how you might sort a hand of playing cards.</p>
                <p><strong>How the algorithm works:</strong></p>
                <ol style={{textAlign: "left"}}>
                    <li>We start with the first element as already in the sorted portion</li>
                    <li>For each unsorted element (highlighted in purple), we:</li>
                    <li>Compare it with elements in the sorted portion (highlighted in yellow)</li>
                    <li>Shift larger elements to the right to make space for the current element</li>
                    <li>Insert the current element into its correct position</li>
                    <li>Elements in their final sorted positions are marked in green</li>
                </ol>
                <p><strong>Time Complexity:</strong> O(n²) in the worst case, but performs better on partially sorted arrays</p>
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
                            backgroundColor: "purple",
                            borderRadius: "3px"
                        }}></div>
                        <span>Selected element</span>
                    </div>
                    <div style={{display: "flex", alignItems: "center", gap: "5px"}}>
                        <div style={{
                            width: "20px",
                            height: "20px",
                            backgroundColor: "yellow",
                            borderRadius: "3px"
                        }}></div>
                        <span>Being compared</span>
                    </div>
                    <div style={{display: "flex", alignItems: "center", gap: "5px"}}>
                        <div style={{
                            width: "20px",
                            height: "20px",
                            backgroundColor: "green",
                            borderRadius: "3px"
                        }}></div>
                        <span>Sorted element in final position</span>
                    </div>
                </div>
            </div>

            <div className="insertion-controls">
                <div className="insertion-input-container">
                    <input
                        type="text"
                        value={arrayInput}
                        onChange={(e) => setArrayInput(e.target.value)}
                        placeholder="Enter comma-separated numbers"
                        className="insertion-input"
                    />
                    <button
                        onClick={handleArrayChange}
                        className="insertion-button"
                    >
                        Set Array
                    </button>
                </div>

                <div className="insertion-array-container">
                    {currentArray.map((value, index) => (
                        <div
                            key={index}
                            className={`insertion-array-element ${sortedIndices.has(index) ? 'insertion-sorted' : ''}`}
                        >
                            {value}
                        </div>
                    ))}
                </div>

                {selectedElement !== null && (
                    <div className="insertion-current-element">
                        <div>Current element: {selectedElement}</div>
                    </div>
                )}

                <div className="insertion-button-container">
                    <button
                        onClick={startSorting}
                        className="insertion-button"
                        disabled={isSorting}
                    >
                        Start Sorting
                    </button>
                </div>
            </div>
        </div>
    );
};

export default InsertionSortAnimation;