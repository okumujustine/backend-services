import React from "react";
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
      height="500px"
      onChange={(val) => setValue(val ?? "")}
      width="100%"
      defaultLanguage="sql"
      value={value}
      theme={theme === "light" ? "light" : "vs-dark"}
      options={{
        fontFamily: "JetBrains Mono",
        fontSize: 14,
        padding: { top: 50, bottom: 50 },
        autoClosingBrackets: "always",
        autoClosingOvertype: "always",
        autoClosingQuotes: "always",
        language: "sql",
        lineDecorationsWidth: 10,
        overviewRulerBorder: false,
      }}
    />
  );
}
