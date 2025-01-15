interface I_Column {
    name: string;
    type: string;
    nullable: boolean;
    isPrimary: boolean;
  }
  
  interface I_Table {
    id: number;
    title: string;
    columns: I_Column[];
  }
  
  interface I_Schema {
    id: number;
    title: string;
    tables: I_Table[];
  }
  