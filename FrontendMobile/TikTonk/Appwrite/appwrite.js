import { Client, Account, ID, Databases } from "appwrite";

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
        return userAccount;
    } catch (error) {
        console.error("Signup error:", error);
        throw error;
    }
}
