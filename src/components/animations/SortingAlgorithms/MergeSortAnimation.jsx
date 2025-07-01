import { useEffect, useState, useRef } from 'react';
import { gsap } from 'gsap';
import './MergeSortAnimations.css';

const MergeSortAnimation = () => {
    const [arrayInput, setArrayInput] = useState('3, 2, 5, 9, 1, 8, 4');
    const [currentArray, setCurrentArray] = useState([3, 2, 5, 9, 1, 8, 4]);
    const [steps, setSteps] = useState([]);
    const [currentStep, setCurrentStep] = useState(0);
    const [isSorting, setIsSorting] = useState(false);
    const [subArrays, setSubArrays] = useState([]);
    const [animationSpeed, setAnimationSpeed] = useState(1500);
    const [sortedArray, setSortedArray] = useState([]);
    const containerRef = useRef(null);

    const generateMergeSortSteps = (array) => {
        const steps = [];
        const auxArray = [...array];

        const finalSortedArray = [...array].sort((a, b) => a - b);
        setSortedArray(finalSortedArray);

        const mergeSortWithSteps = (arr, start, end, level) => {
            if (start >= end) return;

            const mid = Math.floor((start + end) / 2);

            steps.push({
                type: 'divide',
                start,
                mid,
                end,
                level,
                array: [...arr]
            });

            mergeSortWithSteps(arr, start, mid, level + 1);
            mergeSortWithSteps(arr, mid + 1, end, level + 1);

            steps.push({
                type: 'merge-start',
                start,
                mid,
                end,
                level,
                array: [...arr]
            });

            merge(arr, start, mid, end, steps, level);

            steps.push({
                type: 'merge-complete',
                start,
                mid,
                end,
                level,
                array: [...arr]
            });
        };

        const merge = (arr, start, mid, end, steps, level) => {
            const leftSize = mid - start + 1;
            const rightSize = end - mid;

            const leftArray = [];
            const rightArray = [];

            for (let i = 0; i < leftSize; i++) {
                leftArray[i] = arr[start + i];
            }
            for (let j = 0; j < rightSize; j++) {
                rightArray[j] = arr[mid + 1 + j];
            }

            steps.push({
                type: 'merge-subarrays',
                leftArray,
                rightArray,
                start,
                mid,
                end,
                level,
                array: [...arr]
            });

            let i = 0;
            let j = 0;
            let k = start;

            while (i < leftSize && j < rightSize) {
                steps.push({
                    type: 'compare',
                    indices: [start + i, mid + 1 + j],
                    start,
                    mid,
                    end,
                    level,
                    array: [...arr]
                });

                if (leftArray[i] <= rightArray[j]) {
                    arr[k] = leftArray[i];
                    steps.push({
                        type: 'place',
                        sourceIndex: start + i,
                        targetIndex: k,
                        value: leftArray[i],
                        start,
                        mid,
                        end,
                        level,
                        array: [...arr]
                    });
                    i++;
                } else {
                    arr[k] = rightArray[j];
                    steps.push({
                        type: 'place',
                        sourceIndex: mid + 1 + j,
                        targetIndex: k,
                        value: rightArray[j],
                        start,
                        mid,
                        end,
                        level,
                        array: [...arr]
                    });
                    j++;
                }
                k++;
            }

            while (i < leftSize) {
                arr[k] = leftArray[i];
                steps.push({
                    type: 'place',
                    sourceIndex: start + i,
                    targetIndex: k,
                    value: leftArray[i],
                    start,
                    mid,
                    end,
                    level,
                    array: [...arr]
                });
                i++;
                k++;
            }

            while (j < rightSize) {
                arr[k] = rightArray[j];
                steps.push({
                    type: 'place',
                    sourceIndex: mid + 1 + j,
                    targetIndex: k,
                    value: rightArray[j],
                    start,
                    mid,
                    end,
                    level,
                    array: [...arr]
                });
                j++;
                k++;
            }
        };

        mergeSortWithSteps(auxArray, 0, auxArray.length - 1, 0);

        steps.push({
            type: 'final',
            array: [...auxArray]
        });

        return steps;
    };

    const handleArrayChange = () => {
        try {
            const parsedArray = arrayInput
                .split(',')
                .map((num) => parseInt(num.trim(), 10))
                .filter((num) => !isNaN(num));

            if (parsedArray.length === 0) {
                alert('Please enter at least one number.');
                return;
            }

            setCurrentArray(parsedArray);
            setSortedArray([...parsedArray].sort((a, b) => a - b));
            setSteps([]);
            setCurrentStep(0);
            setIsSorting(false);
            setSubArrays([]);

            resetVisualState();
        } catch {
            alert('Invalid input. Please provide a comma-separated list of numbers.');
        }
    };

    const startSorting = () => {
        if (currentArray.length === 0) {
            alert('Array is empty.');
            return;
        }

        resetVisualState();

        const steps = generateMergeSortSteps(currentArray);
        setSteps(steps);
        setIsSorting(true);
        setCurrentStep(0);
    };

    const resetVisualState = () => {
        const elements = document.querySelectorAll('.merge-array-element');
        elements.forEach(el => {
            el.classList.remove('merge-compare', 'merge-sorted', 'merge-active', 'merge-left', 'merge-right');
        });

        setSubArrays([]);
    };

    useEffect(() => {
        if (!isSorting || currentStep >= steps.length) {
            if (currentStep >= steps.length && steps.length > 0) {
                markFinalPositions();
                setIsSorting(false);
            }
            return;
        }

        const step = steps[currentStep];
        performAnimationStep(step);

        const timeout = setTimeout(() => {
            setCurrentStep((prev) => prev + 1);
        }, animationSpeed);

        return () => clearTimeout(timeout);
    }, [isSorting, currentStep, steps, animationSpeed]);

    const markFinalPositions = () => {
        const elements = document.querySelectorAll('.merge-array-element');
        elements.forEach((el, index) => {
            el.classList.remove('merge-sorted');

            if (currentArray[index] === sortedArray[index]) {
                el.classList.add('merge-sorted');
            }
        });
    };

    const performAnimationStep = (step) => {
        const elements = document.querySelectorAll('.merge-array-element');

        elements.forEach(el => {
            el.classList.remove('merge-compare', 'merge-active', 'merge-left', 'merge-right', 'merge-sorted');
        });

        if (step.type === 'divide') {
            handleDivideStep(step);
        } else if (step.type === 'merge-start' || step.type === 'merge-subarrays') {
            handleMergeStep(step);
        } else if (step.type === 'compare') {
            handleCompareStep(step, elements);
        } else if (step.type === 'place') {
            handlePlaceStep(step, elements);
        } else if (step.type === 'merge-complete') {
            handleMergeCompleteStep(step, elements);
        } else if (step.type === 'final') {
            handleFinalStep();
        }
    };

    const handleDivideStep = (step) => {
        const newSubArray = {
            start: step.start,
            end: step.end,
            level: step.level,
            isDivide: true
        };

        setSubArrays(prev => [...prev, newSubArray]);

        const elements = document.querySelectorAll('.merge-array-element');
        for (let i = step.start; i <= step.end; i++) {
            elements[i].classList.add('merge-active');

            gsap.to(elements[i], {
                y: -20 * (step.level + 1),
                duration: 0.5
            });
        }
    };

    const handleMergeStep = (step) => {
        const elements = document.querySelectorAll('.merge-array-element');
        for (let i = step.start; i <= step.mid; i++) {
            elements[i].classList.add('merge-left');
        }
        for (let i = step.mid + 1; i <= step.end; i++) {
            elements[i].classList.add('merge-right');
        }

        if (step.type === 'merge-subarrays') {
            setSubArrays(prev => [
                ...prev,
                {
                    start: step.start,
                    end: step.end,
                    level: step.level,
                    isMerging: true
                }
            ]);
        }
    };

    const handleCompareStep = (step, elements) => {
        step.indices.forEach(index => {
            elements[index].classList.add('merge-compare');
        });
    };

    const handlePlaceStep = (step, elements) => {
        const {targetIndex, value} = step;

        setCurrentArray(prev => {
            const newArray = [...prev];
            newArray[targetIndex] = value;
            return newArray;
        });

        gsap.to(elements[targetIndex], {
            scale: 1.2,
            backgroundColor: 'purple',
            duration: 0.3,
            onComplete: () => {
                gsap.to(elements[targetIndex], {
                    scale: 1,
                    backgroundColor: '#6200ea',
                    duration: 0.3,
                    onComplete: () => {
                        if (value === sortedArray[targetIndex]) {
                            elements[targetIndex].classList.add('merge-sorted');
                        }
                    }
                });
            }
        });
    };

    const handleMergeCompleteStep = (step, elements) => {
        for (let i = step.start; i <= step.end; i++) {
            elements[i].classList.add('merge-active');

            if (currentArray[i] === sortedArray[i]) {
                elements[i].classList.add('merge-sorted');
            }
        }

        for (let i = step.start; i <= step.end; i++) {
            gsap.to(elements[i], {
                y: -20 * (step.level),
                duration: 0.5
            });
        }

        setSubArrays(prev =>
            prev.filter(sub =>
                !(sub.start === step.start && sub.end === step.end && sub.level === step.level)
            )
        );
    };

    const handleFinalStep = () => {
        markFinalPositions();

        const elements = document.querySelectorAll('.merge-array-element');
        elements.forEach(el => {
            gsap.to(el, {
                y: 0,
                duration: 0.5
            });
        });

        setSubArrays([]);
    };

    const isInFinalPosition = (index, array) => {
        return array[index] === sortedArray[index];
    };

    return (
        <div className="merge-sort-container">
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
                <p>This animation demonstrates the merge sort algorithm in action. Merge sort is a divide-and-conquer algorithm that divides the array into halves, sorts each half recursively, and then merges them back together.</p>
                <p><strong>How the algorithm works:</strong></p>
                <ol style={{textAlign: "left"}}>
                    <li>Divide the array into two halves until we have subarrays of size 1 (an array of size 1 is already sorted)</li>
                    <li>Merge adjacent subarrays to form sorted subarrays</li>
                    <li>Continue merging until we have one sorted array</li>
                </ol>
                <p><strong>The merge process:</strong></p>
                <ol style={{textAlign: "left"}}>
                    <li>Compare the first elements of both subarrays</li>
                    <li>Take the smaller element and put it in the result array</li>
                    <li>Move to the next element in the subarray from which we took an element</li>
                    <li>Repeat until we've processed all elements</li>
                </ol>
                <p><strong>Time Complexity:</strong> O(n log n) - This makes merge sort more efficient than bubble sort and insertion sort for large arrays</p>
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
                            backgroundColor: "blue",
                            borderRadius: "3px"
                        }}></div>
                        <span>Left subarray</span>
                    </div>
                    <div style={{display: "flex", alignItems: "center", gap: "5px"}}>
                        <div style={{
                            width: "20px",
                            height: "20px",
                            backgroundColor: "orange",
                            borderRadius: "3px"
                        }}></div>
                        <span>Right subarray</span>
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
                        <span>Element in final sorted position</span>
                    </div>
                    <div style={{display: "flex", alignItems: "center", gap: "5px"}}>
                        <div style={{
                            width: "20px",
                            height: "20px",
                            backgroundColor: "rgba(0, 0, 255, 0.1)",
                            border: "2px solid rgba(0, 0, 255, 0.5)",
                            borderRadius: "3px"
                        }}></div>
                        <span>Divided subarray</span>
                    </div>
                    <div style={{display: "flex", alignItems: "center", gap: "5px"}}>
                        <div style={{
                            width: "20px",
                            height: "20px",
                            backgroundColor: "rgba(255, 165, 0, 0.1)",
                            border: "2px solid rgba(255, 165, 0, 0.5)",
                            borderRadius: "3px"
                        }}></div>
                        <span>Merging subarray</span>
                    </div>
                </div>
            </div>

            <div className="merge-controls">
                <div className="merge-input-container">
                    <input
                        type="text"
                        value={arrayInput}
                        onChange={(e) => setArrayInput(e.target.value)}
                        placeholder="Enter comma-separated numbers"
                        className="merge-input"
                    />
                    <button
                        onClick={handleArrayChange}
                        className="merge-button"
                    >
                        Set Array
                    </button>
                </div>

                <div className="merge-speed-control">
                    <label>Animation Speed: </label>
                    <select
                        value={animationSpeed}
                        onChange={(e) => setAnimationSpeed(parseInt(e.target.value))}
                        className="merge-speed-select"
                    >
                        <option value={500}>Fast (0.5s)</option>
                        <option value={1000}>Medium (1s)</option>
                        <option value={1500}>Slow (1.5s)</option>
                        <option value={2000}>Very Slow (2s)</option>
                    </select>
                </div>

                <div className="merge-array-container" ref={containerRef}>
                    {subArrays.map((subArray, idx) => (
                        <div
                            key={`subarray-${idx}`}
                            className={`merge-subarray ${subArray.isMerging ? 'merge-subarray-merging' : 'merge-subarray-dividing'}`}
                            style={{
                                left: `${subArray.start * 60}px`,
                                width: `${(subArray.end - subArray.start + 1) * 60 - 10}px`,
                                top: `${subArray.isMerging ? -50 : -30}px`,
                                height: `${subArray.isMerging ? '30px' : '10px'}`
                            }}
                        ></div>
                    ))}

                    {currentArray.map((value, index) => (
                        <div
                            key={index}
                            className={`merge-array-element ${
                                isInFinalPosition(index, currentArray) && !isSorting ? 'merge-sorted' : ''
                            }`}
                            data-value={value}
                            data-index={index}
                        >
                            {value}
                        </div>
                    ))}
                </div>

                <div className="merge-button-container">
                    <button
                        onClick={startSorting}
                        className="merge-button"
                        disabled={isSorting}
                    >
                        Start Sorting
                    </button>
                </div>

                {isSorting && steps[currentStep] && (
                    <div className="merge-step-indicator">
                        <p>Step {currentStep + 1} of {steps.length}:
                            {steps[currentStep].type === 'divide' && ' Dividing array'}
                            {steps[currentStep].type === 'merge-start' && ' Starting to merge subarrays'}
                            {steps[currentStep].type === 'merge-subarrays' && ' Preparing to merge two subarrays'}
                            {steps[currentStep].type === 'compare' && ' Comparing elements'}
                            {steps[currentStep].type === 'place' && ' Placing element in correct position'}
                            {steps[currentStep].type === 'merge-complete' && ' Completed merging subarray'}
                            {steps[currentStep].type === 'final' && ' Sorting complete!'}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MergeSortAnimation;