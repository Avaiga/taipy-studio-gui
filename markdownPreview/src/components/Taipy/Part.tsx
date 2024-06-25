/*
 * Copyright 2024 Avaiga Private Limited
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
import Box from "@mui/material/Box";
import { ReactNode } from "react";

import { parseBooleanProperty } from "./utils/booleanUtils";

interface PartProps {
    render?: string;
    children?: ReactNode;
}

const Part = (props: PartProps) => {
    const { render = "True", children } = props;

    return parseBooleanProperty(render) ? <Box>{children}</Box> : null;
};

export default Part;
