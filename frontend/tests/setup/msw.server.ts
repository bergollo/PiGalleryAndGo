import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw'

import fs from 'fs';
import path from 'path';

const pngPath = path.resolve(__dirname, '../resources/uploads', 'Screenshot_test.png');
const pngBuffer = fs.readFileSync(pngPath);

export const handlers = [
  http.get('/api/files-upload/', () => {
    return HttpResponse.json({
      filenames: [ "Screenshot_test.png" ]
    })
  }),

  http.get('/api/uploads/Screenshot%202023-05-25%20at%2010.51.15%20AM.png', () => {
    // Convert Node Buffer -> Uint8Array -> Blob
    const uint8 = new Uint8Array(pngBuffer);
    const blob = new Blob([uint8], { type: 'image/png' });

    return new HttpResponse(blob, {
      status: 200,
      headers: {
        'Content-Type': 'image/png',
        'Content-Disposition': 'attachment; filename="picture.png"',
      },
    })
  }),
];

export const server = setupServer(...handlers);