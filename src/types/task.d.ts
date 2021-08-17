declare interface ITask {
  gid: string;
  resource_type: "task";
  name: string;
}

declare interface IGetTaskOptions {
  workspace: string;
  project: string;
  assignee: string;
}
