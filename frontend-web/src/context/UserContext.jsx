import React, { createContext, useState, useEffect, useContext } from 'react'
import { getCurrentUser as appwriteGetCurrentUser } from '../lib/appwrite'
const UserContext = createContext(null);
export const UserProvider = ({ children }) => {
    const [currentUser , setCurrentUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const CheckCurrentUser = async () => {
            try {
                const user = await appwriteGetCurrentUser();
                setCurrentUser(user);
            } catch (error) {
                console.error("Failed to get current user:", error);
                setCurrentUser(null);
            } finally {
                setIsLoading(false);
            }
        }

            CheckCurrentUser();
        
    } , []);

    return (
        <UserContext.Provider value={{ currentUser, setCurrentUser, isLoading }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error("useUser must be used within a UserProvider");
    }
    return context;
};