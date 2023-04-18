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
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import { useMemo } from "react";
import { useSessionStorage } from "usehooks-ts";

import { LovImage, LovProps, getLov } from "./utils/lov";

const boxSx = { borderBottom: 1, borderColor: "divider", width: "fit-content" };

const NavBar = (props: LovProps) => {
    const lov = getLov(props.lov || "") || [];
    const [baseHref, _] = useSessionStorage("baseHref", "");

    const selectedVal = useMemo(
        () => lov.find((it) => baseHref.includes(it.id))?.id || (lov.length ? lov[0].id : false),
        [baseHref],
    );

    return (
        <Box sx={boxSx}>
            <Tabs value={selectedVal}>
                {lov.map((val) => (
                    <Tab
                        style={{ textDecoration: "none" }}
                        component="a"
                        href={val.id}
                        data-href={val.id}
                        title={val.id}
                        key={val.id}
                        value={val.id}
                        label={!val.img ? val.label : <LovImage item={{ path: val.img, text: val.label }} />}
                    />
                ))}
            </Tabs>
        </Box>
    );
};

export default NavBar;
