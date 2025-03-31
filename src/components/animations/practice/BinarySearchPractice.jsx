import { useState } from "react";
import { gsap } from "gsap";

const BinarySearchPractice = () => {
    const initialArray = [1, 3, 5, 7, 9, 11, 13, 15, 17, 23, 45, 53, 59, 61, 78, 81, 90, 98];
    const [array, setArray] = useState(initialArray);
    const [target, setTarget] = useState(78);
    const [message, setMessage] = useState("Select the pivot element to start");
    const [left, setLeft] = useState(0);
    const [right, setRight] = useState(initialArray.length - 1);
    const [step, setStep] = useState(null);

    const resetGame = (customMessage = "Search restarted. Select the pivot element to start.") => {
        setLeft(0);
        setRight(initialArray.length - 1);
        setMessage(<b>{customMessage}</b>);
        setStep(null);
        gsap.to(".bar", { backgroundColor: "#6200ea", opacity: 1, duration: 0.5 });
    };

    const handlePivotSelection = (index) => {
        if (index < left || index > right) {
            resetGame("Incorrect! The selected element is out of bounds. Search restarted. Select the pivot element to start ❌");
            return;
        }

        const mid = Math.floor((left + right) / 2);
        if (index !== mid) {
            resetGame(`Incorrect! You should have chosen index ${mid}. Search restarted. Select the pivot element to start ❌`);
            return;
        }

        if (array[mid] === target) {
            setMessage(<b>{`Correct! ${target} found at index ${mid}! 🎉✅`}</b>);
            gsap.to(`#bar-${mid}`, { backgroundColor: "green", duration: 0.5 });
            return;
        }

        gsap.to(`#bar-${mid}`, { backgroundColor: "yellow", duration: 0.5 });
        setMessage(<b>{`Pivot selected: ${array[mid]}. Is the target to the left or right? ✅`}</b>);
        setStep(mid);
    };

    const handleDirectionSelection = (direction) => {
        if (step === null) {
            resetGame("You must select a pivot first! Search restarted. Select the pivot element to start ❌");
            return;
        }

        const mid = step;
        if (array[mid] === target) {
            setMessage(<b>{`Correct! ${target} found at index ${mid}! 🎉✅`}</b>);
            gsap.to(`#bar-${mid}`, { backgroundColor: "green", duration: 0.5 });
            return;
        }

        if ((direction === "left" && array[mid] < target) || (direction === "right" && array[mid] > target)) {
            resetGame("Incorrect! Wrong direction chosen. Search restarted. Select the pivot element to start ❌");
            return;
        }

        gsap.to(`#bar-${mid}`, { backgroundColor: "red", duration: 0.5 });

        if (direction === "left") {
            setRight(mid - 1);
            gsap.to(`.bar`, { opacity: (i) => (i > mid ? 0.3 : 1), duration: 0.5 });
        } else {
            setLeft(mid + 1);
            gsap.to(`.bar`, { opacity: (i) => (i < mid ? 0.3 : 1), duration: 0.5 });
        }

        setMessage(<b>{"✅ Correct move! Now select the new pivot."}</b>);
    };

    return (
        <div style={{ textAlign: "center", padding: "20px" }}>
            <input
                type="number"
                value={target || ""}
                onChange={(e) => {
                    const value = e.target.value;
                    setTarget(value === "" ? "" : Number(value));
                }}
                placeholder="Enter number"
            />
            <button onClick={() => resetGame()}>Reset</button>
            <p style={{ fontWeight: "bold" }}>{message}</p>
            <div style={{ display: "flex", justifyContent: "center", gap: "10px" }}>
                {array.map((num, index) => (
                    <div
                        key={index}
                        id={`bar-${index}`}
                        className="bar"
                        onClick={() => handlePivotSelection(index)}
                        style={{
                            width: "50px",
                            height: "50px",
                            backgroundColor: "#6200ea",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "white",
                            fontSize: "20px",
                            cursor: "pointer",
                            opacity: index >= left && index <= right ? 1 : 0.3,
                        }}
                    >
                        {num}
                    </div>
                ))}
            </div>
            <div style={{ marginTop: "20px" }}>
                <button onClick={() => handleDirectionSelection("left")} style={{ marginRight: "10px" }}>Left</button>
                <button onClick={() => handleDirectionSelection("right")}>Right</button>
            </div>
        </div>
    );
};

export default BinarySearchPractice;