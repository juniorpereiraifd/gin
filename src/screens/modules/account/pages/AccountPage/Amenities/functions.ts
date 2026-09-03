import { ItemByCategory } from './types';

type ListType = {
  category_id: string;
  category_name: string;
  name: string;
  id: string;
};

export const ListItemsByCategory = (list: ListType[]) => {
  const categories_ids: string[] = [];
  const items: ItemByCategory[] = [];

  list.forEach(
    (item) =>
      !categories_ids.includes(item.category_id) &&
      categories_ids.push(item.category_id)
  );

  categories_ids.length > 0 &&
    categories_ids.forEach((id) => {
      items.push({
        category_id: id,
        category_name: '',
        items: [],
      });
    });

  items.forEach((itemByCategory) =>
    list.forEach((item) => {
      if (itemByCategory.category_id === item.category_id) {
        itemByCategory.category_name = item.category_name;
        itemByCategory.items.push({ name: item.name, id: item.id });
      }
    })
  );

  return items;
};
