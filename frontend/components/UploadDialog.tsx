import React, { useState, useRef } from 'react';
import { Fab, Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DropZone, { DropZoneRef } from "./DropZone";
import Grid from '@mui/material/Grid';

const UploadDialog = () => {
  const dropZoneRef = useRef<DropZoneRef>(null);
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

    // Function to trigger the MyComponent's method
  const handleUpload = () => {
    if (dropZoneRef.current) {
        dropZoneRef.current.triggerClick();
    }
    setOpen(false)
  };

  return (
    <div>
      {/* Floating Action Button */}
      <Fab
        color="primary"
        aria-label="add"
        style={{ position: 'fixed', bottom: 16, right: 16 }}
        onClick={handleClickOpen}
      >
        <AddIcon />
      </Fab>

      {/* Dialog Component */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add New Item</DialogTitle>
        <DialogContent>
          {/* <Container fixed>
          <Box sx={{ bgcolor: '#cccccc' }}>
            <Grid container spacing={2}> */}
              {/* <Grid item>
                <GalleryPanel />
              </Grid> */}
              <Grid item>
                <DropZone showButton={false} ref={dropZoneRef} />
              </Grid>
            {/* </Grid>
          </Box>
        </Container> */}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleUpload} color="primary">
            Upload
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
export default UploadDialog;