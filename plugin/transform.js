function transform(input) {
  const itemsPerOrientation = 30;
  const landscapeItems = [];
  for (let i = 0; i < itemsPerOrientation; i++) {
    const randomIndex = Math.floor(Math.random() * input.IDX_0.items.length);
    const item = input.IDX_0.items[randomIndex];
    landscapeItems.push({
      id: item.id,
      url: item.url
    });
  }
  
  // Get 15 random items from portrait array and map to id & url only
  const portraitItems = [];
  for (let i = 0; i < itemsPerOrientation; i++) {
    const randomIndex = Math.floor(Math.random() * input.IDX_1.items.length);
    const item = input.IDX_1.items[randomIndex];
    portraitItems.push({
      id: item.id,
      url: item.url
    });
  }
    
  return { 
    data: {
      landscape_items: landscapeItems,
      portrait_items: portraitItems
    }
  };
}