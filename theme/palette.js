import {createTheme} from "@mui/material/styles"

export const themeColor = createTheme({
    palette: {
        primary: {
            main: '#0c1f3c',
        },
        secondary: {
            main: "#7ebbf3"
        },
        error: {
            main: "#ff6c6c"
        },
        info:{
            main: "#7888c5"
        }
    },
})