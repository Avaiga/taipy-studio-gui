/*
 * Copyright 2023 Avaiga Private Limited
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 *
 *        http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on
 * an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations under the License.
 */

export type TableValueType = Record<string, any>[];

// Sample Data Format
// const data: TableValueType = [
//     { id: 1, lastName: "Snow", firstName: "Jon", age: 35 },
//     { id: 2, lastName: "Lannister", firstName: null, age: 42 },
// ];

export interface TaipyTableProps {
    defaultvalue: string;
    width?: string;
    height?: string;
    columns?: string;
    pagesize?: number;
}

export interface TaipyPaginatedTableProps extends TaipyTableProps {
    showall?: boolean;
}

export const DEFAULT_CELL_WIDTH = 180;
