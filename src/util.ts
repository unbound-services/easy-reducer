export const isObject = (item: any) => {
  return (
    item && typeof item === "object" && !Array.isArray(item) && item !== null
  );
};
