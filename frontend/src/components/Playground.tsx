"use client";

import { useState } from "react";
import { AiPromptDialog } from "./prompt-ai";
import QueryEditor from "./query-editor";

interface IPlayground {
  onGetCurrentValue: (currentValue: string) => void;
}

const Playground = ({ onGetCurrentValue }: IPlayground) => {
  const [value, setValue] = useState<string | undefined>("");

  const onGetSqlQueryFormat = (sqlQueryFormat: string) => {
    setValue(sqlQueryFormat);
    onGetCurrentValue(sqlQueryFormat)
  };

  return (
    <div>
      <AiPromptDialog onGetSqlQueryFormat={onGetSqlQueryFormat} />
      <QueryEditor
        value={value}
        setValue={(value) => {
          setValue(value);
          onGetCurrentValue(value);
        }}
      />
    </div>
  );
};

export default Playground;
