// FIlePreview.tsx

import React from "react";
import styles from "../styles/FilePreview.module.css";

// interface MyComponentProps { filesData: Array<any>; }
export class FilePreview extends React.Component<{ filesData: Array<any> }> {

  // state: MyComponentProps = {
  //   // optional second annotation for better type inference
  //   filesData: [],
  // };

  render() {
    const { filesData = [] } = this.props;
    return(
      <div className={styles.fileList}>
        <div className={styles.fileContainer}>
          {/* loop over the fileData */}
          {filesData.map((f:any) => {
            return (
                <ol key={f.lastModified}>
                  <li className={styles.fileList}>
                    {/* display the filename and type */}
                    <div key={f.name} className={styles.fileName}>
                      {f.name}
                    </div>
                  </li>
                </ol>
            );
          })}
        </div>
      </div>
    );
  }
};
