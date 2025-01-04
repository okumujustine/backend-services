"use client";
import Editor, { useMonaco } from "@monaco-editor/react";
import { useTheme } from "next-themes";
import { useState } from "react";
// import { FaPlay, FaPlus, FaTimes } from "react-icons/fa";

type TStringOrUndefined = string | undefined;

const Playground = () => {
  const { theme } = useTheme()

  const [tabs, setTabs] = useState([{ id: 1, title: "Query 1", code: "" }]);
  const [activeTab, setActiveTab] = useState(1);

  const onChangeEditor = (value: TStringOrUndefined) => {
    if (value !== undefined) {
      setTabs((prevTabs) =>
        prevTabs.map((tab) =>
          tab.id === activeTab ? { ...tab, code: value } : tab
        )
      );
    }
  };


  return (
    <Editor
      className="p-3 border border-gray-300 rounded-lg"
      height="500px"
      onChange={onChangeEditor}
      width="100%"
      defaultLanguage="sql"
      value={tabs.find((tab) => tab.id === activeTab)?.code || ""}
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
};

export default Playground;
