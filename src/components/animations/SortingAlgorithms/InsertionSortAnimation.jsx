import { useEffect, useState } from "react";
import { gsap } from "gsap";
import "./SortAnimations.css";

// Insertion Sort algoritmus lépéseinek generálása
const insertionSortSteps = (array) => {
    const arr = [...array];
    const steps = [];
    for (let i = 1; i < arr.length; i++) {
        let current = arr[i];
        let j = i - 1;

        // Kiemeljük a jelenlegi elemet
        steps.push({ type: "highlight", index: i });

        while (j >= 0 && arr[j] > current) {
            // Két elem kiemelése és cseréje
            steps.push({ type: "swap", indices: [j, j + 1], array: [...arr] });
            arr[j + 1] = arr[j]; // Elem mozgatása a következő helyre
            j--;
        }

        // Az aktuális elem helyére való beillesztése
        arr[j + 1] = current;
        steps.push({ type: "insert", index: j + 1, value: current, array: [...arr] });

        // Az elem végleges helyének megjelölése
        steps.push({ type: "sorted", index: j + 1 });
    }

    // Az egész tömb zöldre váltása, amikor minden elem a helyén van
    steps.push({ type: "complete" });
    return steps;
};

// Komponens az animációk futtatásához
const InsertionSortAnimation = () => {
    const [arrayInput, setArrayInput] = useState("3, 2, 5, 9, 1, 8, 4");
    const [currentArray, setCurrentArray] = useState([3, 2, 5, 9, 1, 8, 4]);
    const [steps, setSteps] = useState([]);
    const [currentStep, setCurrentStep] = useState(0);
    const [isSorting, setIsSorting] = useState(false);

    const handleArrayChange = () => {
        try {
            const parsedArray = arrayInput
                .split(",")
                .map((num) => parseInt(num.trim(), 10))
                .filter((num) => !isNaN(num));
            setCurrentArray(parsedArray);
            setSteps([]);
            setCurrentStep(0);
            setIsSorting(false);
        } catch {
            alert("Invalid input. Please provide a comma-separated list of numbers.");
        }
    };

    const startSorting = () => {
        if (currentArray.length === 0) {
            alert("Array is empty.");
            return;
        }
        setSteps(insertionSortSteps(currentArray));
        setIsSorting(true);
        setCurrentStep(0);
    };

    useEffect(() => {
        if (!isSorting || currentStep >= steps.length) return;

        const step = steps[currentStep];
        if (step.type === "highlight") {
            highlightElement(step.index);
        } else if (step.type === "swap") {
            swapElements(step.indices, step.array);
        } else if (step.type === "insert") {
            insertElement(step.index, step.value, step.array);
        } else if (step.type === "sorted") {
            markAsSorted(step.index);
        } else if (step.type === "complete") {
            markAllAsSorted();
        }

        const timeout = setTimeout(() => {
            setCurrentStep((prev) => prev + 1);
        }, 1000); // 1 másodperc animációs lépés

        return () => clearTimeout(timeout);
    }, [isSorting, currentStep, steps]);

    // Az aktuális elem kiemelése
    const highlightElement = (index) => {
        const elements = document.querySelectorAll(".array-element");
        gsap.to(elements[index], { backgroundColor: "#ff9800", scale: 1.2, duration: 0.7 });
    };

    // Lépésről lépésre történő csere animáció
    const swapElements = (indices, newArray) => {
        const elements = document.querySelectorAll(".array-element");
        const [from, to] = indices;

        gsap.to(elements[from], { y: -60, duration: 0.5 });
        gsap.to(elements[to], { y: -60, duration: 0.5 });

        setTimeout(() => {
            setCurrentArray(newArray);
            gsap.to(elements[from], { y: 0, duration: 0.5 });
            gsap.to(elements[to], { y: 0, duration: 0.5 });
        }, 500); // 500ms várakozás az animáció befejeződése előtt
    };

    // Elem beillesztése a helyére
    const insertElement = (index, value, newArray) => {
        setCurrentArray(newArray);
    };

    // Elem végleges helyére kerülése
    const markAsSorted = (index) => {
        const elements = document.querySelectorAll(".array-element");
        gsap.to(elements[index], { backgroundColor: "#4caf50", duration: 0.7 });
    };

    // Az egész tömb zöldre váltása
    const markAllAsSorted = () => {
        const elements = document.querySelectorAll(".array-element");
        elements.forEach((element) => {
            gsap.to(element, { backgroundColor: "#4caf50", duration: 0.7 });
        });
    };

    return (
        <div>
            <div style={{ marginBottom: "20px" }}>
                <input
                    type="text"
                    value={arrayInput}
                    onChange={(e) => setArrayInput(e.target.value)}
                    placeholder="Enter comma-separated numbers"
                    style={{ padding: "10px", width: "300px", fontSize: "16px" }}
                />
                <button
                    onClick={handleArrayChange}
                    style={{
                        marginLeft: "10px",
                        padding: "10px 20px",
                        fontSize: "16px",
                        backgroundColor: "#6200ea",
                        color: "#fff",
                        border: "none",
                        cursor: "pointer",
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
                    marginTop: "20px",
                    padding: "10px 20px",
                    fontSize: "16px",
                    backgroundColor: "#6200ea",
                    color: "#fff",
                    border: "none",
                    cursor: "pointer",
                }}
            >
                Start Sorting
            </button>
        </div>
    );
};

export default InsertionSortAnimation;