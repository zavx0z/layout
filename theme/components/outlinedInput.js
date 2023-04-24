import {createTheme} from "@mui/material/styles"
import {themeColor} from "../palette"

export const outlinedInput = createTheme({
    MuiOutlinedInput: {
        styleOverrides: {
            root: {
                // Общие стили корневого элемента MuiOutlinedInput
                borderColor: themeColor.palette.primary.light,
                "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: themeColor.palette.primary.light,
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: themeColor.palette.secondary.light,
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: themeColor.palette.primary.light,
                },
            },
            // notchedOutline: {
            //     // Стили для контура (outline) MuiOutlinedInput в неактивном состоянии
            //     borderColor: themeColor.palette.primary.light,
            // },
            // input: {
            //     // Стили для элемента input внутри MuiOutlinedInput
            // },
            // inputMultiline: {
            //     // Стили для многострочного элемента input внутри MuiOutlinedInput
            // },
            // adornedStart: {
            //     // Стили для элемента, размещенного перед input внутри MuiOutlinedInput
            // },
            // adornedEnd: {
            //     // Стили для элемента, размещенного после input внутри MuiOutlinedInput
            // },
            // inputAdornedStart: {
            //     // Стили для input, когда есть элемент перед ним внутри MuiOutlinedInput
            // },
            // inputAdornedEnd: {
            //     // Стили для input, когда есть элемент после него внутри MuiOutlinedInput
            // },
            // inputMarginDense: {
            //     // Стили для input, когда установлен margin "dense" внутри MuiOutlinedInput
            // },
            // inputMarginNone: {
            //     // Стили для input, когда установлен margin "none" внутри MuiOutlinedInput
            // },
            // inputMarginNormal: {
            //     // Стили для input, когда установлен margin "normal" внутри MuiOutlinedInput
            // },
            // inputMarginXs: {
            //     // Стили для input, когда установлен margin "xs" внутри MuiOutlinedInput
            // },
        },
    },
})