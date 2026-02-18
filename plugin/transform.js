function transform(input) {
  // Helper function to get random item from array
  const getRandomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];

  // Handle array response (most common)
  if (Array.isArray(input) && input.length > 0) {
    const deviation = getRandomItem(input);

    const image_url = deviation.content?.src ||
                      deviation.preview?.src ||
                      deviation.url;

    return {
      data: {
        image_url: image_url,
        title: deviation.title || "Untitled",
        author: deviation.author || { username: "Unknown Artist" },
        stats: deviation.stats || { comments: 0, favourites: 0 }
      }
    };
  }

  if (input?.results && Array.isArray(input.results) && input.results.length > 0) {
    const deviation = getRandomItem(input.results);

    return {
      data: {
        image_url: deviation.content?.src || deviation.preview?.src || deviation.url,
        title: deviation.title || "Untitled",
        author: deviation.author || { username: "Unknown Artist" },
        stats: deviation.stats || { comments: 0, favourites: 0 }
      }
    };
  }

  // Handle object with deviations array (like daily deviations)
  if (input?.deviations && Array.isArray(input.deviations) && input.deviations.length > 0) {
    const deviation = getRandomItem(input.deviations);

    return {
      data: {
        image_url: deviation.content?.src || deviation.preview?.src || deviation.url,
        title: deviation.title || "Untitled",
        author: deviation.author || { username: "Unknown Artist" },
        stats: deviation.stats || { comments: 0, favourites: 0 }
      }
    };
  }

  // Handle single deviation object
  if (input?.deviationid || input?.title) {
    return {
      data: {
        image_url: input.content?.src || input.preview?.src || input.url,
        title: input.title || "Untitled",
        author: input.author || { username: "Unknown Artist" },
        stats: input.stats || { comments: 0, favourites: 0 }
      }
    };
  }

  // Handle gallery folder responses
  if (input?.folder?.deviations && Array.isArray(input.folder.deviations) && input.folder.deviations.length > 0) {
    const deviation = getRandomItem(input.folder.deviations);

    return {
      data: {
        image_url: deviation.content?.src || deviation.preview?.src || deviation.url,
        title: deviation.title || "Untitled",
        author: deviation.author || { username: "Unknown Artist" },
        stats: deviation.stats || { comments: 0, favourites: 0 }
      }
    };
  }

  // Fallback for empty responses
  return {
    data: {
      image_url: null,
      title: "No artwork available",
      author: { username: "Unknown", usericon: null },
      stats: { comments: 0, favourites: 0 }
    }
  };
}