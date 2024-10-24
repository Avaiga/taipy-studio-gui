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
import {
    CancellationToken,
    CodeAction,
    CodeActionContext,
    CodeActionKind,
    CodeActionProvider,
    Diagnostic,
    ExtensionContext,
    Position,
    Range,
    Selection,
    TextDocument,
    WorkspaceEdit,
    l10n,
    languages,
} from "vscode";

import { DiagnosticCode, PROPERTY_RE } from "./diagnostics";
import { ElementProvider } from "./elementProvider";
import { generateOnFunction, markdownDocumentFilter, pythonDocumentFilter } from "./utils";

export class MarkdownActionProvider implements CodeActionProvider {
    public static readonly providedCodeActionKinds = [CodeActionKind.QuickFix];
    private readonly codeActionMap: Record<
        string,
        (document: TextDocument, diagnostic: Diagnostic) => CodeAction | null
    > = {
        [DiagnosticCode.missCSyntax]: this.createMCSCodeAction,
        [DiagnosticCode.functionNotFound]: this.createFNFCodeAction,
        [DiagnosticCode.invalidPropertyName]: this.createPE02CodeAction,
        [DiagnosticCode.ignoreNegatedValue]: this.createPE03CodeAction,
    };

    static register(context: ExtensionContext): void {
        context.subscriptions.push(
            languages.registerCodeActionsProvider(markdownDocumentFilter, new MarkdownActionProvider(), {
                providedCodeActionKinds: MarkdownActionProvider.providedCodeActionKinds,
            }),
        );
        context.subscriptions.push(
            languages.registerCodeActionsProvider(pythonDocumentFilter, new MarkdownActionProvider(), {
                providedCodeActionKinds: MarkdownActionProvider.providedCodeActionKinds,
            }),
        );
    }

    provideCodeActions(
        document: TextDocument,
        range: Range | Selection,
        context: CodeActionContext,
        token: CancellationToken,
    ): CodeAction[] {
        const codeActions: CodeAction[] = [];
        context.diagnostics.forEach((diagnostic) => {
            const codeAction = this.createCodeAction(document, diagnostic);
            codeAction !== null && codeActions.push(codeAction);
        });
        return codeActions;
    }

    private createCodeAction(document: TextDocument, diagnostic: Diagnostic): CodeAction | null {
        const codeActionGenerator = this.codeActionMap[diagnostic.code as string];
        if (codeActionGenerator !== null) {
            return codeActionGenerator(document, diagnostic);
        }
        return null;
    }

    private createMCSCodeAction(document: TextDocument, diagnostic: Diagnostic): CodeAction {
        const action = new CodeAction(l10n.t("Add closing tag"), CodeActionKind.QuickFix);
        action.diagnostics = [diagnostic];
        action.isPreferred = true;
        action.edit = new WorkspaceEdit();
        const diagnosticText = document.getText(diagnostic.range);
        if (diagnosticText.endsWith("|")) {
            action.edit.insert(document.uri, diagnostic.range.end, ">");
        } else if (diagnosticText.endsWith(">")) {
            action.edit.insert(document.uri, diagnostic.range.end.translate(0, -1), "|");
        } else {
            action.edit.insert(document.uri, diagnostic.range.end, "|>");
        }
        return action;
    }

    private createFNFCodeAction(document: TextDocument, diagnostic: Diagnostic): CodeAction | null {
        const propMatch = PROPERTY_RE.exec(document.getText(diagnostic.range));
        if (!propMatch) {
            return null;
        }
        const onFunctionType = propMatch[2];
        const functionName = propMatch[3];
        const action = new CodeAction(l10n.t("Create function '{0}'", functionName), CodeActionKind.QuickFix);
        const diagnosticPosition = diagnostic.range.end;
        const quotePositions: Position[] = document
            .getText()
            .split(/\r?\n/)
            .reduce<Position[]>((obj: Position[], v: string, i: number) => {
                return [
                    ...obj,
                    ...Array.from(v.matchAll(new RegExp('"""', "g")), (a) => new Position(i, a.index || 0)),
                ];
            }, [])
            .filter(
                (v) =>
                    v.line > diagnosticPosition.line ||
                    (v.line === diagnosticPosition.line && v.character > diagnosticPosition.character),
            );
        action.diagnostics = [diagnostic];
        action.isPreferred = true;
        action.edit = new WorkspaceEdit();
        action.edit.insert(
            document.uri,
            quotePositions.length > 0 ? quotePositions[0].translate(0, 3) : new Position(document.lineCount - 1, 0),
            "\n\n" +
                generateOnFunction(
                    ElementProvider.getOnFunctionSignature()[onFunctionType] || [["state", "State"]],
                    functionName,
                ),
        );
        return action;
    }

    private createPE02CodeAction(document: TextDocument, diagnostic: Diagnostic): CodeAction | null {
        const BESTMATCH_RE = /\'([^']*?)\'\?/;
        const propMatch = BESTMATCH_RE.exec(diagnostic.message);
        if (!propMatch) {
            return null;
        }
        const replaceText = propMatch[1];
        const action = new CodeAction(l10n.t("Replace with '{0}'", replaceText), CodeActionKind.QuickFix);
        action.diagnostics = [diagnostic];
        action.isPreferred = true;
        action.edit = new WorkspaceEdit();
        action.edit.replace(document.uri, diagnostic.range, replaceText);
        return action;
    }

    private createPE03CodeAction(document: TextDocument, diagnostic: Diagnostic): CodeAction | null {
        const action = new CodeAction(l10n.t("Remove negated value"), CodeActionKind.QuickFix);
        action.diagnostics = [diagnostic];
        action.isPreferred = true;
        action.edit = new WorkspaceEdit();
        action.edit.replace(document.uri, diagnostic.range, "");
        return action;
    }
}
