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

import { Box, Skeleton, Tooltip } from "@mui/material";
import { lazy, Suspense } from "react";
import { TaipyBaseProps } from "./utils";

const Plot = lazy(() => import("react-plotly.js"));

interface ChartProps extends TaipyBaseProps {
    render?: boolean;
    hoverText?: string;
    testId?: string;
}

const Chart = (props: ChartProps) => {
    const { render, hoverText } = props;
    return render ? (
        <Box id={props.id} key="div" data-testid={props.testId} className={props.className} ref={plotRef}>
            <Tooltip title={hoverText || ""}>
                <Suspense fallback={<Skeleton key="skeleton" sx={skelStyle} />}>
                    <Plot data={dataPl} layout={layout} style={style} config={plotConfig} />
                </Suspense>
            </Tooltip>
        </Box>
    ) : null;
};

export default Chart;
