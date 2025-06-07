import { Client, Account, ID, Databases, Query } from "appwrite";

const client = new Client()
  .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT)
  .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID);

export const account = new Account(client);
export const databases = new Databases(client);

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

export async function getUserDocuments(UserId) {
  try {
    const response = await databases.listDocuments(
      "683aed5d0031dc5b8244",
      "683b198000065ced36ab",
      [Query.equal("UserId", UserId)]
    );
    return response.documents[0] || null;
  } catch (error) {
    console.error("Failed to get user documents:", error);
    throw error;
  }
}

export async function getUserStats(UserId) {
  try {
    const response = await databases.listDocuments(
      "683aed5d0031dc5b8244",
      "683b238b001527416907",
      [Query.equal("UserId", UserId)]
    );
    return response.documents[0] || null;
  } catch (error) {
    console.error("Failed to get user stats:", error);
    throw error;
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
