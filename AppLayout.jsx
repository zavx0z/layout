import React, {lazy, Suspense} from "react"
import Box from "@mui/material/Box"
import {Fade} from "@mui/material"
import BotLoader from "../../resource/element/BotLoader/BotLoader"

export const Root = ({children}) =>
    <Suspense fallback={<Box sx={{
        position: "absolute",
        width: "100%",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "rgba(255, 255, 255, 0.8)",
        p: 2,
    }}><BotLoader/></Box>}>
        <Box id={'appRoot'} sx={{
            display: 'flex',
            flexDirection: 'column',
            overflow: "hidden",
            position: 'relative',
        }}>
            {children}
            </Box>
    </Suspense>
export const Body = ({children}) => {
    const contentStyles = {
        flexGrow: 1,
        overflow: "hidden",
        display: 'flex',
        flexDirection: 'column',
    }
    return <Box id={'appBody'} sx={contentStyles}>
        <Box sx={{display: 'flex', height: '100%'}}>
            {children}
        </Box>
    </Box>
}
export const Content = ({children}) =>
    <Fade in={!!children}>
        <Box
            id={'content'}
            sx={{
                display: 'flex',
                flexGrow: 1,
            }}>
            {children}
        </Box>
    </Fade>


