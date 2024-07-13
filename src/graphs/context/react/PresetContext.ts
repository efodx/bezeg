import {createContext} from "react";

export const PresetContext = createContext({
    selected: "",
    setSelected: (selected: string) => console.log(selected)
})
