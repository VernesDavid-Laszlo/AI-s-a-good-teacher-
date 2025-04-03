import { useEffect, useState } from 'react';
import { gsap } from 'gsap';
import './QuickSortAnimation.css';

const quickSortSteps = (array) => {
    const arr = [...array];
    const steps = [];

    const quickSortHelper = (low, high) => {
        if (low < high) {
            const pivotIndex = partition(arr, low, high);
            steps.push({ type: 'partition', low, high, pivotIndex, array: [...arr] });
            quickSortHelper(low, pivotIndex - 1);
            quickSortHelper(pivotIndex + 1, high);
        }
    };

    const partition = (arr, low, high) => {
        const pivot = arr[high];
        let i = low - 1;
        for (let j = low; j < high; j++) {
            if (arr[j] <= pivot) {
                i++;
                [arr[i], arr[j]] = [arr[j], arr[i]];
                steps.push({ type: 'swap', indices: [i, j], array: [...arr] });
            }
        }
        [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
        steps.push({ type: 'swap', indices: [i + 1, high], array: [...arr] });
        return i + 1;
    };

    quickSortHelper(0, arr.length - 1);
    return steps;
};

const QuickSortAnimation = () => {
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
        setSteps(quickSortSteps(currentArray));
        setIsSorting(true);
        setCurrentStep(0);
    };

    useEffect(() => {
        if (!isSorting || currentStep >= steps.length) return;

        const step = steps[currentStep];
        if (step.type === 'swap') {
            swapElements(step.indices, step.array);
        } else if (step.type === 'partition') {
            partitionElements(step.low, step.high, step.pivotIndex);
        }

        const timeout = setTimeout(() => {
            setCurrentStep((prev) => prev + 1);
        }, 1500); // Lassúbb lépésenkénti animáció

        return () => clearTimeout(timeout);
    }, [isSorting, currentStep, steps]);

    const swapElements = (indices, newArray) => {
        const elements = document.querySelectorAll('.array-elementQ');
        const [firstIdx, secondIdx] = indices;

        // Felemelt elemek animációja
        const firstElement = elements[firstIdx];
        const secondElement = elements[secondIdx];

        gsap.to(firstElement, { y: -50, duration: 0.7 });
        gsap.to(secondElement, { y: -50, duration: 0.7 });

        // Helycsere animációja
        setTimeout(() => {
            setCurrentArray(newArray);
            gsap.to(firstElement, { y: 0, duration: 0.7 });
            gsap.to(secondElement, { y: 0, duration: 0.7 });
        }, 700);
    };

    const partitionElements = (low, high, pivotIndex) => {
        const elements = document.querySelectorAll('.array-elementQ');
        const pivotElement = elements[pivotIndex];

        // Kiemeljük a pivotot
        gsap.to(pivotElement, { backgroundColor: '#ff9800', scale: 1.2, duration: 0.7 });

        // Elválasztjuk a tömböt balra és jobbra
        for (let i = low; i <= high; i++) {
            gsap.to(elements[i], { backgroundColor: '#03a9f4', duration: 0.7 });
        }

        // Amikor a pivot véglegesen a helyére kerül, azonnal zöldre vált
        setTimeout(() => {
            gsap.to(pivotElement, { backgroundColor: '#4caf50', duration: 0.7 }); // Pivot végleges zöld szín
        }, 700);

        // A tömb két részét az animáció során nyomon követjük
        setTimeout(() => {
            gsap.to(elements.slice(low, pivotIndex), { backgroundColor: '#8bc34a', duration: 0.7 }); // Bal rész zöld
            gsap.to(elements.slice(pivotIndex + 1, high), { backgroundColor: '#8bc34a', duration: 0.7 }); // Jobb rész zöld
        }, 1500); // Késleltetés a zöldre váltás előtt
    };

    useEffect(() => {
        if (isSorting && currentStep === steps.length) {
            // Az összes elem zöldre váltása, amikor vége a rendezésnek
            const elements = document.querySelectorAll('.array-elementQ');
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
            <div className="array-containerQ">
                {currentArray.map((value, index) => (
                    <div key={index} className="array-elementQ">
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

export default QuickSortAnimation;