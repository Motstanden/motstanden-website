import { createContext, useState, useContext} from "react";


interface AppBarHeaderContextType { 
    title: string,
    setTitle: React.Dispatch<React.SetStateAction<string>>
}

const AppBarHeaderContext = createContext<AppBarHeaderContextType>(null!);

export function AppBarHeaderProvider({ children }: { children: React.ReactNode }) {
    const [title, setTitle] = useState("");
    const contextValue: AppBarHeaderContextType = { 
        title: title,
        setTitle: setTitle
    }
    return (
        <AppBarHeaderContext.Provider value={contextValue}>
            {children}
        </AppBarHeaderContext.Provider>
    );
}

export function useAppBarHeader(newTitle?: string): string {
    const {title, setTitle} = useContext(AppBarHeaderContext) as AppBarHeaderContextType

    if(newTitle !== undefined && newTitle !== title) {
        setTitle(newTitle)
    }

    return title
}