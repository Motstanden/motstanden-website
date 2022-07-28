import React, { useContext, useEffect, useState } from "react";
import { useQuery } from '@tanstack/react-query';
import { Navigate, Outlet, useLocation } from "react-router-dom";


interface AuthContextType{
	user: string | null
    signIn: (user: string, password: string, callback: VoidFunction) => void
    signOut: (callback: VoidFunction) => void;
}

export const AuthContext = React.createContext<AuthContextType>(null!);

export function useAuth(){
	return useContext(AuthContext)
}

export function AuthProvider({ children }: {children: React.ReactNode} ){
    
    let [user, setUser] = useState<string | null>(null)     // TODO: Persist log in between refreshes
    
    // Define login logic
    let signIn = async (newUser: string, _password: string, callback: VoidFunction) => {
        
        let response = await fetch("/api/login", {
            method: "POST",
            body: JSON.stringify({username: newUser, password: _password}),
            headers: { 'Content-Type': 'application/json' }
        })
        
        if (response.ok){
            setUser(newUser)
            callback()        
        }
    }
    
    // Define logout logic
    let signOut = async (callback: VoidFunction) => {
        let response = await fetch("/api/logout", {
            method: "POST"
        })
        if (response.ok){
            setUser(null)
            callback()
        }
    }

    // Fetch user data on initial load
    const { status } = useQuery(["GetUserMetaData"], 
        async () =>{
            let response = await fetch("api/userMetaData") 
            if (!response.ok) {
                throw new Error(response.statusText)
            }
            const data = response.status === 200 ? await response.json() : null;    
            setUser(data?.username)   
    }, {
       enabled: !user,
       retryOnMount: false,
       refetchOnMount: false,
       refetchInterval: false,
       refetchOnWindowFocus: false,
       keepPreviousData: true,
    })

    if (status === 'loading'){
        return <></>
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