import { Client, Account, ID, Databases } from "appwrite";
import { get } from "react-native/Libraries/TurboModule/TurboModuleRegistry";

const client = new Client()
    .setEndpoint('https://fra.cloud.appwrite.io/v1') // Your Appwrite Endpoint  
    .setProject('683ae50200343d8107c3') // Your project ID
const databases = new Databases(client);
const account = new Account(client);

export async function signup(email, password) {
    try {
        const userAccount = await account.create(ID.unique(), email, password);
        
        const document = await databases.createDocument(
            '683aed5d0031dc5b8244',
            '683b198000065ced36ab',
            ID.unique(),
            {
                Email: email, 
                UserId: userAccount.$id, 
                Premium: false, 
                Name: email.split('@')[0]
            }
        );
        console.log("User document created:", document);
        const session = await account.createEmailPasswordSession(email, password);
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
        console.log("Platform account created:", document0);
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
        console.log("Platform account created:", document1);
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
        console.log("Platform account created:", document2);
        
    } catch (error) {
        console.error("PlatformsAccountsRegister error:", error);
        throw error;
    }
}