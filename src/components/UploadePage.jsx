
import UploadSearchingChapter from "../utils/UploadSearchingChapter.jsx";

const UploadPage = () => {
    const handleUpload = async () => {
        await UploadSearchingChapter();
    };

    return (
        <div>
            <h1>Upload  Chapters</h1>
            <button onClick={handleUpload}>Upload Data to Firestore</button>
        </div>
    );
};

export default UploadPage;
