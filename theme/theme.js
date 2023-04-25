import {createTheme} from "@mui/material/styles"
import {themeColor} from "./palette"
import select from "./components/select"
import {drawer} from "./components/drawer"
import {outlinedInput} from "./components/outlinedInput"
import typography from "./components/typography"

const theme = createTheme({
    ...themeColor,
    ...typography,
    components: {
        ...select,
        ...drawer,
        ...outlinedInput,
    }
})

export default theme