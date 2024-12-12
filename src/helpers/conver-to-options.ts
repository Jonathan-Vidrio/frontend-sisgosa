/**
 * @module convertToOptions
 * @description Converts an array of data into an array of options for dropdowns or selects
 *
 * @param {Object} params - Parameters for the conversion
 * @param {any[]} params.data - Array of data to convert
 * @param {boolean} [params.withAll=true] - Whether to include an "All" option
 *
 * @returns {Array<{key: string, value: string}>} Array of options
 *
 * @example
 * const options = convertToOptions({ data: [{ description: 'option1' }, { description: 'option2' }] });
 */
export const convertToOptions = ({ data, withAll = true }: { data: any[]; withAll?: boolean }) => {
  let options = [];
  if (withAll) options.push({ key: '', value: 'All' });

  return [
    ...options,
    ...data.map(item => ({
      key: item.description,
      value: item.description.charAt(0).toUpperCase() + item.description.slice(1),
    })),
  ];
};
