import "../styles/UploadLessons.css";

function UploadLessons() {
    return (
        <div className="upload-container">
            <h1>Upload Lesson</h1>
            <br/>
            <br/>
            <br/>

            {/* Cím és input mező egy sorban, balra igazítva */}
            <div className="title-input-container">
                <label htmlFor="title" className="upload-label">Title:</label>
                <input type="text" id="title" className="upload-input" placeholder="Enter lesson title..."/>
            </div>

            {/* Drag and Drop konténer középen */}
            <div className="drag-drop-container">
                Drag & Drop your file here
            </div>
            <br/>

            {/* Formátum megjegyzés */}
            <p className="upload-note">Please import only PDF, PPT or Image(JPG,Jpeg,PNG...) format</p>

            {/* Send gomb a jobb alsó sarokban */}
            <button className="upload-send-button">Send</button>
        </div>
    );
}

export default UploadLessons;
