import React, { createContext, useState, useEffect, useContext } from "react";
import { getCurrentUser as appwriteGetCurrentUser } from "../lib/appwrite";
import { getUserDocuments } from "../lib/appwrite";
import { getUserStats as appwriteGetUserStats } from "../lib/appwrite";

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userDoc, setUserDoc] = useState(null);
  const [userStats, setUserStats] = useState(null);

  useEffect(() => {
    const CheckCurrentUser = async () => {
      try {
        const user = await appwriteGetCurrentUser();
        setCurrentUser(user);

        if (user) {
          await getUserDocs(user.$id);
          await getUserStatsData(user.$id);
        }
      } catch (error) {
        console.error("Failed to get current user:", error);
        setCurrentUser(null);
        setUserDoc(null);
        setUserStats(null);
      } finally {
        setIsLoading(false);
      }
    };

    const getUserDocs = async (userId) => {
      try {
        const userDocument = await getUserDocuments(userId);
        setUserDoc(userDocument);
      } catch (error) {
        console.error("Failed to gather user documents:", error);
        setUserDoc(null);
      }
    };

    const getUserStatsData = async (userId) => {
      try {
        const userStatsData = await appwriteGetUserStats(userId);
        setUserStats(userStatsData);
      } catch (error) {
        console.error("Failed to gather user stats:", error);
        setUserStats(null);
      }
    };

    CheckCurrentUser();
  }, []);

  return (
    <UserContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        isLoading,
        userDoc,
        setUserDoc,
        userStats,
        setUserStats,
      }}
    >
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
