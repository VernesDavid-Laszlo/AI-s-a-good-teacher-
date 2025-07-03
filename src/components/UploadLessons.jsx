import "../styles/UploadLessons.css";
import { useState } from "react";
import { db, storage } from "../firebase-config";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useParams } from "react-router-dom";

function UploadLessons({ chapterId }) {
    const { id: courseId } = useParams();
    const [title, setTitle] = useState("");
    const [file, setFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState("");
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState("");

    const handleDragEnter = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();

        const droppedFile = e.dataTransfer.files[0];
        if (droppedFile) {
            setFile(droppedFile);
            setPreviewUrl(URL.createObjectURL(droppedFile));
        }
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            setPreviewUrl(URL.createObjectURL(selectedFile));
        }
    };

    const handleUpload = async () => {
        if (!title || !file || typeof file.name !== "string" || typeof file.type !== "string") {
            setMessage("Please enter a title and select a valid file.");
            return;
        }

        const allowedTypes = ["application/pdf", "application/vnd.ms-powerpoint", "image/jpeg", "image/png", "image/jpg"];
        if (!allowedTypes.includes(file.type)) {
            setMessage("Only PDF, PPT or image (JPG, PNG) files are allowed.");
            return;
        }

        setUploading(true);
        setMessage("");

        try {
            const fileRef = ref(storage, `prezentations/${file.name}`);
            await uploadBytes(fileRef, file);
            const downloadURL = await getDownloadURL(fileRef);

            const chapterRef = doc(db, "courses", courseId, "chapters", chapterId);
            const chapterSnap = await getDoc(chapterRef);

            if (!chapterSnap.exists()) {
                setMessage("Chapter not found.");
                setUploading(false);
                return;
            }

            const chapterData = chapterSnap.data();
            const existingLessons = chapterData.lessons || [];

            const newLesson = {
                title: title,
                preztitle: file.name,
                content: downloadURL
            };

            await setDoc(chapterRef, {
                lessons: [...existingLessons, newLesson]
            }, { merge: true });

            setMessage("✅ Upload successful!");
            setTitle("");
            setFile(null);
            setPreviewUrl("");
        } catch (error) {
            console.error("Upload error:", error);
            setMessage("❌ An error occurred during upload.");
        } finally {
            setUploading(false);
        }
    };

    return (
        <div
            className="upload-container"
            onDragEnter={handleDragEnter}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
        >
            <h1>Upload Lesson</h1>
            <br />

            <div className="title-input-container">
                <label htmlFor="title" className="upload-label">Title:</label>
                <input
                    type="text"
                    id="title"
                    className="upload-input"
                    placeholder="Enter lesson title..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
            </div>

            <div className="drag-drop-container">
                <p>Drag & Drop your file here</p>
                <input type="file" onChange={handleFileChange} />
                {previewUrl && (
                    <div style={{ marginTop: "10px" }}>
                        {file?.type.startsWith("image/") ? (
                            <img
                                src={previewUrl}
                                alt="Preview"
                                style={{ maxWidth: "100%", maxHeight: "300px", borderRadius: "8px" }}
                            />
                        ) : (
                            <p style={{ color: "white" }}>{file.name}</p>
                        )}
                    </div>
                )}
            </div>

            <p className="upload-note">Only PDF, PPT or Image (JPG, JPEG, PNG)</p>

            <button
                className="upload-send-button"
                onClick={handleUpload}
                disabled={uploading}
            >
                {uploading ? "Uploading..." : "Send"}
            </button>

            {message && <p style={{ color: "white", marginTop: "15px" }}>{message}</p>}
        </div>
    );
}

export default UploadLessons;
