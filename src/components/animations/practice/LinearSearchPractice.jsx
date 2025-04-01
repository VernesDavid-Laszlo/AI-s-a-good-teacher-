import React, { useState } from "react";
import { gsap } from "gsap";

const LinearSearchPractice = () => {
    const [array] = useState([5, 12, 8, 19, 3, 7, 25]);
    const [target, setTarget] = useState(7);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [message, setMessage] = useState("Select the first element to start.");
    const [isAnimating, setIsAnimating] = useState(false);

    const resetGame = () => {
        setCurrentIndex(0);
        setMessage(" Incorrect! ❌ Search restarted. Select the first element to start.");
        setIsAnimating(false);
        gsap.to(".box", { backgroundColor: "#6200ea", duration: 0.5 });
    };

    const handleSelection = (index) => {
        if (isAnimating || index !== currentIndex) {
            setMessage("Incorrect! ❌ Search restarted. Select the first element.");
            resetGame();
            return;
        }

        setIsAnimating(true);
        gsap.to(`#box-${index}`, { backgroundColor: "yellow", duration: 0.5 });

        setTimeout(() => {
            if (array[index] === target) {
                setMessage(`Correct! ${target} found! ✅`);
                gsap.to(`#box-${index}`, { backgroundColor: "green", duration: 0.5 });
            } else {
                setMessage("Correct! ✅ Continue to the next element.");
                gsap.to(`#box-${index}`, { backgroundColor: "red", duration: 0.5 });
                setCurrentIndex(index + 1);
            }
            setIsAnimating(false);
        }, 800);
    };

    return (
        <div style={{ textAlign: "center", padding: "20px" }}>
            <h2>Linear Search Practice</h2>
            <input
                type="number"
                value={target || ""}
                onChange={(e) => !isAnimating && setTarget(Number(e.target.value) || "")}
                placeholder="Enter number"
                disabled={isAnimating}
            />
            <button onClick={resetGame} disabled={isAnimating}>Reset</button>
            <p>{message}</p>
            <div style={{ display: "flex", justifyContent: "center", gap: "10px" }}>
                {array.map((num, index) => (
                    <div
                        key={index}
                        id={`box-${index}`}
                        className="box"
                        onClick={() => handleSelection(index)}
                        style={{
                            width: "40px",
                            height: "40px",
                            backgroundColor: "#6200ea",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "white",
                            fontSize: "20px",
                            cursor: "pointer",
                        }}
                    >
                        {num}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default LinearSearchPractice;
