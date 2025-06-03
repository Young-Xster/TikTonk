import { Client, Account, ID, Databases } from "appwrite";

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
    return null;
  }
}

export async function logout() {
  try {
    await account.deleteSession("current");
  } catch (error) {
    console.error("Failed to logout:", error);
    throw error;
  }
}

export async function signup(email, password) {
  const userAccount = await account.create(ID.unique(), email, password);
  await databases.createDocument(
    "683aed5d0031dc5b8244",
    "683b198000065ced36ab",
    ID.unique(),
    {
      Email: email,
      UserId: userAccount.$id,
      Premium: false,
      Name: email.split("@")[0],
    }
  );
  return userAccount;
}
