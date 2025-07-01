import React, { useState } from "react";
import { gsap } from "gsap";

const BstPractice = () => {
    const tree = {
        value: 50,
        left: {
            value: 30,
            left: {
                value: 20,
                left: {
                    value: 10,
                    left: { value: 5 },
                    right: { value: 15 }
                },
                right: {
                    value: 25,
                    left: { value: 22 },
                    right: { value: 27 }
                }
            },
            right: {
                value: 40,
                left: {
                    value: 35,
                    left: { value: 32 },
                    right: { value: 37 }
                },
                right: {
                    value: 45,
                    left: { value: 42 },
                    right: { value: 48 }
                }
            }
        },
        right: {
            value: 70,
            left: {
                value: 60,
                left: {
                    value: 55,
                    left: { value: 52 },
                    right: { value: 57 }
                },
                right: {
                    value: 65,
                    left: { value: 62 },
                    right: { value: 68 }
                }
            },
            right: {
                value: 80,
                left: {
                    value: 75,
                    left: { value: 72 },
                    right: { value: 78 }
                },
                right: {
                    value: 85,
                    left: { value: 82 },
                    right: { value: 88 }
                }
            }
        }
    };

    const [target, setTarget] = useState(42);
    const [message, setMessage] = useState("Select the root node to start.");
    const [currentNode, setCurrentNode] = useState(null);
    const [isAnimating, setIsAnimating] = useState(false);

    const resetGame = () => {
        setCurrentNode(null);
        setMessage("Search restarted. Select the root node to start.");
        setIsAnimating(false);
        gsap.to(".node", { backgroundColor: "#6200ea", opacity: 1, duration: 0.5 });
    };

    const handleNodeSelection = (node) => {
        if (isAnimating) return;

        if (!currentNode) {
            if (node.value !== 50) {
                setMessage("Incorrect! ❌ Select the root node (50) first.");
                resetGame();
                return;
            }
            setCurrentNode(node);
            setMessage("Correct! ✅ Now choose the next step. Left or Right?");
            return;
        }

        gsap.to(`#node-${node.value}`, { backgroundColor: "yellow", duration: 0.5 });

        if (node.value === target) {
            setMessage(`Correct! ${target} found! ✅`);
            gsap.to(`#node-${node.value}`, { backgroundColor: "green", duration: 0.5 });
            return;
        }

        if ((target < currentNode.value && node.value === currentNode.left?.value) ||
            (target > currentNode.value && node.value === currentNode.right?.value)) {

            if (target < currentNode.value) {
                grayOutSubtree(currentNode.right);
            } else {
                grayOutSubtree(currentNode.left);
            }
            setCurrentNode(node);
            setMessage("Correct! ✅ Choose the next step. Left or Right?");
        } else {
            setMessage("Incorrect! ❌ Search restarted.");
            resetGame();
        }
    };

    const grayOutSubtree = (node) => {
        if (!node) return;
        gsap.to(`#node-${node.value}`, { opacity: 0.3, duration: 0.5 });
        grayOutSubtree(node.left);
        grayOutSubtree(node.right);
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

        <div style={{textAlign: "center", padding: "20px", fontFamily: "Arial"}}>
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
                <p>This animation shows how searching works in a Binary Search Tree (BST). A BST is a tree-based data
                    structure with special properties:</p>
                <ul style={{textAlign: "left"}}>
                    <li>Each node has at most two children (left and right)</li>
                    <li>All nodes in the left subtree have values less than the node's value</li>
                    <li>All nodes in the right subtree have values greater than the node's value</li>
                </ul>

                <p><strong>Time Complexity:</strong> O(h) where h is the height of the tree. In a balanced tree, this is
                    O(log n).</p>
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
                        <span>Unvisited nodes</span>
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
                        <span>Examined but not the target</span>
                    </div>
                </div>
            </div>
            <br/>
            <input
                type="number"
                value={target || ""}
                onChange={(e) => !isAnimating && setTarget(Number(e.target.value) || "")}
                placeholder="Enter number"
                disabled={isAnimating}
            />
            <button onClick={resetGame} disabled={isAnimating}>Reset</button>
            <p style={{fontWeight: "bold"}}>{message}</p>
            {renderTree(tree)}
        </div>
    );
};

export default BstPractice;