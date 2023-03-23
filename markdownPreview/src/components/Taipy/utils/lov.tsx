export interface LovItem {
    id: string;
    label: string;
    img?: string;
    children?: LovItem[];
}

export const getLov = (s: string): LovItem[] | null => {
    const decoded = decodeURIComponent(s);
    // in case data is a string
    if (decoded === s) {
        return s
            ? s.split(";").map((v) => {
                  return { id: v, label: v };
              })
            : null;
    }
    // data should be json
    let data: LovItem[] | null = null;
    try {
        data = JSON.parse(decoded) as LovItem[];
    } catch (e) {}
    return data;
};
