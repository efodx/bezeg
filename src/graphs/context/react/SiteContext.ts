import {createContext} from "react";

export const SiteContext = createContext({
    preset: {
        selected: "",
        setSelected: (selected: string) => console.debug(selected)
    },
    fullScreen: {
        fullScreen: false,
        setFullScreen: (fullScreen: boolean) => console.debug(fullScreen)
    }
});
