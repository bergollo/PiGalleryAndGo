import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw'

import fs from 'fs';
import path from 'path';

const pngPath = path.resolve(__dirname, '../resources/uploads/', 'test.png');
const pngBuffer = fs.readFileSync(pngPath);

export const handlers = [
  http.get('/api/images/', () => {
    return HttpResponse.json({
      filenames: [ "test.png" ]
    })
  }),

  http.get('/api/uploads/test.png', () => {
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