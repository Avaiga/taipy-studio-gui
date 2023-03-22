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

import { useCallback, useEffect, useRef, useState } from "react";
import Button from "@mui/material/Button";
import LinearProgress from "@mui/material/LinearProgress";
import UploadFile from "@mui/icons-material/UploadFile";

interface FileSelectorProps {
    label?: string;
    dropmessage?: string;
}

const handleDragOver = (evt: DragEvent) => {
    evt.stopPropagation();
    evt.preventDefault();
    evt.dataTransfer && (evt.dataTransfer.dropEffect = "copy");
};

const defaultSx = { minWidth: "0px" };

const FileSelector = (props: FileSelectorProps) => {
    const { dropmessage = "Drop here to Upload", label = "" } = props;
    const butRef = useRef<HTMLElement>(null);
    const [dropLabel, setDropLabel] = useState("");
    const [dropSx, setDropSx] = useState(defaultSx);

    const handleDragLeave = useCallback(() => {
        setDropLabel("");
        setDropSx(defaultSx);
    }, []);

    const handleDragOverWithLabel = useCallback(
        (evt: DragEvent) => {
            const target = evt.currentTarget as HTMLElement;
            setDropSx((sx) =>
                sx.minWidth === defaultSx.minWidth && target ? { minWidth: target.clientWidth + "px" } : sx,
            );
            setDropLabel(dropmessage);
            handleDragOver(evt);
        },
        [dropmessage],
    );

    useEffect(() => {
        const butElt = butRef.current;
        const thisHandleDrop = () => {
            setDropLabel("");
            setDropSx(defaultSx);
        };
        if (butElt) {
            butElt.addEventListener("dragover", handleDragOverWithLabel);
            butElt.addEventListener("dragleave", handleDragLeave);
            butElt.addEventListener("drop", thisHandleDrop);
        }
        return () => {
            if (butElt) {
                butElt.removeEventListener("dragover", handleDragOverWithLabel);
                butElt.removeEventListener("dragleave", handleDragLeave);
                butElt.removeEventListener("drop", thisHandleDrop);
            }
        };
    }, [handleDragLeave, handleDragOverWithLabel]);

    return (
        <label>
            <input style={{ display: "none" }} name="upload-file" type="file" accept={".csv,.xlsx"} multiple={true} />
            <Button component="span" aria-label="upload" variant="outlined" sx={dropSx} ref={butRef}>
                <UploadFile /> {dropLabel || label}
            </Button>
        </label>
    );
};

export default FileSelector;
