import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const exportToCSV = (data, filename = 'export') => {
  const headers = Object.keys(data[0] || {}).join(',');
  const rows = data.map(row => Object.values(row).join(',')).join('\n');
  const csv = `${headers}\n${rows}`;
  
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${filename}.csv`;
  a.click();
  window.URL.revokeObjectURL(url);
};

export const exportToExcel = (data, filename = 'export') => {
  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
  XLSX.writeFile(wb, `${filename}.xlsx`);
};

export const exportToPDF = (data, columns, filename = 'export') => {
  const doc = new jsPDF();
  
  doc.setFontSize(18);
  doc.text('Nyle Travel Report', 14, 22);
  doc.setFontSize(11);
  doc.setTextColor(100);
  doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 30);

  autoTable(doc, {
    head: [columns.map(col => col.label)],
    body: data.map(row => columns.map(col => row[col.key])),
    startY: 40,
    styles: { fontSize: 8 },
    headStyles: { fillColor: [14, 165, 233] },
  });

  doc.save(`${filename}.pdf`);
};