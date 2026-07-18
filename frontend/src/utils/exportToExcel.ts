import * as XLSX from 'xlsx';

export function exportToExcel(data: any[], fileName: string, sheetName: string = 'Sheet1') {
  if (!data || data.length === 0) {
    console.warn('No data to export');
    return;
  }

  // 1. Convert json to worksheet
  const worksheet = XLSX.utils.json_to_sheet(data);

  // 2. Create workbook and add worksheet
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

  // 3. Export file
  XLSX.writeFile(workbook, `${fileName}.xlsx`);
}
