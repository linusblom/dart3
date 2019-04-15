export const generateId = (prefix: string) => {
  let id = `${prefix}-`;
  const chars = '0123456789abcdef';
  for (let i = 0; i < 10; i++) {
    id += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return id;
};
