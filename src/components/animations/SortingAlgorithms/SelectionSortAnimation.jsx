import { useEffect, useState } from 'react';
import { gsap } from 'gsap';
import './SortAnimations.css';

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
        const elements = document.querySelectorAll('.array-element');
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
        const elements = document.querySelectorAll('.array-element');
        const [firstIdx, secondIdx] = indices;

        gsap.to(elements[firstIdx], { backgroundColor: '#ff9800', duration: 0.5 });
        gsap.to(elements[secondIdx], { backgroundColor: '#ff9800', duration: 0.5 });

        setTimeout(() => {
            gsap.to(elements[firstIdx], { backgroundColor: '#6200ea', duration: 0.5 });
            gsap.to(elements[secondIdx], { backgroundColor: '#6200ea', duration: 0.5 });
        }, 700);
    };

    const markSorted = (index) => {
        const elements = document.querySelectorAll('.array-element');
        const sortedElement = elements[index];

        gsap.to(sortedElement, { backgroundColor: '#4caf50', duration: 0.7 });
    };

    useEffect(() => {
        if (isSorting && currentStep === steps.length) {
            const elements = document.querySelectorAll('.array-element');
            elements.forEach((element) => {
                gsap.to(element, { backgroundColor: '#4caf50', duration: 1 });
            });
        }
    }, [currentStep, isSorting, steps.length]);

    return (
        <div>
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
            <div className="array-container">
                {currentArray.map((value, index) => (
                    <div key={index} className="array-element">
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