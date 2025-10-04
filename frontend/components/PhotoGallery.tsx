"use client";

import React, { useState, Component, useContext } from 'react';
import { PhotosContext } from '../context/PhotosContext';
import { Dialog, DialogContent, Grid, IconButton, Button } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';

interface PhotoGalleryState {
  itemData: Array<any>,
  photos: Array<any>,
  open:boolean,
  selectedPhoto:string,
  removeMode:boolean,
}

export default class PhotoGallery extends Component<{}, PhotoGalleryState> {
  static contextType = PhotosContext;
  context!: React.ContextType<typeof PhotosContext>;

  constructor(props: {}) {
    super(props);


    this.state = {
        itemData: Array<any>(),
        photos: [],
        open:false,
        selectedPhoto:'',
        removeMode:false,
    };
    // Bind the method to ensure 'this' refers to the class instance
    this.toggleRemoveMode = this.toggleRemoveMode.bind(this);
  }

  

    handleClickOpen (photo:string) {
      this.setState({
        selectedPhoto:photo
      })
      this.setState({
        open: true
      })
    };
  
    handleClose () {
      this.setState({
        open: false
      })
      this.setState({
        selectedPhoto:''
      })
    };
  
    handleRemovePhoto (photo:string) {
      // const context = useContext(PhotosContext);
      // const { removePhoto } = context;
           // Access the addPhoto function from context
      this.context?.removePhoto(photo)
    };
  
    toggleRemoveMode () {
      this.setState({
        removeMode: !this.state.removeMode
      })
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

    setAllFiles () {
      this.getAllFiles().then((json) => {
        var imagesData = Array<string>()
        json["cropImages"] = imagesData
        for (var filename of json['filenames']){
            // this.getImg(filename).then((blob) => {
            //     this.blobReader(blob).then((result) => {
            //         imagesData.push(result)
            //     })
            // })
            imagesData.push('/api/images/' + filename)
        } 
        this.context?.setPhoto(imagesData)
      }).catch(() => {
          console.log('Error occured when fetching books');
      });
    }
    componentDidMount() {
      this.setAllFiles()
    }
  
    render() {

        return (
          <PhotosContext.Consumer>
            { context => (
            <div>
              <Button variant="contained" color="secondary" onClick={this.toggleRemoveMode}>
                {this.state.removeMode ? 'Disable Remove Mode' : 'Enable Remove Mode'}
              </Button>
        
              <Grid container spacing={2} style={{ marginTop: '16px' }}>
                {context?.photos.map((photo, index) => (
                  <Grid item xs={12} sm={6} md={4} key={index}>
                    <div style={{ position: 'relative' }}>
                      <img
                        src={photo}
                        alt={`Photo ${index + 1}`}
                        style={{ width: '100%', cursor: 'pointer' }}
                        onClick={() => this.handleClickOpen(photo)}
                      />
                      {this.state.removeMode && (
                        <IconButton
                          style={{ position: 'absolute', top: 8, right: 8 }}
                          color="error"
                          onClick={(e) => {
                            e.stopPropagation(); // Prevent triggering the photo click
                            this.handleRemovePhoto(photo);
                          }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      )}
                    </div>
                  </Grid>
                ))}
              </Grid>
        
              <Dialog
                open={this.state.open}
                onClose={this.handleClose}
                fullScreen
              >
                <DialogContent>
                  <IconButton
                    edge="start"
                    color="inherit"
                    onClick={this.handleClose}
                    aria-label="close"
                    style={{ position: 'absolute', top: 16, right: 16 }}
                  >
                    <CloseIcon />
                  </IconButton>
                  <img
                    src={this.state.selectedPhoto}
                    alt="Selected"
                    style={{ width: '100%', height: 'auto' }}
                  />
                </DialogContent>
              </Dialog>
            </div>
            )}
          </PhotosContext.Consumer>
        );
    }
  };
  