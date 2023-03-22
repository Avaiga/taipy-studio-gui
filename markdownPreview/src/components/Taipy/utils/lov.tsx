export interface LovItem {
    id: string;
    label: string;
    img?: string;
    children?: LovItem[];
}