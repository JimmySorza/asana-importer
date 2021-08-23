import { AsanaClient } from "./asana";
import { convertOptions } from "./utils";
import { MAX_RESULTS } from "./config";

const importer = aha.getImporter("jimmy.asana-import.asanaImport");

async function authenticate(useCache = true) {
  const authData = await aha.auth("asana", { useCachedRetry: true });
  return await AsanaClient.create(authData.token);
}

importer.on({ action: "listFilters" }, async () => {
  const asanaClient = await authenticate();
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
  };
});

importer.on({ action: "filterValues" }, async ({ filterName, filters }): Promise<Aha.FilterValue[]> => {
  const asanaClient = await authenticate();
  switch (filterName) {
    case "workspace": {
      const workspaces = await asanaClient.getWorkSpaces();
      return workspaces.map(convertOptions);
    }
    case "project": {
      const activeWorkSpace = filters.workspace;
      const projects = await asanaClient.getProjects({ workspace: activeWorkSpace });
      return projects.map(convertOptions);
    }
  }

  return [];
});

importer.on({ action: "listCandidates" }, async ({ filters, nextPage }, { identifier, settings }) => {
  const asanaClient = await authenticate();
  const filterOptions: IGetTaskOptions = {
    project: filters.project,
    limit: MAX_RESULTS,
    ...(nextPage ? { offset: nextPage } : {}),
    ...(filters.assignee ? { assignee: filters.assignee } : {}),
  };

  const { data: tasks, next_page } = await asanaClient.getTasks(filterOptions);
  return {
    records: tasks.map(({ gid, name }) => {
      return {
        uniqueId: gid,
        name: name,
      };
    }),
    nextPage: next_page,
  };
});

// Set the record description on import
importer.on({ action: "importRecord" }, async ({ importRecord, ahaRecord }) => {
  const asanaClient = await authenticate();
  const task = await asanaClient.getTask(importRecord.uniqueId);
  ahaRecord.description = `${task.notes}<p><a href='${task.permalink_url}'>View on Asana</a></p>` as any;
  await ahaRecord.save();
});
