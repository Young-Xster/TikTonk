import { Account, Client, Databases, ID, Storage } from "appwrite";
import AsyncStorage from '@react-native-async-storage/async-storage';

const client = new Client()
    .setEndpoint('https://fra.cloud.appwrite.io/v1')
    .setProject('683ae50200343d8107c3');
const databases = new Databases(client);
const account = new Account(client);
const storage = new Storage(client);

export async function signup(email, password) {
    try {
        const userAccount = await account.create(ID.unique(), email, password, email.split('@')[0]);
        
        const document = await databases.createDocument(
            '683aed5d0031dc5b8244',
            '683b198000065ced36ab',
            userAccount.$id,
            {
                Email: email, 
                UserId: userAccount.$id, 
                Premium: false, 
                Name: email.split('@')[0]
            }
        );
        
        const session = await account.createEmailPasswordSession(email, password);
        await AsyncStorage.setItem('user', JSON.stringify(userAccount));
        return userAccount;
    } catch (error) {
        console.error("Signup error:", error);
        throw error;
    }
}

export async function getCurrentUser() {
    try {
        return await account.get();
    } catch (error) {
        // console.error("Failed to get current user:", error);
        return null; // Return null if no user is logged in or an error occurs
    }
}
export async function PlatformsAccountsRegister(obj){
    try {
        const currentUser = await getCurrentUser();
        if (!currentUser) {
            throw new Error('No user is currently logged in');
        }
        const document0 = await databases.createDocument(
            '683aed5d0031dc5b8244',
            '683b267b002834660a51',
            ID.unique(),
            {AccountId: ID.unique(), UserId: currentUser.$id, Email: obj.TikTokEmail, Password: obj.TikTokPassword}
        );
        if (!obj.IGEmail || !obj.IGPassword) {
            console.warn("Instagram or YouTube credentials are missing, skipping account creation for these platforms."); 
            return; // Skip account creation if credentials are not provided  
        }
        const document1 = await databases.createDocument(
            '683aed5d0031dc5b8244',
            '683b26fa00067aa87b36',
            ID.unique(),
            {AccountId: ID.unique(), UserId: currentUser.$id, Email: obj.IGEmail, Password: obj.IGPassword}
        );
        if (!obj.YTsEmail || !obj.YTsPassword) {
            console.warn("YouTube credentials are missing, skipping account creation for YouTube."); 
            return; // Skip account creation if credentials are not provided  
        }
        const document2 = await databases.createDocument(
            '683aed5d0031dc5b8244',
            '683b275b002fe57b34b2',
            ID.unique(),
            {AccountId: ID.unique(), UserId: currentUser.$id, Email: obj.YTsEmail, Password: obj.YTsPassword}
        );
       
        
    } catch (error) {
        console.error("PlatformsAccountsRegister error:", error);
        throw error;
    }
}
export async function logout() {
    try {
        try {
            // Try to delete the current session
            await account.deleteSession('current');
        } catch (e) {
            // If deleting session fails, just log it but continue
            console.log("Session deletion failed:", e);
        }
        return true;
    } catch (error) {
        console.error("Failed to clear local storage:", error);
        throw error;
    }
}
export async function login(email, password) { 
    try {
        const session = await account. createEmailPasswordSession(email, password);
        await AsyncStorage.setItem('user', JSON.stringify(session));
        return session; 
    } catch (error) {
        console.error("Failed to login:", error);
        throw error;
    }
}
export async function listPostsFiles(bucketId) {
    try {
        const response = await storage.listFiles(bucketId);
        return response.files.map(file => ({
            Item: {
                id: file.$id,
                thumbnail: storage.getFileView(bucketId, file.$id).toString(),
                name: file.name.split('.')[0]
            }
        }));
    } catch (error) {
        console.error("Failed to list background files:", error);
        throw error;
    }
}
export async function fetchUser() {
    try {
        const userData = await AsyncStorage.getItem('user');
        if (userData) {
            return JSON.parse(userData);
        }
        return null;
    } catch (error) {
        console.error("Failed to fetch user:", error);
        return null;
    }
}
