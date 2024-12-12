export const onlyNumbers = (input: string) => {
  const value = input.trim();

  if (value.length > 18) {
    return value.substring(0, 18).replace(/[^0-9]/g, '');
  }

  return value.replace(/[^0-9]/g, '');
};
