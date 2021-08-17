import { ACCESS_TOKEN, API_URL } from "./config";
import axios from "./axios";

export class AsanaClient {
  static _instance: AsanaClient;
  static _token: IToken;

  constructor() {}

  getProjects = async (options: IGetProjectOptions): Promise<IProject[]> => {
    const {
      data: { data },
    } = await axios().get("/projects", { params: options });
    return data;
  };

  getWorkSpaces = async (): Promise<IWorkSpace[]> => {
    const {
      data: { data },
    } = await axios().get("/workspaces");
    return data;
  };

  getUsers = async (options: IGetUserOptions): Promise<IUser[]> => {
    const {
      data: { data },
    } = await axios().get("/users", { params: options });
    return data;
  };

  getTasks = async (options: IGetTaskOptions): Promise<ITask[]> => {
    const {
      data: { data },
    } = await axios().get("/tasks", { params: options });
    return data;
  };

  static create = async (refresh = false): Promise<AsanaClient> => {
    if (!refresh && AsanaClient._token && AsanaClient._instance) {
      return AsanaClient._instance;
    }

    // const authData = await aha.auth("asana", {
    //   useCachedRetry: true,
    //   parameters: { scope: "offline_access" },
    // });
    // AsanaClient._token = authData.token;
    AsanaClient._token = {
      access_token: ACCESS_TOKEN,
    };

    AsanaClient._instance = new AsanaClient();
    return AsanaClient._instance;
  };
}
