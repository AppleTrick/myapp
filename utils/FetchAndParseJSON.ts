export const fetchAndParseJSON = async (url: string): Promise<any[]> => {
  const response = await fetch(url);
  const json = await response.json();
  const items = json.response.body.items.item;

  return items;
};
