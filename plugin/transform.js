function transform(input) {
  // Helper function to check if a deviation is a static image
  const isStaticImage = (deviation) => {
    // Check if it's a video
    if (deviation.videos && deviation.videos.length > 0) {
      return false;
    }
    
    // Check if it's a Flash animation
    if (deviation.flash) {
      return false;
    }
    
    // Check if it has motion_book (animated content)
    if (deviation.motion_book) {
      return false;
    }
    
    // Check if the URL ends with .gif (animated GIF)
    const imageUrl = deviation.content?.src || 
                     deviation.preview?.src || 
                     deviation.url;
    
    if (imageUrl && imageUrl.toLowerCase().includes('.gif')) {
      // Check if it's actually an animated GIF (most .gif files are animated)
      // You could add additional checks here if needed
      return false;
    }
    
    // Also check thumbs for GIF indicators
    if (deviation.thumbs && Array.isArray(deviation.thumbs)) {
      for (const thumb of deviation.thumbs) {
        if (thumb.src && thumb.src.toLowerCase().includes('.gif')) {
          return false;
        }
      }
    }
    
    return true;
  };

  // Helper function to get multiple random items without duplicates
  const getRandomItems = (arr, count) => {
    // Create a copy and shuffle
    const shuffled = [...arr];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled.slice(0, Math.min(count, arr.length));
  };

  // Helper function to extract deviation data
  const extractDeviationData = (deviation) => {
    return {
      image_url: deviation.content?.src ||
                 deviation.preview?.src ||
                 deviation.url,
      title: deviation.title || "Untitled",
      author: {
        username: deviation.author?.username || "Unknown Artist",
        usericon: deviation.author?.usericon || null
      },
      stats: deviation.stats || { comments: 0, favourites: 0 }
    };
  };

  // Helper function to extract deviations from various response formats
  const extractDeviations = (response) => {
    if (Array.isArray(response) && response.length > 0) {
      return response;
    }
    if (response?.results && Array.isArray(response.results) && response.results.length > 0) {
      return response.results;
    }
    if (response?.deviations && Array.isArray(response.deviations) && response.deviations.length > 0) {
      return response.deviations;
    }
    if (response?.folder?.deviations && Array.isArray(response.folder.deviations) && response.folder.deviations.length > 0) {
      return response.folder.deviations;
    }
    if (response?.deviationid || response?.title) {
      return [response];
    }
    return [];
  };

  // Collect all deviations from all sources
  let allDeviations = [];
  
  // Check input.results (main source)
  if (input.results && Array.isArray(input.results)) {
    allDeviations = [...allDeviations, ...input.results];
  }
  
  // Check IDX_0 through IDX_2
  for (let i = 0; i < 3; i++) {
    const idxKey = `IDX_${i}`;
    const response = input[idxKey];
    
    if (response) {
      const deviations = extractDeviations(response);
      if (deviations.length > 0) {
        allDeviations = [...allDeviations, ...deviations];
      }
    }
  }

  // Filter to only static images
  const staticImages = allDeviations.filter(deviation => isStaticImage(deviation));

  // If we have no static images, return fallback
  if (staticImages.length === 0) {
    return {
      data: [{
        image_url: null,
        title: "No static images available",
        author: {
          username: "Unknown",
          usericon: null
        },
        stats: { comments: 0, favourites: 0 }
      }]
    };
  }

  // Count how many sources we have (only counting those that contributed static images)
  let sourceCount = 0;
  if (input.results && input.results.some(d => isStaticImage(d))) sourceCount++;
  for (let i = 0; i < 3; i++) {
    const response = input[`IDX_${i}`];
    if (response) {
      const deviations = extractDeviations(response);
      if (deviations.some(d => isStaticImage(d))) sourceCount++;
    }
  }
  
  // Calculate target count based on number of sources
  let targetCount;
  if (sourceCount >= 3) {
    targetCount = 30; // 3+ sources: aim for 30 total
  } else if (sourceCount === 2) {
    targetCount = 30; // 2 sources: aim for 30 total
  } else {
    targetCount = 25; // 1 source: aim for 25 total
  }
  
  // Don't try to get more than we have
  targetCount = Math.min(targetCount, staticImages.length);
  
  // Get random unique items from static images
  const selectedDeviations = getRandomItems(staticImages, targetCount);
  
  // Extract the data we need
  const data = selectedDeviations.map(deviation => extractDeviationData(deviation));

  return {
    data: data
  };
}