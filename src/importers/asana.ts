import { ACCESS_TOKEN } from "./config";
import axios from "./axios";

export class AsanaClient {
  static _instance: AsanaClient;
  static _token: IToken;

  constructor() {}

  getProjects = async (options: IGetProjectOptions): Promise<IProject[]> => {
    try {
      const {
        data: { data },
      } = await axios().get("/projects", { params: options });
      return data;
    } catch (error) {
      this.log("Could not get Projects", error);
      return [];
    }
  };

  getWorkSpaces = async (): Promise<IWorkSpace[]> => {
    try {
      const {
        data: { data },
      } = await axios().get("/workspaces");
      return data;
    } catch (error) {
      this.log("Could not get Workspaces", error);
      return [];
    }
  };

  getUsers = async (options: IGetUserOptions): Promise<IUser[]> => {
    try {
      const {
        data: { data },
      } = await axios().get("/users", { params: options });
      return data;
    } catch (error) {
      this.log("Could not get Users", error);
      return [];
    }
  };

  getTasks = async (options: IGetTaskOptions): Promise<{ data: ITaskCompact[]; next_page: string | null }> => {
    try {
      const {
        data: { data, next_page },
      } = await axios().get("/tasks", { params: { ...options } });
      return { data, next_page };
    } catch (error) {
      this.log("Could not get Tasks", error);
      return { data: [], next_page: null };
    }
  };

  getTask = async (taskId: string): Promise<ITask> => {
    try {
      const {
        data: { data },
      } = await axios().get(`/tasks/${taskId}`);
      return data;
    } catch (error) {
      this.log("Could not get Task", error);
      return null;
    }
  };

  static create = async (token): Promise<AsanaClient> => {
    AsanaClient._token = token;
    AsanaClient._instance = new AsanaClient();
    return AsanaClient._instance;
  };

  log = (msg, error) => {
    console.log(`[Error in Asana API Call] => `, msg, error);
  };
}
