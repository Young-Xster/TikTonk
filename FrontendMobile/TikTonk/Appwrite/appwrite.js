import { Account, Client, Databases, ID } from "appwrite";

const client = new Client()
  .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT)
  .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID);
const databases = new Databases(client);
const account = new Account(client);

export async function signup(email, password) {
  try {
    const userAccount = await account.create(ID.unique(), email, password);

    const document = await databases.createDocument(
      import.meta.env.DATABASE_CoLLECTION_ID1,
      import.meta.env.DATABASE_CoLLECTION_ID2,
      ID.unique(),
      {
        Email: email,
        UserId: userAccount.$id,
        Premium: false,
        Name: email.split("@")[0],
      }
    );
    console.log("User document created:", document);
    return userAccount;
  } catch (error) {
    console.error("Signup error:", error);
    throw error;
  }
}
