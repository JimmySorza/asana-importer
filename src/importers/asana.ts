import axios from "./axios";

export class AsanaClient {
  static _instance: AsanaClient;
  static _token: string;

  constructor() {}

  reAuth = async (callBack) => {
    const authData = await aha.auth("asana", {});
    AsanaClient._token = authData.token;
    return await callBack();
  };

  getProjects = async (options: IGetProjectOptions): Promise<IProject[]> => {
    try {
      const {
        data: { data },
      } = await axios(AsanaClient._token).get("/projects", { params: options });
      return data;
    } catch (error) {
      this.log("Could not get Projects", error);
      return await this.reAuth(async () => await this.getProjects(options));
    }
  };

  getWorkSpaces = async (): Promise<IWorkSpace[]> => {
    try {
      const {
        data: { data },
      } = await axios(AsanaClient._token).get("/workspaces");
      return data;
    } catch (error) {
      this.log("Could not get Workspaces", error);
      return await this.reAuth(async () => await this.getWorkSpaces());
    }
  };

  getUsers = async (options: IGetUserOptions): Promise<IUser[]> => {
    try {
      const {
        data: { data },
      } = await axios(AsanaClient._token).get("/users", { params: options });
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
      } = await axios(AsanaClient._token).get("/tasks", { params: { ...options } });
      return { data, next_page };
    } catch (error) {
      this.log("Could not get Tasks", error);
      return await this.reAuth(async () => await this.getTasks(options));
    }
  };

  getTask = async (taskId: string): Promise<ITask> => {
    try {
      const {
        data: { data },
      } = await axios(AsanaClient._token).get(`/tasks/${taskId}`);
      return data;
    } catch (error) {
      this.log("Could not get Task", error);
      return await this.reAuth(async () => await this.getTask(taskId));
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
