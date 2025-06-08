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
    const [animationSpeed, setAnimationSpeed] = useState(1500); // 1.5 seconds per step
    const [sortedArray, setSortedArray] = useState([]);
    const containerRef = useRef(null);

    // Generate all the steps for merge sort animation
    const generateMergeSortSteps = (array) => {
        const steps = [];
        const auxArray = [...array];

        // Store the sorted array for comparing final positions
        const finalSortedArray = [...array].sort((a, b) => a - b);
        setSortedArray(finalSortedArray);

        // Function to generate steps for merge sort
        const mergeSortWithSteps = (arr, start, end, level) => {
            // Base case - array of size 1 is already sorted
            if (start >= end) return;

            // Find the middle point
            const mid = Math.floor((start + end) / 2);

            // Add step for division
            steps.push({
                type: 'divide',
                start,
                mid,
                end,
                level,
                array: [...arr]
            });

            // Recursively sort first and second halves
            mergeSortWithSteps(arr, start, mid, level + 1);
            mergeSortWithSteps(arr, mid + 1, end, level + 1);

            // Add step for merge preparation
            steps.push({
                type: 'merge-start',
                start,
                mid,
                end,
                level,
                array: [...arr]
            });

            // Merge the sorted halves
            merge(arr, start, mid, end, steps, level);

            // Add step to show result after merge
            steps.push({
                type: 'merge-complete',
                start,
                mid,
                end,
                level,
                array: [...arr]
            });
        };

        // Function to merge two subarrays
        const merge = (arr, start, mid, end, steps, level) => {
            // Create temporary arrays
            const leftSize = mid - start + 1;
            const rightSize = end - mid;

            const leftArray = [];
            const rightArray = [];

            // Copy data to temp arrays
            for (let i = 0; i < leftSize; i++) {
                leftArray[i] = arr[start + i];
            }
            for (let j = 0; j < rightSize; j++) {
                rightArray[j] = arr[mid + 1 + j];
            }

            // Add step to highlight the two arrays being merged
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

            // Merge the temp arrays back into arr[start..end]
            let i = 0;
            let j = 0;
            let k = start;

            while (i < leftSize && j < rightSize) {
                // Add step to compare elements
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
                    // Add step to place the element from left array
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
                    // Add step to place the element from right array
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

            // Copy remaining elements of leftArray, if any
            while (i < leftSize) {
                arr[k] = leftArray[i];
                // Add step to place the remaining elements from left array
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

            // Copy remaining elements of rightArray, if any
            while (j < rightSize) {
                arr[k] = rightArray[j];
                // Add step to place the remaining elements from right array
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

        // Start the merge sort process
        mergeSortWithSteps(auxArray, 0, auxArray.length - 1, 0);

        // Add final step to mark all as sorted
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
            // Set sortedArray for comparison
            setSortedArray([...parsedArray].sort((a, b) => a - b));
            setSteps([]);
            setCurrentStep(0);
            setIsSorting(false);
            setSubArrays([]);

            // Reset visual states
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

        // Reset visual states
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

        // Clear all visual indicators of subarrays
        setSubArrays([]);
    };

    useEffect(() => {
        if (!isSorting || currentStep >= steps.length) {
            if (currentStep >= steps.length && steps.length > 0) {
                // Only mark elements that are in their final sorted position
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

    // Function to mark only the elements that are in their final sorted position
    const markFinalPositions = () => {
        const elements = document.querySelectorAll('.merge-array-element');
        elements.forEach((el, index) => {
            el.classList.remove('merge-sorted');

            // Only mark as sorted if the value is in its correct final position
            if (currentArray[index] === sortedArray[index]) {
                el.classList.add('merge-sorted');
            }
        });
    };

    const performAnimationStep = (step) => {
        const elements = document.querySelectorAll('.merge-array-element');

        // Reset certain classes before applying new ones
        elements.forEach(el => {
            el.classList.remove('merge-compare', 'merge-active', 'merge-left', 'merge-right', 'merge-sorted');
        });

        if (step.type === 'divide') {
            // Update subarray visualization
            handleDivideStep(step);
        } else if (step.type === 'merge-start' || step.type === 'merge-subarrays') {
            // Highlight the subarrays being merged
            handleMergeStep(step);
        } else if (step.type === 'compare') {
            // Highlight the elements being compared
            handleCompareStep(step, elements);
        } else if (step.type === 'place') {
            // Animate placing an element
            handlePlaceStep(step, elements);
        } else if (step.type === 'merge-complete') {
            // Mark the subarray as sorted temporarily
            handleMergeCompleteStep(step, elements);
        } else if (step.type === 'final') {
            // Final state - check final positions
            handleFinalStep();
        }
    };

    const handleDivideStep = (step) => {
        // Create new subarray
        const newSubArray = {
            start: step.start,
            end: step.end,
            level: step.level,
            isDivide: true
        };

        setSubArrays(prev => [...prev, newSubArray]);

        // Animate the division
        const elements = document.querySelectorAll('.merge-array-element');
        for (let i = step.start; i <= step.end; i++) {
            elements[i].classList.add('merge-active');

            // Animate division with levitation
            gsap.to(elements[i], {
                y: -20 * (step.level + 1),
                duration: 0.5
            });
        }
    };

    const handleMergeStep = (step) => {
        // Highlight left and right subarrays
        const elements = document.querySelectorAll('.merge-array-element');
        for (let i = step.start; i <= step.mid; i++) {
            elements[i].classList.add('merge-left');
        }
        for (let i = step.mid + 1; i <= step.end; i++) {
            elements[i].classList.add('merge-right');
        }

        if (step.type === 'merge-subarrays') {
            // Update visualization to show we're merging these subarrays
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
        // Highlight elements being compared
        step.indices.forEach(index => {
            elements[index].classList.add('merge-compare');
        });
    };

    const handlePlaceStep = (step, elements) => {
        // Animate placing the element into its correct position
        const {targetIndex, value} = step;

        // Update the array
        setCurrentArray(prev => {
            const newArray = [...prev];
            newArray[targetIndex] = value;
            return newArray;
        });

        // Visual animation for placing element
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
                        // Check if this element is now in its final sorted position
                        if (value === sortedArray[targetIndex]) {
                            elements[targetIndex].classList.add('merge-sorted');
                        }
                    }
                });
            }
        });
    };

    const handleMergeCompleteStep = (step, elements) => {
        // Mark this subarray section as temporarily sorted
        for (let i = step.start; i <= step.end; i++) {
            elements[i].classList.add('merge-active');

            // Additionally, mark elements that are in their final position
            if (currentArray[i] === sortedArray[i]) {
                elements[i].classList.add('merge-sorted');
            }
        }

        // Bring elements back to their level
        for (let i = step.start; i <= step.end; i++) {
            gsap.to(elements[i], {
                y: -20 * (step.level),
                duration: 0.5
            });
        }

        // Update subarray visualization
        setSubArrays(prev =>
            prev.filter(sub =>
                !(sub.start === step.start && sub.end === step.end && sub.level === step.level)
            )
        );
    };

    const handleFinalStep = () => {
        // Mark only elements in their final sorted position
        markFinalPositions();

        const elements = document.querySelectorAll('.merge-array-element');
        // Reset position for all elements
        elements.forEach(el => {
            gsap.to(el, {
                y: 0,
                duration: 0.5
            });
        });

        // Clear all subarrays
        setSubArrays([]);
    };

    // Modified to check against the sorted array
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
                    {/* Visualize subarrays with dividers */}
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

                    {/* Render array elements */}
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

                {/* Current step indicator */}
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