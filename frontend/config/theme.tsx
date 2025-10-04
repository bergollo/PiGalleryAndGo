import { createTheme } from '@mui/material/styles';
import { red, blue, green } from '@mui/material/colors';
// Create a theme instance.
const theme = createTheme({
palette: {
   primary: {
      main: blue.A100,
   },
   secondary: {
     main: green[400],
   },
   error: {
   main: red.A400,
   },
  },
});
export default theme;