export const parseBooleanProperty = (s: string): boolean => {
    return s.toLowerCase() === "true" ? true : false;
};
