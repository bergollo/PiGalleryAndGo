import React from "react";
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import styles from "../styles/GalleryPanel.module.css";


export class GalleryPanel extends React.Component {
    state = {
        itemData: Array<any>(),
    };

    // to handle file uploads
    async getImg (filename:string) {
        const response = await fetch("/api/img/" + filename + "?w=164&h=164&fit=crop&auto=format", {
            method: "GET",
            headers: {
                "Content-Type": "text/html",
            },
        });
        return response.blob();
    };

    async blobReader (blob: Blob) {
        const reader = new FileReader();
        await new Promise((resolve, reject) => {
            reader.onload = resolve;
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
        return reader.result
    };

    // to handle file uploads
    async getAllFiles() {
        const response = await fetch("/api/images/", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                // 'Content-Type': 'application/x-www-form-urlencoded',
            },
        });

        return response.json();
    };

    componentDidMount() {
        this.getAllFiles().then((json) => {
            var imagesData = Array<any>()
            json["cropImages"] = imagesData
            for (var filename of json['filenames']){
                // this.getImg(filename).then((blob) => {
                //     this.blobReader(blob).then((result) => {
                //         imagesData.push(result)
                //     })
                // })
                imagesData.push(filename)
            }
            this.setState({
                itemData: imagesData
            })
        }).catch(() => {
            console.log('Error occured when fetching books');
        });
    }

    render () {
        return (
            // <ImageList cols={3} rowHeight={170} className={styles.gallery}>
            // {this.state.itemData.map((fname) => (
            //     <ImageListItem key={fname}>
            //         <img
            //             src={URL.createObjectURL(fname)}
            //             alt={fname}
            //             loading="lazy" />
            //     </ImageListItem>
            // ))}
            // </ImageList>
            <div>
            {this.state.itemData.map((fname, index) => (
                <p key={`test+${index}`}></p>
            ))}
            </div>
        )
    }
};