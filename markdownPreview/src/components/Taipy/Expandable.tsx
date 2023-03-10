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

import { ReactNode, useCallback, useEffect, useState } from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { parseBooleanProperty } from "./utils/booleanUtils";

interface ExpandableProps {
    expanded?: string;
    children?: ReactNode;
    defaultvalue?: string;
}

const Expandable = (props: ExpandableProps) => {
    const { expanded = "True", defaultvalue } = props;
    const [opened, setOpened] = useState(parseBooleanProperty(expanded));

    useEffect(() => {
        expanded !== undefined && setOpened(parseBooleanProperty(expanded));
    }, [expanded]);

    const onChange = useCallback(() => setOpened((op) => !op), []);

    return (
        <Accordion expanded={opened} onChange={onChange}>
            {defaultvalue ? <AccordionSummary expandIcon={<ExpandMoreIcon />}>{defaultvalue}</AccordionSummary> : null}
            <AccordionDetails>{props.children}</AccordionDetails>
        </Accordion>
    );
};

export default Expandable;
