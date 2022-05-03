import React, { useContext, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";


interface AuthContextType{
	user: string | null
    signIn: (user: string, callback: VoidFunction) => void
    signOut: (callback: VoidFunction) => void;
}

export const AuthContext = React.createContext<AuthContextType>(null!);

export function useAuth(){
	return useContext(AuthContext)
}

export function AuthProvider({ children }: {children: React.ReactNode} ){
    let [user, setUser] = useState<string | null>(null)     // TODO: Persist log in between refreshes
    
    let signIn = (newUser: string, callback: VoidFunction) => {
        let signInSuccess = true         // TODO: Implement sign in logic here
        if (signInSuccess){
            setUser(newUser)
            callback()        
        }
    }

    let signOut = (callback: VoidFunction) => {
        let signOutSuccess = true      // TODO: Implement sign out logic here
        if (signOutSuccess){
            setUser(null)
            callback()
        }
    }

    let contextValue = {user, signIn, signOut}

    return (  
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    )
}

export function RequireAuth({ children }: {children: JSX.Element}){
    let auth = useAuth();
    let location = useLocation()

    if (!auth.user) {
        // Redirect them to the /logg-inn page, but save the current location they were
        // trying to go to when they were redirected. This allows us to send them
        // along to that page after they login, which is a nicer user experience
        // than dropping them off on the home page.
        return <Navigate to="/logg-inn" state={{ from: location }} replace />;
      }
    
    return children
}

export function RequireAuthRouter(){
    return <RequireAuth><Outlet/></RequireAuth>
}