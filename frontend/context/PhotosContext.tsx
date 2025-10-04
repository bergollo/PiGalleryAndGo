import React, { createContext, useContext, useState, ReactNode, Component } from 'react';
import * as path from 'path';


// Define the shape of the context state
interface PhotosContextType {
  photos: string[];
  addPhoto: (url: string) => void;
  setPhoto: (urls: string[]) => void;
  removePhoto: (url: string) => void;
  updatePhotos: () => void;
}

// Create the context with a default value
const PhotosContext = createContext<PhotosContextType | undefined>(undefined);

// Create a provider component
class PhotosProvider extends Component<{ children: ReactNode }, { photos: string[] }> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = {
      photos: [],
    };
  }

  addPhoto = (url: string) => {
    this.setState((prevState) => ({
      photos: [...prevState.photos, url],
    }));
  };

  setPhoto = (urls: string[]) => {
    this.setState(() => ({
      photos: [...urls],
    }));
  };

  removePhoto = async (url: string) => {
    this.setState((prevState) => ({
      photos: prevState.photos.filter((photo) => photo !== url)
    }));
    const response = await fetch(`/api/remove/${path.basename(url)}`, {
      method: "DELETE",
      headers: {"Content-Type": "application/json",},
    });
  };

  updatePhotos = async () => {
    const response = await fetch("/api/images/", {
      method: "GET",
      headers: {
          "Content-Type": "application/json",
          // 'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    response.json().then((obj) => {
      var imagesData = Array<any>()
      obj["cropImages"] = imagesData
      for (var filename of obj['filenames']){
        imagesData.push('http://localhost:8080/uploads/' + filename)
      }
      this.setState({
        photos: imagesData
      })
      fetch("/api/feh/restart", {
        method: "GET",
        headers: { "Content-Type": "application/json", },
      });
    }).catch(() => {
      console.log('Error occured when fetching books');
    });
  };

  render(): ReactNode {
    return (
      <PhotosContext.Provider value={{ photos:this.state.photos, addPhoto: this.addPhoto, setPhoto: this.setPhoto, removePhoto:this.removePhoto, updatePhotos:this.updatePhotos }}>
        {this.props.children}
      </PhotosContext.Provider>
    );
  }
};

// Create a custom hook to use the PhotosContext
const usePhotos = () => {
  const context = useContext(PhotosContext);
  if (context === undefined) {
    throw new Error('usePhotos must be used within a PhotosProvider');
  }
  return context;
};

// Export the context itself
export { PhotosProvider, PhotosContext, usePhotos };