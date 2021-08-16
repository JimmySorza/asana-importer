const importer = aha.getImporter("jimmy.asana-import.asanaImport");

importer.on({ action: "listCandidates" }, async ({ filters, nextPage }, {identifier, settings}) => {
  return { records: [], nextPage: 2 };
});

//Optional
//importer.on({ action: "listFilters" }, ({}, {identifier, settings}) => {
//  return {
//    filterName: {
//      title: "Filter Name",
//      required: true,
//      type: "text",
//    },
//  };
//});

//Optional
//importer.on({ action: "filterValues" }, async ({ filterName, filters }, {identifier, settings}) => {
//  return [{ text: "Filter Text", value: "Filter Value" }];
//});

//Optional
//importer.on({ action: "renderRecord" }, ({ record, onUnmounted }, { identifier, settings }) => {
//  onUnmounted(() => {
//    console.log("Un-mounting component for", record.identifier);
//  });
//
//  return `${record.identifier} ${record.name}`;
//});

//Optional
//importer.on({ action: "importRecord" }, async ({ importRecord, ahaRecord }, {identifier, settings}) => {
//  //Import record code goes here
//});
