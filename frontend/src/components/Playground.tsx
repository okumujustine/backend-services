"use client";
import Editor, { useMonaco } from "@monaco-editor/react";
import { useState } from "react";
import { FaPlay, FaPlus, FaTimes } from "react-icons/fa";

type TStringOrUndefined = string | undefined;
const Playground = () => {
  const [tabs, setTabs] = useState([{ id: 1, title: "Query 1", code: "" }]);
  const [activeTab, setActiveTab] = useState(1);
  const [result, setResult] = useState<any[]>([]);

  const onChangeEditor = (value: TStringOrUndefined) => {
    if (value !== undefined) {
      setTabs((prevTabs) =>
        prevTabs.map((tab) =>
          tab.id === activeTab ? { ...tab, code: value } : tab
        )
      );
    }
  };

  const runQuery = () => {
    // Simulate running the query and getting a result
    const queryResult = [
      { id: 1, name: "John Doe", age: 30 },
      { id: 2, name: "Jane Smith", age: 25 },
    ]; // Example result
    setResult(queryResult);
  };

  const addTab = () => {
    const newTabId = tabs.length ? tabs[tabs.length - 1].id + 1 : 1;
    setTabs([...tabs, { id: newTabId, title: `Query ${newTabId}`, code: "" }]);
    setActiveTab(newTabId);
  };

  const removeTab = (id: number) => {
    setTabs(tabs.filter((tab) => tab.id !== id));
    if (activeTab === id && tabs.length > 1) {
      setActiveTab(tabs[0].id);
    }
  };

  return (
    <div className="flex flex-col gap-6 p-6 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center">
        <div className="flex space-x-2">
          {tabs.map((tab) => (
            <div
              key={tab.id}
              className={`flex items-center px-4 py-2 rounded-t-md cursor-pointer ${
                tab.id === activeTab
                  ? "bg-blue-600 text-white"
                  : "bg-gray-300 text-gray-700"
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.title}
              <FaTimes
                className="ml-2 text-sm"
                onClick={(e) => {
                  e.stopPropagation();
                  removeTab(tab.id);
                }}
              />
            </div>
          ))}
          <button
            className="flex items-center px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
            onClick={addTab}
          >
            <FaPlus className="mr-2" /> Add Query
          </button>
        </div>
        <button
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          onClick={runQuery}
        >
          <FaPlay className="mr-2" /> Run Query
        </button>
      </div>
      <div className="border border-gray-300 rounded-md overflow-hidden shadow-lg p-4 bg-white">
        <Editor
          onChange={onChangeEditor}
          height="50vh"
          defaultLanguage="sql"
          defaultValue={tabs.find((tab) => tab.id === activeTab)?.code || ""}
          theme="vs-dark"
          options={{
            fontSize: 16,
            insertSpaces: true,
            acceptSuggestionOnCommitCharacter: true,
            acceptSuggestionOnEnter: "on",
            accessibilitySupport: "auto",
            autoIndent: "none",
            automaticLayout: true,
            codeLens: true,
            colorDecorators: true,
            contextmenu: true,
            cursorBlinking: "blink",
            cursorSmoothCaretAnimation: "off",
            cursorStyle: "line",
            disableLayerHinting: false,
            disableMonospaceOptimizations: false,
            dragAndDrop: false,
            fixedOverflowWidgets: false,
            folding: true,
            foldingStrategy: "auto",
            fontLigatures: false,
            formatOnPaste: false,
            formatOnType: false,
            hideCursorInOverviewRuler: false,
            links: true,
            mouseWheelZoom: false,
            multiCursorMergeOverlapping: true,
            multiCursorModifier: "alt",
            overviewRulerBorder: true,
            overviewRulerLanes: 2,
            quickSuggestions: true,
            quickSuggestionsDelay: 100,
            readOnly: false,
            renderControlCharacters: false,
            renderFinalNewline: "on",
            renderLineHighlight: "all",
            renderWhitespace: "none",
            revealHorizontalRightPadding: 30,
            roundedSelection: true,
            rulers: [],
            scrollBeyondLastColumn: 5,
            scrollBeyondLastLine: true,
            selectOnLineNumbers: true,
            selectionClipboard: true,
            selectionHighlight: true,
            showFoldingControls: "mouseover",
            smoothScrolling: false,
            suggestOnTriggerCharacters: true,
            wordBasedSuggestions: "off",
            wordSeparators: "~!@#$%^&*()-=+[{]}|;:'\",.<>/?",
            wordWrap: "off",
            wordWrapBreakAfterCharacters: "\t})]?|&,;",
            wordWrapBreakBeforeCharacters: "{([+",
            wordWrapColumn: 80,
            wrappingIndent: "none",
          }}
        />
      </div>
      <div className="border border-gray-300 rounded-md p-4 bg-white shadow-lg">
        <h3 className="text-lg font-semibold text-gray-800">Query Result:</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                {result.length > 0 &&
                  Object.keys(result[0]).map((key) => (
                    <th
                      key={key}
                      className="py-2 px-4 border-b border-gray-200 bg-gray-100 text-left text-sm font-semibold text-gray-700"
                    >
                      {key}
                    </th>
                  ))}
              </tr>
            </thead>
            <tbody>
              {result.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {Object.values(row).map((value, colIndex) => (
                    <td
                      key={colIndex}
                      className="py-2 px-4 border-b border-gray-200 text-sm text-gray-700"
                    >
                      {value}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Playground;
