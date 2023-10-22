import { useState, useRef } from "react";
import "./DragDropFiles.css";

const DragDropFiles = ({ handleFile }) => {
  const [files, setFiles] = useState(null);
  const [isUploaded, setIsUploaded] = useState(false);
  const [imgSrc, setImgSrc] = useState(null);
  const inputRef = useRef();

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDrop = (event) => {
    event.preventDefault();
    console.log(event.dataTransfer.files);
    const imageUrl = URL.createObjectURL(event.dataTransfer.files[0]);
    console.log(imageUrl);
    const path = imageUrl;
    console.log(path);
    setImgSrc(path);
    setFiles(event.dataTransfer.files);
    setIsUploaded(true);

    // handleFile(event.dataTransfer.files, true);
  };

  const handleSelect = (event) => {
    event.preventDefault();
    const imageUrl = URL.createObjectURL(event.target.files[0]);
    console.log(event.target.files);
    console.log(imageUrl);
    const path = imageUrl;
    console.log(path);
    setImgSrc(path);
    setFiles(event.target.files);
    setIsUploaded(true);
    // handleFile(event.dataTransfer.files, true);
  };

  // send files to the server // learn from my other video
  const handleUpload = () => {
    const formData = new FormData();
    formData.append("Files", files);
    handleFile(files, true);
  };

  const handleCancel = () => {
    setFiles(null);
    setIsUploaded(false);
    handleFile(null, false);
  };

  if (files)
    return (
      <>
        <div className="dropzone">
          {/* <img src={imgSrc} className="uploaded-img" /> */}
          <embed
            src={imgSrc}
            width="700"
            height="575"
            type="application/pdf"
            className="uploaded-img"
          />
        </div>
        <ul>
          {Array.from(files).map((file, idx) => (
            <li key={idx}>{file.name}</li>
          ))}
        </ul>
        <div className="actions">
          <button
            className="dropzone-button2"
            onClick={() => {
              handleCancel();
            }}
          >
            Cancel
          </button>
          <button className="dropzone-button2" onClick={handleUpload}>
            Upload
          </button>
        </div>
      </>
    );

  return (
    <>
      <div className="dropzone" onDragOver={handleDragOver} onDrop={handleDrop}>
        <h1>Drag and Drop a .pdf with your notes</h1>
        <input
          type="file"
          multiple
          onChange={handleSelect}
          hidden
          accept="application/pdf"
          ref={inputRef}
        />
        <button
          onClick={() => inputRef.current.click()}
          className="dropzone-button"
        >
          Select PDF
        </button>
      </div>
      <div className="actions"></div>
    </>
  );
};

export default DragDropFiles;
