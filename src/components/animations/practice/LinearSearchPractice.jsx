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
        <div style={{ textAlign: "center", padding: "20px", fontFamily: "Arial" }}>
            <div style={{
                fontSize: "16px",
                color: "#333",
                textAlign: "left",
                maxWidth: "1000px",
                margin: "0px auto",
                padding: "25px",
                backgroundColor: "#f9f9f9",
                borderRadius: "8px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
            }}>
                <p>This is an interactive practice for the linear search algorithm. In this exercise, you'll perform the linear search
                    yourself by selecting elements in the correct order.</p>
                <p><strong>Steps to follow:</strong></p>
                <ol style={{textAlign: "left"}}>
                    <li>Click on the first element (leftmost) in the array to begin</li>
                    <li>If the element matches your target value, you're done!</li>
                    <li>If not, you must continue by clicking on the next element to the right</li>
                    <li>Clicking elements out of order will reset the search</li>
                    <li>Continue until you either find the target or check all elements</li>
                </ol>
                <p><strong>Time Complexity:</strong> O(n) - You may need to check every element in the worst case</p>
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
                        <span>Not examined</span>
                    </div>
                    <div style={{display: "flex", alignItems: "center", gap: "5px"}}>
                        <div style={{
                            width: "20px",
                            height: "20px",
                            backgroundColor: "yellow",
                            borderRadius: "3px"
                        }}></div>
                        <span>Currently examining</span>
                    </div>
                    <div style={{display: "flex", alignItems: "center", gap: "5px"}}>
                        <div style={{
                            width: "20px",
                            height: "20px",
                            backgroundColor: "green",
                            borderRadius: "3px"
                        }}></div>
                        <span>Found</span>
                    </div>
                    <div style={{display: "flex", alignItems: "center", gap: "5px"}}>
                        <div style={{width: "20px", height: "20px", backgroundColor: "red", borderRadius: "3px"}}></div>
                        <span>Not a match</span>
                    </div>
                </div>
            </div>
            <br/>
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