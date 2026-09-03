type ReportDataValid = object | any[] | string | number;

export const isReportDataValid = (data: any): data is ReportDataValid => {
  if (data === null || data === undefined) {
    return false;
  }

  if (typeof data === 'string') {
    return data.trim().length > 0;
  }

  if (Array.isArray(data)) {
    return data.length > 0;
  }

  if (typeof data === 'object') {
    return Object.keys(data).length > 0;
  }

  if (typeof data === 'number') {
    return true;
  }

  return false;
};