import { useEffect, useState } from "react";
import { getFirestore, collection, getDocs, doc, getDoc, deleteDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { FaTimesCircle } from "react-icons/fa";
import Header from '../components/Header';
import "../styles/Admin.css";

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

                    // 🔹 Lekérjük az összes usert (kivéve az adminokat)
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

    // ❌ Felhasználó törlése
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

    return (
        <div className="admin-page">
            <div className="admin-background">
                <Header />
                <main className="admin-container container">
                    {isAdmin ? (
                        <div className="users-container">
                            <h1>Felhasználók listája</h1>
                            <br />
                            {users.length > 0 ? (
                                <ul>
                                    {users.map(user => (
                                        <li key={user.id} className="user-row">
                                            <div className="user-info">
                                                <span className="user-name">{user.username}  </span>
                                                <span className="user-email">: {user.email} ,</span>
                                                <span className="user-role">
                                                    {user.role === 2 ? "Student" : user.role === 1 ? "Teacher" : "Unknown"}
                                                </span>
                                            </div>
                                            <div className="user-icons">
                                                <FaTimesCircle className="icon red" onClick={() => handleDeleteUser(user.id)} />
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p>Nincsenek felhasználók.</p>
                            )}
                        </div>
                    ) : (
                        <p>Nincs jogosultságod az adatok megtekintésére.</p>
                    )}
                </main>
            </div>
        </div>
    );
}

export default Admin;
