// DropZone.tsx
"use client";
// https://innocentanyaele.medium.com/create-a-drag-and-drop-file-component-in-reactjs-nextjs-tailwind-6ae70ba06e4b
import { useState, useImperativeHandle, forwardRef } from "react";
import { usePhotos } from '../context/PhotosContext';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';

import Button from '@mui/material/Button';
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined';

import styles from "../styles/DropZone.module.css";
import { FilePreview } from "./FilePreview";

export interface DropZoneRef {
  triggerClick: () => void;
}

interface DropZoneProp {
  showButton?: boolean; // Prop to control button visibility
}

export default forwardRef<DropZoneRef, DropZoneProp>(function DropZone({ showButton = true }, ref) {
  const { updatePhotos } = usePhotos()

// export default function DropZone (ref) {
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [files, setFiles] = useState<any>([]);

  function handleChange(e: any) {
    e.preventDefault();
    console.log("File has been added");
    if (e.target.files && e.target.files[0]) {
      console.log(e.target.files);
      for (let i = 0; i < e.target.files["length"]; i++) {
        setFiles((prevState: any) => [...prevState, e.target.files[i]]);
      }
    }
  }

  // onDragEnter sets inDropZone to true
  function handleDragEnter(e: any) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
    // dispatch({ type: "SET_IN_DROP_ZONE", inDropZone: true });
  };

  // onDragLeave sets inDropZone to false
  function handleDragLeave(e: any) {
    e.preventDefault();
    e.stopPropagation();

    // dispatch({ type: "SET_IN_DROP_ZONE", inDropZone: false });
    setDragActive(false);
  };

  // onDragOver sets inDropZone to true
  function handleDragOver(e: any) {
    e.preventDefault();
    e.stopPropagation();

    // set dropEffect to copy i.e copy of the source item
    e.dataTransfer.dropEffect = "copy";
    // dispatch({ type: "SET_IN_DROP_ZONE", inDropZone: true });
    setDragActive(true);
  };

  // onDrop sets inDropZone to false and adds files to fileList
  function handleDrop(e: any) {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      for (let i = 0; i < e.dataTransfer.files["length"]; i++) {
        setFiles((prevState: any) => [...prevState, e.dataTransfer.files[i]]);
      }
    }
    setDragActive(false);
  };

  // handle file selection via input element
  async function handleFileSelect(e:any) {
    // get files from event on the input element as an array
    // ensure a file or files are selected
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      let fileList = [...e.target.files]
      // loop over existing files
      const existingFiles = fileList.map((f:any) => f.name);
      // check if file already exists, if so, don't add to fileList
      // this is to prevent duplicates

      fileList = fileList.filter((f:any) => 
        existingFiles.includes(f.name)
      );
      setFiles(fileList);
      // dispatch action to add selected file or files to fileList
      // dispatch({ type: "ADD_FILE_TO_LIST", files });
    }
  };

  // to handle file uploads
  const uploadFiles = async () => {
    // get the files from the fileList as an array
    // initialize formData object
    const formData = new FormData();
    for (const file of files) {
      formData.append("files", file);
    }
    // Upload the files as a POST request to the server using fetch
    const response = await fetch("/api/upload/", {
      method: "POST",

      body: formData
    });

    //successful file upload
    if (response.ok) {
      setFiles([])
      alert("Files uploaded successfully");
      updatePhotos()
    } else {
      // unsuccessful file upload
      alert("Error uploading files");
    }
  };

  function removeFile(fileName: any, idx: any) {
    const newArr = [...files];
    newArr.splice(idx, 1);
    setFiles([]);
    setFiles(newArr);
  }

  // Expose the handleClick function to the parent component
  useImperativeHandle(ref, () => ({
    triggerClick: uploadFiles,
  }));

  return (
    <>
      <Container id="drop-zone" fixed className={styles.mainContainer}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
      >
        <Grid container spacing={2}>
          <Grid item>
            <FilePreview filesData={files} />
          </Grid>
          <Grid item>
            <div className={styles.dropzone}>
              <span className="material-icons"></span>
              <CloudUploadOutlinedIcon/>
              {/* <Fab color="primary" aria-label="add"> */}
              {/* <AddIcon> */}
                <input
                  id="fileSelect"
                  type="file"
                  multiple={true}
                  className={styles.files}
                  onChange={handleFileSelect}
                />
              {/* </AddIcon> */}
              {/* <label htmlFor="fileSelect">You can select multiple Files</label> */}

              <h3 className={styles.uploadMessage}>
                Drag &amp; Drop your files here or press <label className={styles.browse} htmlFor="fileSelect">Browse</label>
              </h3>
              { showButton && files.length > 0 && (
                <Button className={styles.uploadBtn} onClick={uploadFiles}>
                  Upload
                </Button>
              )}
            </div>
          </Grid>
        </Grid>
      </Container>
    </>
  );
})
