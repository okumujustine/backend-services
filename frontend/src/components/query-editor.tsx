import React, { useEffect } from "react";
// import { LanguageIdEnum } from 'monaco-sql-languages';

import Editor, { useMonaco } from "@monaco-editor/react";
import { useTheme } from "next-themes";
import { IDisposable } from "monaco-editor";

interface IQueryEditorProps {
  value: string | undefined;
  setValue: (value: string) => void;
}

export default function QueryEditor({ value, setValue }: IQueryEditorProps) {
  const { theme } = useTheme();

  const monaco = useMonaco();

  // const handleEditorMount = (editor, monaco) => {
  //   monaco.languages.registerCompletionItemProvider('sql', {
  //     triggerCharacters: [' ', '.'],

  //     provideCompletionItems: (model, position): IDisposable => {
  //       const suggestions = [
  //         {
  //           label: 'SELECT',
  //           kind: monaco.languages.CompletionItemKind.Keyword,
  //           insertText: 'SELECT',
  //           documentation: 'SQL SELECT statement template'
  //         },
  //         {
  //           label: 'INSERT',
  //           kind: monaco.languages.CompletionItemKind.Keyword,
  //           insertText: 'INSERT INTO ',
  //           documentation: 'SQL INSERT statement template'
  //         }
  //       ];

  //       return { suggestions };
  //     },
  //     resolveCompletionItem: (item: any) => {
  //       return item;
  //     }
  //   });
  // };


  return (
    <Editor
      height="400px"
      onChange={(val) => setValue(val ?? "")}
      width="100%"
      language="sql"
      value={value}
      theme={
        theme === "light" ? "light" : "vs-dark"
      }
      options={{
        fontFamily: "JetBrains Mono",
        fontSize: 14,
        padding: { top: 50, bottom: 50 },
        autoClosingBrackets: "always",
        autoClosingOvertype: "always",
        autoClosingQuotes: "always",
        lineDecorationsWidth: 10,
        overviewRulerBorder: false,
        tabCompletion: "on",
        autoIndent: "advanced",
      }}
      // onMount={handleEditorMount}
    />
  );
}
