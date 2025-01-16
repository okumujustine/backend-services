import React from "react";
// import { LanguageIdEnum } from 'monaco-sql-languages';

import Editor from "@monaco-editor/react";
import { useTheme } from "next-themes";

interface IQueryEditorProps {
  value: string | undefined;
  setValue: (value: string) => void;
}

export default function QueryEditor({ value, setValue }: IQueryEditorProps) {
  const { theme } = useTheme();

  return (
    <Editor
      height="400px"
      onChange={(val) => setValue(val ?? "")}
      width="100%"
      language="pgsql"
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
    />
  );
}
