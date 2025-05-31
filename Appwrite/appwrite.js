import { Client, Account } from "appwrite";

const client = new Client()
    .setProject('683b198000065ced36ab') // Your project ID

const account = new Account(client);

