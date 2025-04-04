import  { useState } from 'react';
import '../styles/PdfPreview.css';

const PdfPreview = ({ pdfUrl, fileName, openPdfModal }) => {
    return (
        <div className="pdf-preview-card" onClick={() => openPdfModal(pdfUrl)}>
            <div className="pdf-thumbnail">
                <span className="pdf-icon">📄</span>
            </div>
            <div className="pdf-info">
                <p className="pdf-title">{fileName}</p>
                <p className="pdf-type">PDF</p>
            </div>
        </div>
    );
};
export default PdfPreview;
