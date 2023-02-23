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

import { Box, Skeleton, Tooltip, Typography } from "@mui/material";
import { Layout } from "plotly.js";
import { CSSProperties, lazy, Suspense, useMemo, useRef } from "react";
import { TaipyBaseProps } from "./utils";

// const Plot = lazy(() => import("react-plotly.js"));

import Plot from "react-plotly.js";
import { TableValueType } from "./utils/tableUtils";

interface ChartProps extends TaipyBaseProps {
    defaultvalue: string;
    render?: boolean;
    hovertext?: string;
    width?: string | number;
    height?: string | number;
    mode?: string;
    type?: string;
    x?: string;
    y?: string;
    title?: string;
}

const defaultStyle = { position: "relative", display: "inline-block" };

const Chart = (props: ChartProps) => {
    const {
        render = true,
        hovertext = "",
        width = "100%",
        height,
        title = "Chart Title",
        x,
        y,
        mode,
        type,
        defaultvalue,
    } = props;
    const style = useMemo(
        () =>
            height === undefined
                ? ({ ...defaultStyle, width: width } as CSSProperties)
                : ({ ...defaultStyle, width: width, height: height } as CSSProperties),
        [width, height]
    );
    const skelStyle = useMemo(() => ({ ...style, minHeight: "7em" }), [style]);
    const data: TableValueType = defaultvalue ? (JSON.parse(decodeURIComponent(defaultvalue)) as TableValueType) : [];
    const columnList = Object.keys(data.at(0) || []);
    if (data.length === 0 || columnList.length < 2) {
        return (
            <>
                <Typography>Invalid data for taipy chart</Typography>
                <Skeleton key="skeleton" sx={skelStyle} />
            </>
        );
    }
    const xCol = x || columnList[0];
    const yCol = y || columnList[1];
    const plotRef = useRef<HTMLDivElement>(null);
    const dataPl: Plotly.Data[] = [
        {
            x: data.map((v) => v[xCol]),
            y: data.map((v) => v[yCol]),
            type: (type as any) || "scatter",
            mode: (mode as any) || "lines+markers",
        },
    ];
    const layout = useMemo(() => {
        return {
            title: title,
            xaxis: {
                title: xCol,
            },
            yaxis: {
                title: yCol,
            },
            clickmode: "event+select",
        } as Layout;
    }, []);
    return render ? (
        <Box id={props.id} key="div" className={props.className} ref={plotRef}>
            <Tooltip title={hovertext}>
                <Suspense fallback={<Skeleton key="skeleton" sx={skelStyle} />}>
                    <Plot data={dataPl} layout={layout} style={style} config={{ staticPlot: true }} />
                </Suspense>
            </Tooltip>
        </Box>
    ) : null;
};

export default Chart;
