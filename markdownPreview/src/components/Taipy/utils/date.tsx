export const isDate = (dateString: string): boolean => {
    return Date.parse(dateString) > 0 ? true : false;
};
