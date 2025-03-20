import { useState } from "react";
import { gsap } from "gsap";

const BstPractice = () => {
    const tree = {
        value: 50,
        left: {
            value: 30,
            left: { value: 20, left: { value: 10 }, right: { value: 25 } },
            right: { value: 40, left: { value: 35 }, right: { value: 45 } }
        },
        right: {
            value: 70,
            left: { value: 60, left: { value: 55 }, right: { value: 65 } },
            right: { value: 80, left: { value: 75 }, right: { value: 85 } }
        }
    };

    const [target, setTarget] = useState(45);
    const [message, setMessage] = useState("Select the root node to start.");
    const [currentNode, setCurrentNode] = useState(null);
    const [isAnimating, setIsAnimating] = useState(false);

    const resetGame = () => {
        setCurrentNode(null);
        setMessage("Incorrect! ❌ Search restarted.Search restarted. Select the root node to start.");
        setIsAnimating(false);
        gsap.to(".node", { backgroundColor: "#6200ea", duration: 0.5 });
    };

    const handleNodeSelection = (node) => {
        if (isAnimating) return;

        if (!currentNode) {
            if (node.value !== 50) {
                setMessage("Incorrect! Search restarted. ❌ Select the root node (50) first.");
                resetGame();
                return;
            }
            setCurrentNode(node);
            setMessage("Correct! ✅ Now choose the next step.Left or Right?");
            return;
        }

        gsap.to(`#node-${node.value}`, { backgroundColor: "yellow", duration: 0.5 });

        if (node.value === target) {
            setMessage(`Correct! ${target} found! ✅`);
            gsap.to(`#node-${node.value}`, { backgroundColor: "green", duration: 0.5, onComplete: () => setIsAnimating(false) });
            return;
        }

        setTimeout(() => {
            if ((target < currentNode.value && node.value === currentNode.left?.value) ||
                (target > currentNode.value && node.value === currentNode.right?.value)) {
                setCurrentNode(node);
                setMessage("Correct! ✅ Choose the next step.Left or Right?");
            } else {
                setMessage("Incorrect! ❌ Search restarted.");
                resetGame();
            }
            setIsAnimating(false);
        }, 800);
    };

    const renderTree = (node) => {
        if (!node) return null;
        return (
            <div style={{ textAlign: "center" }}>
                <div
                    id={`node-${node.value}`}
                    className="node"
                    onClick={() => handleNodeSelection(node)}
                    style={{
                        display: "inline-block",
                        margin: "10px",
                        padding: "10px",
                        borderRadius: "50%",
                        backgroundColor: "#6200ea",
                        color: "white",
                        cursor: "pointer",
                    }}
                >
                    {node.value}
                </div>
                <div style={{ display: "flex", justifyContent: "center" }}>
                    {renderTree(node.left)}
                    {renderTree(node.right)}
                </div>
            </div>
        );
    };

    return (
        <div style={{ textAlign: "center", padding: "20px" }}>
            <input
                type="number"
                value={target || ""}
                onChange={(e) => !isAnimating && setTarget(Number(e.target.value) || "")}
                placeholder="Enter number"
                disabled={isAnimating}
            />
            <button onClick={resetGame} disabled={isAnimating}>Reset</button>
            <p style={{ fontWeight: "bold" }}>{message}</p>
            {renderTree(tree)}
        </div>
    );
};

export default BstPractice;
