import { useEffect, useState } from "react";
import { getFirestore, collection, getDocs, doc, getDoc, deleteDoc, updateDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { FaTimesCircle, FaCheckCircle } from "react-icons/fa";
import Header from '../components/Header';
import "../styles/Admin.css";

import { uploadTestsToChapter } from "../utils/uploadDefaultTests";
import { searchingAlgorithmsTests } from "../data/searchingAlgorithmsTests.js";
import { sortingAlgorithmsTests } from "../data/sortingAlgorithmsTests.js";


function Admin() {
    const [users, setUsers] = useState([]);
    const [isAdmin, setIsAdmin] = useState(false);
    const auth = getAuth();
    const db = getFirestore();

    useEffect(() => {
        const checkAdmin = async () => {
            if (auth.currentUser) {
                const userRef = doc(db, "users", auth.currentUser.uid);
                const userSnap = await getDoc(userRef);

                if (userSnap.exists() && userSnap.data().role === 0) {
                    setIsAdmin(true);

                    const usersCollection = collection(db, "users");
                    const usersSnapshot = await getDocs(usersCollection);
                    const usersList = usersSnapshot.docs
                        .map(doc => ({ id: doc.id, ...doc.data() }))
                        .filter(user => user.role !== 0);

                    setUsers(usersList);
                }
            }
        };

        checkAdmin();
    }, [auth.currentUser]);

    const handleDeleteUser = async (userId) => {
        if (window.confirm("Biztosan törölni szeretnéd ezt a felhasználót?")) {
            try {
                await deleteDoc(doc(db, "users", userId));
                setUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
                alert("Sikeres törlés!");
            } catch (error) {
                console.error("Hiba a törlés során:", error);
                alert("Hiba történt a törlés során!");
            }
        }
    };

    const handleApproveTeacher = async (userId) => {
        try {
            await updateDoc(doc(db, "users", userId), { approved: true });
            setUsers(prevUsers => prevUsers.map(user => user.id === userId ? { ...user, approved: true } : user));
            alert("A tanár jóváhagyva!");
        } catch (error) {
            console.error("Hiba az engedélyezés során:", error);
            alert("Hiba történt az engedélyezés során!");
        }
    };

    // ÚJ: kezelőfüggvény a tesztfeltöltés gombhoz
    const handleUploadTests = async () => {
        try {
            await uploadTestsToChapter("searchingAlgorithms", "binarySearch", searchingAlgorithmsTests.binarySearchTests);
            await uploadTestsToChapter("searchingAlgorithms", "binarySearchTree", searchingAlgorithmsTests.binarySearchTreeTests);
            await uploadTestsToChapter("searchingAlgorithms", "fibonacciSearch", searchingAlgorithmsTests.fibonacciSearchTests);
            await uploadTestsToChapter("searchingAlgorithms", "intervalSearch", searchingAlgorithmsTests.intervalSearchTests);
            await uploadTestsToChapter("searchingAlgorithms", "linearSearch", searchingAlgorithmsTests.linearSearchTests);
            alert("✅ Összes teszt feltöltve!");
        } catch (error) {
            console.error("Hiba a tesztek feltöltése során:", error);
            alert("Hiba történt a tesztek feltöltése során!");
        }
    };

    const handleUploadSortingTests = async () => {
        try {
            await uploadTestsToChapter("sortingAlgorithms", "bubbleSort", sortingAlgorithmsTests.bubbleSortTests);
            await uploadTestsToChapter("sortingAlgorithms", "insertionSort", sortingAlgorithmsTests.insertionSortTests);
            await uploadTestsToChapter("sortingAlgorithms", "mergeSort", sortingAlgorithmsTests.mergeSortTests);
            await uploadTestsToChapter("sortingAlgorithms", "quickSort", sortingAlgorithmsTests.quickSortTests);
            await uploadTestsToChapter("sortingAlgorithms", "selectionSort", sortingAlgorithmsTests.selectionSortTests);
            alert("✅ Összes Sorting Algorithm teszt feltöltve!");
        } catch (error) {
            console.error("Hiba a Sorting tesztek feltöltése során:", error);
            alert("Hiba történt a Sorting tesztek feltöltése során!");
        }
    };


    return (
        <div className="admin-page">
            <div className="admin-background">
                <Header />
                <main className="admin-container container">
                    {isAdmin ? (
                        <>
                            <div className="users-container">
                                <h1>Felhasználók listája</h1>
                                <br />
                                {users.length > 0 ? (
                                    <ul>
                                        {users.map(user => (
                                            <li key={user.id} className="user-row">
                                                <div className="user-info">
                                                    <span className="user-name">{user.username} </span>
                                                    <span className="user-email">: {user.email} ,</span>
                                                    <span className="user-role">
                                                        {user.role === 2 ? "Student" : user.role === 1 ? "Teacher" : "Unknown"}
                                                    </span>
                                                    {user.role === 1 && !user.approved && (
                                                        <span className="pending-approval"> (Pending...) </span>
                                                    )}
                                                </div>
                                                <div className="user-icons">
                                                    {user.role === 1 && !user.approved && (
                                                        <FaCheckCircle className="icon green" onClick={() => handleApproveTeacher(user.id)} />
                                                    )}
                                                    <FaTimesCircle className="icon red" onClick={() => handleDeleteUser(user.id)} />
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p>Nincsenek felhasználók.</p>
                                )}
                            </div>

                            {/* ÚJ rész: tesztfeltöltés gomb */}
                            <div style={{
                                marginTop: "40px",
                                padding: "20px",
                                border: "1px solid #ccc",
                                borderRadius: "8px"
                            }}>
                                <h2>📋 Upload tests</h2>
                                <button onClick={handleUploadTests}
                                        style={{padding: "10px 20px", fontSize: "16px", cursor: "pointer"}}>
                                    Upload Searching Algorithms Tests
                                </button>
                                <br/>
                                <br/>
                                <button onClick={handleUploadSortingTests}
                                        style={{padding: "10px 20px", fontSize: "16px", cursor: "pointer"}}>
                                    Upload Sorting Algorithms Tests
                                </button>

                            </div>
                        </>
                    ) : (
                        <p>Nincs jogosultságod az adatok megtekintésére.</p>
                    )}
                </main>
            </div>
        </div>
    );
}

export default Admin;
