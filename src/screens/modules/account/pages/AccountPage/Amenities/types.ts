export type ItemByCategory = {
  category_name: string;
  category_id: string;
  items: {
    name: string;
    id: string;
  }[];
};

export type ParamProps = {
  unity: string;
};

export type StructureFormObj = {
  [key: string]: string[];
};
