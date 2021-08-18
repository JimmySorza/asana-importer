export const convertOptions = (el: any): Aha.FilterValue => {
  return {
    text: el.name,
    value: el.gid,
  };
};
