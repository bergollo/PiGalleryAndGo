"use client"

import React, { useReducer } from "react";
import Head from "next/head";
import { PhotosProvider } from '../context/PhotosContext';

import styles from "../styles/Home.module.css";
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import theme from '../config/theme';
import createEmotionCache from '../config/createEmotionCache';
import PhotoGallery from '../components/PhotoGallery';
import UploadDialog from '../components/UploadDialog';

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Picture Frame Manager</title>
        <meta name="description" content="Nextjs drag and drop file upload" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <ThemeProvider theme={theme}>
        <PhotosProvider>
          <main className={styles.main}>
          <CssBaseline />
          <Container fixed>
            <PhotoGallery />
            <UploadDialog />
            {/* <Box sx={{ bgcolor: '#cccccc', height: '100vh' }}>
              <h1 className={styles.title}>Picture Frame Manager</h1>
              <Grid container spacing={2}>
                <Grid item>
                  <GalleryPanel />
                </Grid>
                <Grid item>
                  <DropZone/>
                </Grid>
              </Grid>
            </Box> */}
          </Container>
          </main>

          <footer className={styles.footer}>
            <div>{new Date().getFullYear()}</div>
          </footer>
        </PhotosProvider>
      </ThemeProvider>
    </div>
  );
}
