// filepath: /home/young-xster/codes/repos/TikTonk/Appwrite/appwrite.js
import { Client, Account } from "appwrite";

const client = new Client()
    .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT) 
    .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID);

export const account = new Account(client);

export async function login(email, password) { 
    try {
        const session = await account.createEmailPasswordSession(email, password);
        return session; 
    } catch (error) {
        console.error("Failed to login:", error);
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

export async function logout() {
    try {
        await account.deleteSession('current');
    } catch (error) {
        console.error("Failed to logout:", error);
        throw error;
    }
}