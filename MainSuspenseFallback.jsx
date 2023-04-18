import Box from "@mui/material/Box"
import BotLoader from "../../components/BotLoader/BotLoader"
import {Suspense} from "react"

const styles = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    bgcolor: "rgba(255, 255, 255, 0.8)",
    borderRadius: "8px",
    p: 2,
}

const MainSuspenseFallback = ({children}) =>
    <Suspense fallback={
        <Box sx={styles}>
            <BotLoader/>
        </Box>
    }>
        {children}
    </Suspense>
export default MainSuspenseFallback