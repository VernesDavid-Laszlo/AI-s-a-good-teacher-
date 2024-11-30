import { useEffect, useState } from 'react';
import { gsap } from 'gsap';
import './BubbleSortAnimation.css';

const bubbleSort = (array) => {
    const arr = [...array];
    const steps = [];
    let swapped;

    do {
        swapped = false;
        for (let i = 0; i < arr.length - 1; i++) {
            if (arr[i] > arr[i + 1]) {
                [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];
                swapped = true;
                steps.push([...arr, { index: i + 1 }]);
            }
        }
    } while (swapped);

    return steps;
};

const BubbleSortAnimation = () => {
    const [arrayInput, setArrayInput] = useState('5, 3, 8, 4, 2'); // Default input string
    const [currentArray, setCurrentArray] = useState([5, 3, 8, 4, 2]); // Default array
    const [isSorting, setIsSorting] = useState(false);
    const [steps, setSteps] = useState([]);
    const [currentStep, setCurrentStep] = useState(0);

    const startSorting = () => {
        if (currentArray.length === 0) {
            alert('Array is empty or undefined!');
            return;
        }
        setIsSorting(true);
        const newSteps = bubbleSort(currentArray);
        setSteps(newSteps);
        setCurrentStep(0);
    };

    useEffect(() => {
        if (!isSorting || currentStep >= steps.length) return;

        const step = steps[currentStep];
        setCurrentArray(step.filter((_, i) => i < step.length - 1));
        highlightElement(step[step.length - 1]?.index);

        const timeout = setTimeout(() => {
            setCurrentStep(currentStep + 1);
        }, 2500);

        return () => clearTimeout(timeout);
    }, [isSorting, currentStep, steps]);

    const highlightElement = (index) => {
        const elements = document.querySelectorAll('.array-element');
        elements.forEach((element, i) => {
            if (i === index) {
                gsap.to(element, {
                    scale: 1.2,
                    duration: 0.5,
                    backgroundColor: '#d1ce0f',
                });
            } else {
                gsap.to(element, {
                    scale: 1,
                    backgroundColor: '#6200ea',
                    duration: 0.5,
                });
            }
        });
    };

    const handleArrayChange = () => {
        try {
            const parsedArray = arrayInput
                .split(',')
                .map((num) => parseInt(num.trim(), 10))
                .filter((num) => !isNaN(num));
            setCurrentArray(parsedArray);
            setIsSorting(false);
            setSteps([]);
            setCurrentStep(0);
        } catch (error) {
            alert('Invalid array input! Please provide a comma-separated list of numbers.');
        }
    };

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
            {currentArray.length > 0 ? (
                <div className="array-container">
                    {currentArray.map((value, index) => (
                        <div
                            key={index}
                            className="array-element"
                        >
                            {value}
                        </div>
                    ))}
                </div>
            ) : (
                <div>No data to sort</div>
            )}
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

export default BubbleSortAnimation;
