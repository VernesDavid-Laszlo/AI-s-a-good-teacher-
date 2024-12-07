import { useEffect, useState } from 'react';
import { gsap } from 'gsap';
import './SortAnimations.css';

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
        } catch {
            alert('Invalid input. Please provide a comma-separated list of numbers.');
        }
    };

    const startSorting = () => {
        if (currentArray.length === 0) {
            alert('Array is empty.');
            return;
        }
        setSteps(bubbleSortSteps(currentArray));
        setIsSorting(true);
        setCurrentStep(0);
    };

    useEffect(() => {
        if (!isSorting || currentStep >= steps.length) return;

        const step = steps[currentStep];
        if (step.type === 'compare') {
            highlightElements(step.indices, 'compare');
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
        const elements = document.querySelectorAll('.array-element');
        elements.forEach((el, idx) => {
            if (indices.includes(idx)) {
                el.classList.add(className);
            } else {
                el.classList.remove('compare');
            }
        });
    };

    const swapElements = (indices, newArray) => {
        const elements = document.querySelectorAll('.array-element');
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
        const elements = document.querySelectorAll('.array-element');
        const element = elements[index];
        element.classList.add('sorted');
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

export default BubbleSortAnimation;
