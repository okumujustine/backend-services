"use client";

import { AiPromptDialog } from "./prompt-ai";
// import 'monaco-sql-languages/esm/languages/pgsql/pgsql.contribution';
import QueryEditor from "./query-editor";
// import PromptAi from './prompt-ai';


const Playground = ({ value, setValue }: any) => {
  return (
    <div>
      <AiPromptDialog />
      <QueryEditor value={value} setValue={setValue}  />
    </div>
  );
};

export default Playground;
