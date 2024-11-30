import { useEffect, useState } from 'react';
import { gsap } from 'gsap';
import './BubbleSortAnimation.css';

// Bubble Sort algoritmus lépésekkel
const bubbleSort = (array) => {
    const arr = [...array];
    const steps = [];
    let swapped;

    do {
        swapped = false;
        for (let i = 0; i < arr.length - 1; i++) {
            if (arr[i] > arr[i + 1]) {
                [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]]; // Csere
                swapped = true;
                steps.push([...arr, { index: i + 1 }]); // Lépés hozzáadása
            }
        }
    } while (swapped);

    return steps;
};

const BubbleSortAnimation = () => {
    const [inputArray, setInputArray] = useState(""); // Kezdeti üres input mező
    const [currentArray, setCurrentArray] = useState([5, 3, 8, 4, 2]); // Kezdő tömb
    const [isSorting, setIsSorting] = useState(false);
    const [steps, setSteps] = useState([]);
    const [currentStep, setCurrentStep] = useState(0);

    // A tömb formázása és beállítása
    const handleInputChange = (e) => {
        const value = e.target.value;
        setInputArray(value);
    };

    // A rendezés indítása
    const startSorting = () => {
        const array = inputArray.split(",").map(item => parseInt(item.trim())).filter(num => !isNaN(num));
        if (array.length === 0) {
            alert("Please enter a valid array.");
            return;
        }
        setCurrentArray(array); // Frissítjük a tömböt
        setIsSorting(true); // Rendezés indítása
        const newSteps = bubbleSort(array); // Bubble sort lépések generálása
        setSteps(newSteps); // Lépések mentése
        setCurrentStep(0);  // Indítsa újra a lépések számát
    };

    useEffect(() => {
        if (!isSorting || currentStep >= steps.length) return;

        // Jelenlegi lépés animálása
        const step = steps[currentStep];
        setCurrentArray(step.filter((_, i) => i < step.length - 1)); // Frissítse a tömböt
        highlightElement(step[step.length - 1]?.index); // Kiemelés

        const timeout = setTimeout(() => {
            setCurrentStep(currentStep + 1); // Következő lépés
        }, 2500); // Időzítés

        return () => clearTimeout(timeout); // Tisztítás
    }, [isSorting, currentStep, steps]);

    // Kiemeled az aktuális indexű elemet
    const highlightElement = (index) => {
        const elements = document.querySelectorAll('.array-element');
        elements.forEach((element, i) => {
            if (i === index) {
                gsap.to(element, {
                    scale: 1.2, // Nagyítás
                    duration: 0.5,
                    backgroundColor: '#d1ce0f', // Kiemelés színe
                });
            } else {
                gsap.to(element, {
                    scale: 1, // Alap méret
                    backgroundColor: '#6200ea', // Alap szín
                    duration: 0.5,
                });
            }
        });
    };

    return (
        <div>
            <div>
                <label htmlFor="array-input">Enter an array (comma separated): </label>
                <input
                    id="array-input"
                    type="text"
                    value={inputArray}
                    onChange={handleInputChange}
                    placeholder="e.g. 5, 3, 8, 4, 2"
                    style={{
                        padding: '10px',
                        fontSize: '16px',
                        margin: '10px 0',
                        width: '300px',
                        borderRadius: '4px',
                        border: '1px solid #ccc',
                    }}
                />
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
