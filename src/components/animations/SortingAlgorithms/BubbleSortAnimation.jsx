import { useEffect, useState } from 'react';
import { gsap } from 'gsap';
import './BubbleSortAnimation.css'; // Módosított CSS import

const bubbleSortSteps = (array) => {
    const arr = [...array];
    const steps = [];
    let swapped;

    do {
        swapped = false;
        for (let i = 0; i < arr.length - 1; i++) {
            steps.push({ type: 'compare', indices: [i, i + 1] });
            if (arr[i] > arr[i + 1]) {
                [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]]; // Csere
                swapped = true;
                steps.push({ type: 'swap', indices: [i, i + 1], array: [...arr] });
            }
        }
        // Az aktuálisan a helyére került elemet azonnal megjelöljük
        steps.push({ type: 'sorted', index: arr.length - 1 - steps.filter(step => step.type === 'sorted').length });
    } while (swapped);

    // Az összes elemet megjelöljük a rendezes végén
    for (let i = 0; i < arr.length; i++) {
        steps.push({ type: 'sorted', index: i });
    }

    return steps;
};

const BubbleSortAnimation = () => {
    const [arrayInput, setArrayInput] = useState('3, 2, 5, 9, 1, 8, 4');
    const [currentArray, setCurrentArray] = useState([3, 2, 5, 9, 1, 8, 4]);
    const [steps, setSteps] = useState([]);
    const [currentStep, setCurrentStep] = useState(0);
    const [isSorting, setIsSorting] = useState(false);

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

            // Alaphelyzet visszaállítása
            const elements = document.querySelectorAll('.bubble-array-element');
            elements.forEach(el => {
                el.classList.remove('bubble-compare', 'bubble-sorted');
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

        // Alaphelyzet visszaállítása
        const elements = document.querySelectorAll('.bubble-array-element');
        elements.forEach(el => {
            el.classList.remove('bubble-compare', 'bubble-sorted');
        });

        setSteps(bubbleSortSteps(currentArray));
        setIsSorting(true);
        setCurrentStep(0);
    };

    useEffect(() => {
        if (!isSorting || currentStep >= steps.length) return;

        const step = steps[currentStep];
        if (step.type === 'compare') {
            highlightElements(step.indices, 'bubble-compare');
        } else if (step.type === 'swap') {
            swapElements(step.indices, step.array);
        } else if (step.type === 'sorted') {
            markAsSorted(step.index);
        }

        const timeout = setTimeout(() => {
            setCurrentStep((prev) => prev + 1);
        }, 1000); // Minden lépés 1 másodpercig tart

        return () => clearTimeout(timeout);
    }, [isSorting, currentStep, steps]);

    const highlightElements = (indices, className) => {
        const elements = document.querySelectorAll('.bubble-array-element');
        elements.forEach((el, idx) => {
            if (indices.includes(idx)) {
                el.classList.add(className);
            } else {
                el.classList.remove('bubble-compare');
            }
        });
    };

    const swapElements = (indices, newArray) => {
        const elements = document.querySelectorAll('.bubble-array-element');
        const [firstIdx, secondIdx] = indices;

        // Felemelt elemek animációja
        const firstElement = elements[firstIdx];
        const secondElement = elements[secondIdx];

        gsap.to(firstElement, { y: -50, duration: 0.5 });
        gsap.to(secondElement, { y: -50, duration: 0.5 });

        // Helycsere animációja
        setTimeout(() => {
            setCurrentArray(newArray);

            gsap.to(firstElement, { y: 0, duration: 0.5 });
            gsap.to(secondElement, { y: 0, duration: 0.5 });
        }, 500);
    };

    const markAsSorted = (index) => {
        const elements = document.querySelectorAll('.bubble-array-element');
        if (elements[index]) {
            elements[index].classList.add('bubble-sorted');
        }
    };

    return (
        <div className="bubble-sort-container">
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
                <p>This animation demonstrates the bubble sort algorithm in action. Bubble sort is a simple sorting algorithm that repeatedly steps through the list, compares adjacent elements, and swaps them if they are in the wrong order.</p>
                <p><strong>How the algorithm works:</strong></p>
                <ol style={{textAlign: "left"}}>
                    <li>Compare adjacent elements (highlighted in blue)</li>
                    <li>If the elements are in the wrong order, swap them</li>
                    <li>Repeat steps 1-2 for all elements in the array</li>
                    <li>After each full pass, the largest unsorted element "bubbles up" to its correct position</li>
                    <li>Elements in their final sorted positions are marked in green</li>
                </ol>
                <p><strong>Time Complexity:</strong> O(n²) - In the worst case, we need to make n passes with n-1 comparisons each</p>
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
                        <span>Being compared</span>
                    </div>
                    <div style={{display: "flex", alignItems: "center", gap: "5px"}}>
                        <div style={{
                            width: "20px",
                            height: "20px",
                            backgroundColor: "green",
                            borderRadius: "3px"
                        }}></div>
                        <span>Sorted element</span>
                    </div>
                </div>
            </div>
            <div style={{ marginBottom: '20px' }}>
                <input
                    type="text"
                    value={arrayInput}
                    onChange={(e) => setArrayInput(e.target.value)}
                    placeholder="Enter comma-separated numbers"
                    style={{ padding: '10px', width: '300px', fontSize: '16px' }}
                />
                <button
                    onClick={handleArrayChange}
                    style={{
                        marginLeft: '10px',
                        padding: '10px 20px',
                        fontSize: '16px',
                        backgroundColor: '#6200ea',
                        color: '#fff',
                        border: 'none',
                        cursor: 'pointer',
                    }}
                >
                    Set Array
                </button>
            </div>
            <div className="bubble-array-container">
                {currentArray.map((value, index) => (
                    <div key={index} className="bubble-array-element">
                        {value}
                    </div>
                ))}
            </div>
            <button
                onClick={startSorting}
                style={{
                    marginTop: '20px',
                    padding: '10px 20px',
                    fontSize: '16px',
                    backgroundColor: '#6200ea',
                    color: '#fff',
                    border: 'none',
                    cursor: 'pointer',
                }}
                disabled={isSorting}
            >
                Start Sorting
            </button>
        </div>
    );
};

export default BubbleSortAnimation;