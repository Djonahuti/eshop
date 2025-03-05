import { Client, Databases, Storage } from "appwrite";

const client = new Client();
client
  .setEndpoint("https://cloud.appwrite.io/v1") // Adjust if self-hosting
  .setProject(import.meta.env.REACT_APP_APPWRITE_PROJECT_ID);

export const databases = new Databases(client);
export const storage = new Storage(client);
export default client;
