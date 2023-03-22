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

import { useEffect, useMemo, useRef } from "react";
import axios from "axios";

interface ImageProps {
    label?: string;
    width?: string | number;
    height?: string | number;
    defaultvalue?: string;
}

const Image = (props: ImageProps) => {
    const { width = 300, height, defaultvalue = "", label = "" } = props;
    const divRef = useRef<HTMLDivElement>(null);

    const [svg, svgContent, inlineSvg] = useMemo(() => {
        const p = (defaultvalue || "").trim();
        if (p.length > 3) {
            const svgFile = p.substring(p.length - 4).toLowerCase() === ".svg";
            const svgXml = p.substring(0, 4).toLowerCase() === "<svg";
            return [svgFile && defaultvalue, svgXml && defaultvalue, svgFile || svgXml];
        }
        return [undefined, undefined, false];
    }, [defaultvalue]);

    const style = useMemo(
        () => ({
            width: width,
            height: height,
            display: inlineSvg ? "inline-flex" : undefined,
            verticalAlign: inlineSvg ? "middle" : undefined,
        }),
        [width, height, inlineSvg],
    );

    useEffect(() => {
        if (svg) {
            axios.get<string>(svg).then((response) => divRef.current && (divRef.current.innerHTML = response.data));
        } else if (svgContent && divRef.current) {
            divRef.current.innerHTML = svgContent;
        }
    }, [svg, svgContent]);


    return (
        <>
            {inlineSvg ? (
                <div style={style} ref={divRef} title={label}></div>
            ) : (
                <img src={defaultvalue} style={style} alt={label} />
            )}
        </>
    );
};

export default Image;
