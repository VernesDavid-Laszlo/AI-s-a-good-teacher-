import { useEffect, useState } from 'react';
import { gsap } from 'gsap';
import './SortAnimations.css';

// Merge Sort lépéseit generáló algoritmus
const mergeSortSteps = (array) => {
    const steps = [];
    const mergeSortHelper = (arr, start, end) => {
        if (start >= end) return;
        const mid = Math.floor((start + end) / 2);

        mergeSortHelper(arr, start, mid);
        mergeSortHelper(arr, mid + 1, end);

        // A két rész egyesítése
        merge(arr, start, mid, end);
    };

    const merge = (arr, start, mid, end) => {
        const left = arr.slice(start, mid + 1);
        const right = arr.slice(mid + 1, end + 1);
        let leftIdx = 0, rightIdx = 0, mergedIdx = start;

        steps.push({ type: 'split', left, right, start, end }); // Az osztás vizualizálása

        while (leftIdx < left.length && rightIdx < right.length) {
            if (left[leftIdx] <= right[rightIdx]) {
                arr[mergedIdx++] = left[leftIdx++];
            } else {
                arr[mergedIdx++] = right[rightIdx++];
            }
        }

        // Ha maradtak elemek
        while (leftIdx < left.length) arr[mergedIdx++] = left[leftIdx++];
        while (rightIdx < right.length) arr[mergedIdx++] = right[rightIdx++];

        steps.push({ type: 'merge', array: [...arr], start, end });
    };

    mergeSortHelper(array, 0, array.length - 1);
    return steps;
};

const MergeSortAnimation = () => {
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
        setSteps(mergeSortSteps(currentArray));
        setIsSorting(true);
        setCurrentStep(0);
    };

    useEffect(() => {
        if (!isSorting || currentStep >= steps.length) return;

        const step = steps[currentStep];
        if (step.type === 'split') {
            highlightSplit(step.left, step.right, step.start, step.end);
        } else if (step.type === 'merge') {
            mergeElements(step.array, step.start, step.end);
        }

        const timeout = setTimeout(() => {
            setCurrentStep((prev) => prev + 1);
        }, 1000); // Minden lépés 1 másodpercig tart

        return () => clearTimeout(timeout);
    }, [isSorting, currentStep, steps]);

    const highlightSplit = (left, right, start, end) => {
        const elements = document.querySelectorAll('.array-element');

        // Kiemeljük a szétválasztott tömböket és közéjük helyet adunk
        elements.forEach((el, idx) => {
            if (idx >= start && idx <= end) {
                if (left.includes(el.innerText)) {
                    gsap.to(el, { backgroundColor: '#ffeb3b', marginRight: '20px', duration: 0.7 }); // Távolság hozzáadása
                } else if (right.includes(el.innerText)) {
                    gsap.to(el, { backgroundColor: '#03a9f4', marginRight: '20px', duration: 0.7 });
                }
            }
        });

        // Elemek szétválasztása vizuálisan is
        gsap.to('.array-container', { paddingLeft: '30px', duration: 0.7 });
    };

    const mergeElements = (newArray, start, end) => {
        const elements = document.querySelectorAll('.array-element');

        // Animáljuk az elemeket a rendezés közben
        for (let i = start; i <= end; i++) {
            const element = elements[i];
            gsap.to(element, { y: -50, duration: 0.5 });
        }

        setTimeout(() => {
            setCurrentArray(newArray);
            for (let i = start; i <= end; i++) {
                const element = elements[i];
                gsap.to(element, { y: 0, duration: 0.5 });
            }

            // Ha egy elem a végső helyére került, azonnal zöldre vált
            const finalSortedElement = elements[end];
            gsap.to(finalSortedElement, { backgroundColor: '#4caf50', duration: 0.7 });
        }, 500);
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

export default MergeSortAnimation;
