import  { useEffect, useState } from 'react';
import { gsap } from 'gsap';
import '../animations/BubbleSortAnimation.css';


const bubbleSort = (array) => {
    const arr = [...array];
    const steps = [];
    let swapped;

    do {
        swapped = false;
        for (let i = 0; i < arr.length - 1; i++) {
            if (arr[i] > arr[i + 1]) {
                // Swap elements
                [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];
                swapped = true;
                steps.push([...arr, { index: i + 1 }]);
            }
        }
    } while (swapped);

    return steps;
};

const BubbleSortAnimation = ({ array }) => {
    const [currentArray, setCurrentArray] = useState(array);
    const [isSorting, setIsSorting] = useState(false);
    const [steps, setSteps] = useState([]);
    const [currentStep, setCurrentStep] = useState(0);

    const startSorting = () => {
        setIsSorting(true);
        const newSteps = bubbleSort(currentArray);
        setSteps(newSteps);
        setCurrentStep(0);
    };

    useEffect(() => {
        if (!isSorting || currentStep >= steps.length) return;

        // Animate the current step
        const step = steps[currentStep];
        setCurrentArray(step.filter((_, i) => i < step.length - 1));
        highlightElement(step[step.length - 1].index);

        const timeout = setTimeout(() => {
            setCurrentStep(currentStep + 1);
        }, 2500); // Timing between steps

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

    return (
        <div>
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
            <button onClick={startSorting} style={{ marginTop: '20px', padding: '10px 20px', fontSize: '16px' }}>
                Start Sorting
            </button>
        </div>
    );
};

export default BubbleSortAnimation;
