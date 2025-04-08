import { useEffect, useState } from 'react';
import { gsap } from 'gsap';
import './SelectionSortAnimation.css';

const selectionSortSteps = (array) => {
    const arr = [...array];
    const steps = [];

    for (let i = 0; i < arr.length; i++) {
        let minIndex = i;
        for (let j = i + 1; j < arr.length; j++) {
            steps.push({ type: 'compare', indices: [minIndex, j], array: [...arr] });
            if (arr[j] < arr[minIndex]) {
                minIndex = j;
            }
        }
        if (minIndex !== i) {
            [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]];
            steps.push({ type: 'swap', indices: [i, minIndex], array: [...arr] });
        }
        steps.push({ type: 'sorted', index: i, array: [...arr] });
    }

    return steps;
};

const SelectionSortAnimation = () => {
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
        } catch {
            alert('Invalid input. Please provide a comma-separated list of numbers.');
        }
    };

    const startSorting = () => {
        if (currentArray.length === 0) {
            alert('Array is empty.');
            return;
        }
        setSteps(selectionSortSteps(currentArray));
        setIsSorting(true);
        setCurrentStep(0);
    };

    useEffect(() => {
        if (!isSorting || currentStep >= steps.length) return;

        const step = steps[currentStep];
        if (step.type === 'swap') {
            swapElements(step.indices, step.array);
        } else if (step.type === 'compare') {
            compareElements(step.indices);
        } else if (step.type === 'sorted') {
            markSorted(step.index);
        }

        const timeout = setTimeout(() => {
            setCurrentStep((prev) => prev + 1);
        }, 1500);

        return () => clearTimeout(timeout);
    }, [isSorting, currentStep, steps]);

    const swapElements = (indices, newArray) => {
        const elements = document.querySelectorAll('.array-elementSS');
        const [firstIdx, secondIdx] = indices;

        const firstElement = elements[firstIdx];
        const secondElement = elements[secondIdx];

        gsap.to(firstElement, { y: -50, duration: 0.7 });
        gsap.to(secondElement, { y: -50, duration: 0.7 });

        setTimeout(() => {
            setCurrentArray(newArray);
            gsap.to(firstElement, { y: 0, duration: 0.7 });
            gsap.to(secondElement, { y: 0, duration: 0.7 });
        }, 700);
    };

    const compareElements = (indices) => {
        const elements = document.querySelectorAll('.array-elementSS');
        const [firstIdx, secondIdx] = indices;

        gsap.to(elements[firstIdx], { backgroundColor: 'yellow', duration: 0.5 });
        gsap.to(elements[secondIdx], { backgroundColor: 'yellow', duration: 0.5 });

        setTimeout(() => {
            gsap.to(elements[firstIdx], { backgroundColor: '#6200ea', duration: 0.5 });
            gsap.to(elements[secondIdx], { backgroundColor: '#6200ea', duration: 0.5 });
        }, 700);
    };

    const markSorted = (index) => {
        const elements = document.querySelectorAll('.array-elementSS');
        const sortedElement = elements[index];

        gsap.to(sortedElement, { backgroundColor: 'green', duration: 0.7 });
    };

    useEffect(() => {
        if (isSorting && currentStep === steps.length) {
            const elements = document.querySelectorAll('.array-elementSS');
            elements.forEach((element) => {
                gsap.to(element, { backgroundColor: 'green', duration: 1 });
            });
        }
    }, [currentStep, isSorting, steps.length]);

    return (
        <div>
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
                <p>This animation demonstrates the selection sort algorithm in action. Selection sort is a
                    straightforward sorting algorithm that divides the list into a sorted and an unsorted part,
                    repeatedly selecting the smallest element from the unsorted section and moving it to the end of the
                    sorted section.</p>
                <p><strong>How the algorithm works:</strong></p>
                <ol style={{textAlign: "left"}}>
                    <li>Find the smallest element in the unsorted portion of the array (highlighted in blue)</li>
                    <li>Swap it with the first element of the unsorted portion</li>
                    <li>Mark the newly placed element as sorted (highlighted in green)</li>
                    <li>Repeat steps 1-3 for the remaining unsorted portion</li>
                    <li>Continue until the entire array is sorted</li>
                </ol>
                <p><strong>Time Complexity:</strong> O(n²) - The algorithm always makes n(n-1)/2 comparisons, regardless
                    of the input</p>

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
            <div style={{marginBottom: '20px'}}>
                <input
                    type="text"
                    value={arrayInput}
                    onChange={(e) => setArrayInput(e.target.value)}
                    placeholder="Enter comma-separated numbers"
                    style={{padding: '10px', width: '300px', fontSize: '16px'}}
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
            <div className="array-containerSS">
                {currentArray.map((value, index) => (
                    <div key={index} className="array-elementSS">
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
            >
                Start Sorting
            </button>
        </div>
    );
};

export default SelectionSortAnimation;