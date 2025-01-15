"use client";

import { useState } from "react";
import { AiPromptDialog } from "./prompt-ai";
import QueryEditor from "./query-editor";
import { Button } from "./ui/button";
import { Sparkle } from "lucide-react";
import { FaPlay } from "react-icons/fa";
import { executeQueryRequest } from "@/server/db/executeQueryRequest";

interface IPlayground {
  onCurrentResponse: (currentValue: string | undefined) => void;
}

const Playground = ({ onCurrentResponse }: IPlayground) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [currenValue, setCurrentValue] = useState("");

  const onGetSqlQueryFormat = (sqlQueryFormat: string) => {
    setCurrentValue(sqlQueryFormat);
  };

  const onExecuteQuery = async () => {
    onCurrentResponse(undefined);
    if (!currenValue) return;

    const resp = await executeQueryRequest(currenValue);
    onCurrentResponse(resp);

    setOpenDialog(false);
  };

  return (
    <div>
      <div className="flex justify-end mb-1">
        <Button className="gap-2 mr-3" onClick={() => setOpenDialog(!openDialog)}>
          <Sparkle className="h-4 w-4" />
          Ask AI
        </Button>
        <Button className="mb-1" onClick={onExecuteQuery}>
          <FaPlay />
          Execute
        </Button>
      </div>
      <AiPromptDialog
        isOpen={openDialog}
        setIsOpen={() => setOpenDialog(!openDialog)}
        onGetSqlQueryFormat={onGetSqlQueryFormat}
      />
      <QueryEditor
        value={currenValue}
        setValue={(value) => {
          setCurrentValue(value);
        }}
      />
    </div>
  );
};

export default Playground;
