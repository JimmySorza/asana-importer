import { AsanaClient } from "./asana";

const importer = aha.getImporter("jimmy.asana-import.asanaImport");

const asanaClient = AsanaClient.create();

const convertOptions = (el: any): Aha.FilterValue => {
  return {
    text: el.name,
    value: el.gid,
  };
};

importer.on({ action: "listFilters" }, async () => {
  return {
    workspace: {
      title: "WorkSpace",
      required: true,
      type: "autocomplete",
    },
    project: {
      title: "Project",
      required: true,
      type: "autocomplete",
    },
    assignee: {
      title: "Assignee",
      required: false,
      type: "autocomplete",
    },
  };
});

importer.on({ action: "filterValues" }, async ({ filterName, filters }): Promise<Aha.FilterValue[]> => {
  switch (filterName) {
    case "workspace": {
      const workspaces = await (await asanaClient).getWorkSpaces();
      return workspaces.map(convertOptions);
    }
    case "project": {
      const activeWorkSpace = filters.workspace;
      const projects = await (await asanaClient).getProjects({ workspace: activeWorkSpace });
      return projects.map(convertOptions);
    }
    case "assignee": {
      const activeWorkSpace = filters.workspace;
      const users = await (await asanaClient).getUsers({ workspace: activeWorkSpace });
      return users.map(convertOptions);
    }
  }

  return [];
});
