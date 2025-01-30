export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  
  // Format: "Jan 30, 2024"
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}; 