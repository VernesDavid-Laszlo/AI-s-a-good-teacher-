import React, { useState } from "react";
import { gsap } from "gsap";

// Egyszerű BST reprezentáció objektumként
const tree = {
    value: 15,
    left: {
        value: 7,
        left: { value: 3 },
        right: { value: 10 },
    },
    right: {
        value: 20,
        left: { value: 17 },
        right: { value: 25 },
    },
};

const BSTAnimation = () => {
    const [target, setTarget] = useState(10);
    const [message, setMessage] = useState("Enter a number and click Start");

    const searchBST = async (node, id) => {
        if (!node) {
            setMessage(`Number ${target} not found`);
            return;
        }

        // Kiemelés sárgával
        await gsap.to(`#node-${id}`, { backgroundColor: "yellow", duration: 1 });

        if (node.value === target) {
            setMessage(`Found ${target}`);
            await gsap.to(`#node-${id}`, { backgroundColor: "green", duration: 1 });
            return;
        } else if (target < node.value) {
            setMessage(`Searching left...`);
            await searchBST(node.left, `${id}-left`);
        } else {
            setMessage(`Searching right...`);
            await searchBST(node.right, `${id}-right`);
        }

        // Visszaállítás pirosra, ha nem találta
        await gsap.to(`#node-${id}`, { backgroundColor: "red", duration: 1 });
    };

    // Rekurzív függvény a fa kirajzolására
    const renderTree = (node, id) => {
        if (!node) return null;

        return (
            <div style={treeContainerStyle}>
                <div id={`node-${id}`} style={nodeStyle}>
                    {node.value}
                </div>
                <div style={childrenContainerStyle}>
                    {node.left && renderTree(node.left, `${id}-left`)}
                    {node.right && renderTree(node.right, `${id}-right`)}
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
                onChange={(e) => {
                    const value = e.target.value;
                    setTarget(value === "" ? "" : Number(value));
                }}
                placeholder="Enter number"
            />
            <button onClick={() => searchBST(tree, "root")}>Start</button>
            <p>{message}</p>
            <div style={{display: "flex", justifyContent: "center"}}>
                {renderTree(tree, "root")}
            </div>
        </div>
    );
};

const nodeStyle = {
    width: "50px",
    height: "50px",
    backgroundColor: "#6200ea",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "white",
    fontSize: "18px",
    borderRadius: "50%",
    margin: "10px auto",
    position: "relative",
};

const treeContainerStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
};

const childrenContainerStyle = {
    display: "flex",
    justifyContent: "center",
    gap: "20px",
    marginTop: "10px",
};

export default BSTAnimation;