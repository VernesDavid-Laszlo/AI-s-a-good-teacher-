import { useState } from "react";
import { gsap } from "gsap";

const IntervalSearchPractice = () => {
    const initialArray = [1, 3, 5, 7, 9, 11, 13, 15, 17, 23, 45, 53, 59, 61, 78, 81, 90, 98];
    const [array] = useState(initialArray);
    const [target, setTarget] = useState(78);
    const [message, setMessage] = useState("Select the estimated index for the next search step.");
    const [low, setLow] = useState(0);
    const [high, setHigh] = useState(array.length - 1);
    const [currentIndex, setCurrentIndex] = useState(null);

    const resetGame = (customMessage = "Search restarted. Try again!") => {
        setLow(0);
        setHigh(array.length - 1);
        setCurrentIndex(null);
        setMessage(customMessage);
        gsap.to(".box", { backgroundColor: "#6200ea", opacity: 1, duration: 0.5 });
    };

    const calculateIndex = () => {
        if (low === high) return low;
        return low + Math.floor(((target - array[low]) * (high - low)) / (array[high] - array[low]));
    };

    const handleIndexSelection = (index) => {
        const expectedIndex = calculateIndex();
        if (index !== expectedIndex) {
            resetGame(`Incorrect! The correct index was ${expectedIndex}. Try again ❌`);
            return;
        }
        setCurrentIndex(index);
        gsap.to(`#box-${index}`, { backgroundColor: "yellow", duration: 0.5 });

        if (array[index] === target) {
            setMessage(`Correct! ${target} found at index ${index}! 🎉✅`);
            gsap.to(`#box-${index}`, { backgroundColor: "green", duration: 0.5 });
            return;
        }

        setMessage(`Pivot: ${array[index]}. Should we go left or right?`);
    };

    const handleDirectionSelection = (direction) => {
        if (currentIndex === null) {
            resetGame("You must select an index first! ❌");
            return;
        }

        const mid = currentIndex;
        if (array[mid] === target) {
            setMessage(`Correct! ${target} found at index ${mid}! 🎉✅`);
            gsap.to(`#box-${mid}`, { backgroundColor: "green", duration: 0.5 });
            return;
        }

        if ((direction === "left" && array[mid] < target) || (direction === "right" && array[mid] > target)) {
            resetGame("Incorrect! Wrong direction chosen. Search restarted ❌");
            return;
        }

        gsap.to(`#box-${mid}`, { backgroundColor: "red", duration: 0.5 });
        if (direction === "left") {
            setHigh(mid - 1);
        } else {
            setLow(mid + 1);
        }
        setMessage("✅ Correct move! Now select the new index.");
    };

    return (
        <div style={{ textAlign: "center", padding: "20px" }}>
            <h3>Interpolation Search Practice</h3>
            <p>Estimate the correct index using the formula and click it.</p>
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
                        id={`box-${index}`}
                        className="box"
                        onClick={() => handleIndexSelection(index)}
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
                            opacity: index >= low && index <= high ? 1 : 0.3,
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

export default IntervalSearchPractice;