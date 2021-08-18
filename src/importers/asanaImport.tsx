import { AsanaClient } from "./asana";
import { convertOptions } from "./utils";
import { MAX_RESULTS } from "./config";

const importer = aha.getImporter("jimmy.asana-import.asanaImport");

const asanaClient = AsanaClient.create();

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
  }

  return [];
});

importer.on({ action: "listCandidates" }, async ({ filters, nextPage }, { identifier, settings }) => {
  const filterOptions: IGetTaskOptions = {
    project: filters.project,
    limit: MAX_RESULTS,
    ...(nextPage ? { offset: nextPage } : {}),
    ...(filters.assignee ? { assignee: filters.assignee } : {}),
  };

  const { data: tasks, next_page } = await (await asanaClient).getTasks(filterOptions);
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
  const task = await (await asanaClient).getTask(importRecord.uniqueId);
  ahaRecord.description = `${task.notes}<p><a href='${task.permalink_url}'>View on Asana</a></p>` as any;
  await ahaRecord.save();
});
