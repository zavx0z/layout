import {createTheme} from "@mui/material/styles"
import {themeColor} from "./palette"
import select from "./components/select"
import {drawer} from "./components/drawer"
import {outlinedInput} from "./components/outlinedInput"

const theme = createTheme({
    ...themeColor,
    components: {
        ...select,
        ...drawer,
        ...outlinedInput,
    }
})

export default theme