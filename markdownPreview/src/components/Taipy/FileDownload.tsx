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

import Button from "@mui/material/Button";
import FileDownloadIco from "@mui/icons-material/FileDownload";
import { parseBooleanProperty } from "./utils/booleanUtils";

interface FileDownloadProps {
    label?: string;
    render?: string;
}

const FileDownload = (props: FileDownloadProps) => {
    const { render = "true", label = "" } = props;

    return parseBooleanProperty(render) ? (
        <label>
            <Button variant="outlined" aria-label="download">
                <FileDownloadIco /> {label}
            </Button>
        </label>
    ) : null;
};

export default FileDownload;
