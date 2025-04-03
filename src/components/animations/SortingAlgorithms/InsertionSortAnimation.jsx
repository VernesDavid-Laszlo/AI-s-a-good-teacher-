import { useEffect, useState } from "react";
import { gsap } from "gsap";
import "./InsertionSortAnimation.css"; // Módosított CSS import

// Improved Insertion Sort algorithm steps generation
const insertionSortSteps = (array) => {
    const arr = [...array];
    const steps = [];

    // Mark first element as initially sorted
    steps.push({ type: "markSorted", index: 0 });

    for (let i = 1; i < arr.length; i++) {
        const current = arr[i];
        let j = i - 1;

        // Highlight the current element we're inserting
        steps.push({ type: "highlight", index: i });

        // Make a copy of the array before modifications
        const initialArrayState = [...arr];

        // Find the correct position while shifting elements
        while (j >= 0 && arr[j] > current) {
            // Compare elements
            steps.push({ type: "compare", indices: [j, j + 1] });

            // Shift element right
            arr[j + 1] = arr[j];
            steps.push({
                type: "shift",
                fromIndex: j,
                toIndex: j + 1,
                array: [...arr],
                current: current
            });

            j--;
        }

        // If no shifting occurred, still compare
        if (j === i - 1) {
            steps.push({ type: "compare", indices: [j, j + 1] });
        }

        // Insert the current element at its correct position
        arr[j + 1] = current;

        // Add step to show insertion
        steps.push({
            type: "insert",
            index: j + 1,
            value: current,
            array: [...arr]
        });

        // Mark this position as sorted
        steps.push({ type: "markSorted", index: j + 1 });
    }

    // Mark all elements as sorted when complete
    steps.push({ type: "complete" });
    return steps;
};

// Component for running the animations
const InsertionSortAnimation = () => {
    const [arrayInput, setArrayInput] = useState("3, 2, 5, 9, 1, 8, 4");
    const [currentArray, setCurrentArray] = useState([3, 2, 5, 9, 1, 8, 4]);
    const [steps, setSteps] = useState([]);
    const [currentStep, setCurrentStep] = useState(0);
    const [isSorting, setIsSorting] = useState(false);
    const [sortedIndices, setSortedIndices] = useState([]);

    const handleArrayChange = () => {
        try {
            const parsedArray = arrayInput
                .split(",")
                .map((num) => parseInt(num.trim(), 10))
                .filter((num) => !isNaN(num));

            if (parsedArray.length === 0) {
                alert("Please enter at least one valid number.");
                return;
            }

            setCurrentArray(parsedArray);
            setSteps([]);
            setCurrentStep(0);
            setIsSorting(false);
            setSortedIndices([]);

            // Reset all elements to default style
            const elements = document.querySelectorAll(".insertion-array-element");
            elements.forEach(element => {
                gsap.to(element, {
                    backgroundColor: "#3498db",
                    scale: 1,
                    y: 0,
                    duration: 0.3
                });
            });
        } catch {
            alert("Invalid input. Please provide a comma-separated list of numbers.");
        }
    };

    const startSorting = () => {
        if (currentArray.length === 0) {
            alert("Array is empty.");
            return;
        }

        // Reset visual state
        setSortedIndices([]);

        // Reset all elements to default style
        const elements = document.querySelectorAll(".insertion-array-element");
        elements.forEach(element => {
            gsap.to(element, {
                backgroundColor: "#3498db",
                scale: 1,
                y: 0,
                duration: 0.3
            });
        });

        // Generate steps and start animation
        const generatedSteps = insertionSortSteps([...currentArray]);
        setSteps(generatedSteps);
        setIsSorting(true);
        setCurrentStep(0);
    };

    useEffect(() => {
        if (!isSorting || currentStep >= steps.length) {
            if (currentStep >= steps.length && steps.length > 0) {
                setIsSorting(false);
            }
            return;
        }

        const step = steps[currentStep];

        switch (step.type) {
            case "highlight":
                highlightElement(step.index);
                break;
            case "compare":
                compareElements(step.indices);
                break;
            case "shift":
                shiftElement(step.fromIndex, step.toIndex, step.array, step.current);
                break;
            case "insert":
                insertElement(step.index, step.value, step.array);
                break;
            case "markSorted":
                markAsSorted(step.index);
                break;
            case "complete":
                markAllAsSorted();
                break;
            default:
                break;
        }

        const timeout = setTimeout(() => {
            setCurrentStep((prev) => prev + 1);
        }, 800); // Speed adjusted for better visualization

        return () => clearTimeout(timeout);
    }, [isSorting, currentStep, steps]);

    // Highlight the current element being processed
    const highlightElement = (index) => {
        const elements = document.querySelectorAll(".insertion-array-element");
        if (elements[index]) {
            // Reset other elements that aren't sorted
            elements.forEach((el, idx) => {
                if (!sortedIndices.includes(idx) && idx !== index) {
                    gsap.to(el, {
                        backgroundColor: "#ff9800",
                        scale: 1,
                        duration: 0.3
                    });
                }
            });

            // Highlight the selected element
            gsap.to(elements[index], {
                backgroundColor: "#ff9800",
                scale: 1.1,
                y: -20,
                duration: 0.5
            });
        }
    };

    // Compare two elements
    const compareElements = (indices) => {
        const elements = document.querySelectorAll(".insertion-array-element");
        const [first, second] = indices;

        if (elements[first] && elements[second]) {
            // Highlight the comparison
            gsap.to(elements[first], {
                backgroundColor: "#e74c3c",
                duration: 0.3
            });

            if (!sortedIndices.includes(second)) {
                gsap.to(elements[second], {
                    backgroundColor: "#ff9800",
                    duration: 0.3
                });
            }
        }
    };

    // Shift elements to make room for insertion
    const shiftElement = (fromIndex, toIndex, newArray, current) => {
        setCurrentArray(newArray);

        const elements = document.querySelectorAll(".insertion-array-element");
        if (elements[fromIndex] && elements[toIndex]) {
            // Visual indication of shift
            gsap.to(elements[fromIndex], {
                x: 60,
                duration: 0.3,
                onComplete: () => {
                    gsap.to(elements[fromIndex], {
                        x: 0,
                        duration: 0.1
                    });
                }
            });
        }
    };

    // Insert element at the correct position
    const insertElement = (index, value, newArray) => {
        setCurrentArray(newArray);

        const elements = document.querySelectorAll(".insertion-array-element");
        if (elements[index]) {
            // Highlight the insertion
            gsap.to(elements[index], {
                backgroundColor: "#9b59b6",
                scale: 1.1,
                duration: 0.4,
                onComplete: () => {
                    // Reset scale but keep color if sorted
                    gsap.to(elements[index], {
                        scale: 1,
                        y: 0,
                        duration: 0.2
                    });
                }
            });
        }
    };

    // Mark an element as sorted
    const markAsSorted = (index) => {
        setSortedIndices(prev => [...prev, index]);

        const elements = document.querySelectorAll(".insertion-array-element");
        if (elements[index]) {
            gsap.to(elements[index], {
                backgroundColor: "#4caf50",
                duration: 0.5
            });
        }
    };

    // Mark all elements as sorted
    const markAllAsSorted = () => {
        const elements = document.querySelectorAll(".insertion-array-element");
        elements.forEach((element) => {
            gsap.to(element, {
                backgroundColor: "#4caf50",
                scale: 1,
                y: 0,
                duration: 0.5
            });
        });

        setSortedIndices([...Array(currentArray.length).keys()]);
    };

    return (
        <div className="insertion-sort-container">
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
            <br/>
            <div className="insertion-array-container">
                {currentArray.map((value, index) => (
                    <div
                        key={index}
                        className="insertion-array-element"
                        style={{
                            backgroundColor: sortedIndices.includes(index) ? "#4caf50" : "#3498db"
                        }}
                    >
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
                disabled={isSorting}
            >
                Start Sorting
            </button>
        </div>
    );
};

export default InsertionSortAnimation;