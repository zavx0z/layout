import {themeColor} from "../palette"

const select = {
    MuiSelect: {
        styleOverrides: {
            icon: {
                color: themeColor.palette.primary.light, // цвет иконки стрелки
            },
            root: {
                "& .MuiSelect-icon": {
                    color: "#3676d7", // цвет иконки стрелки
                },
                // "& .MuiInputBase-input": {
                //     color: "#000", // цвет текста
                //     fontSize: "16px", // размер шрифта
                //     lineHeight: "1.5", // высота строки
                //     paddingTop: "16px", // отступ сверху
                //     paddingBottom: "16px", // отступ снизу
                //     paddingRight: "32px", // отступ справа
                //     paddingLeft: "32px", // отступ слева
                //     '&[aria-disabled="true"]': {
                //         color: '#a1a1a1' // цвет текста для отключенного состояния
                //     },
                // },
                // "& .MuiSelect-select": {
                //     paddingRight: "40px", // отступ справа для размещения иконки
                //     backgroundColor: "#fff", // цвет фона
                //     borderRadius: "4px", // радиус скругления углов
                //     border: "1px solid #d2d2d2", // цвет и толщина рамки
                //     "&:focus": {
                //         borderColor: "#e25e7c", // цвет рамки в фокусе
                //         boxShadow: "0 0 0 0.2rem rgba(226, 94, 124, 0.25)", // тень в фокусе
                //     },
                //     '&[aria-disabled="true"]': {
                //         backgroundColor: '#f1f1f1' // цвет фона для отключенного состояния
                //     },
                // },
                // "& .MuiSelect-selectMenu": {
                //     maxHeight: "200px", // максимальная высота выпадающего меню
                //     overflowY: "auto", // скроллинг, если выпадающее меню не помещается в экран
                //     "& li": {
                //         fontSize: "16px", // размер шрифта пунктов меню
                //         lineHeight: "1.5", // высота строки пунктов меню
                //         paddingTop: "8px", // отступ сверху у пунктов меню
                //         paddingBottom: "8px", // отступ снизу у пунктов меню
                //     },
                //     '&[aria-disabled="true"]': {
                //         opacity: '0.5' // прозрачность для отключенного состояния
                //     },
                // },
            },
        },
    },
}
export default select