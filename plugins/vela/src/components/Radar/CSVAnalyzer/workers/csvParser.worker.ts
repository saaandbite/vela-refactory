import Papa from 'papaparse';

self.addEventListener('message', (e: MessageEvent) => {
  const { file, action } = e.data;

  if (action === 'parse') {
    Papa.parse(file, {
      complete: (results) => {
        const headers = results.data[0] as string[];
        const rows = results.data.slice(1) as any[][];
        
        self.postMessage({
          success: true,
          data: {
            headers,
            rows: rows.filter(row => row.some(cell => cell !== '')),
            rowCount: rows.length,
          },
        });
      },
      error: (error) => {
        self.postMessage({
          success: false,
          error: error.message,
        });
      },
      skipEmptyLines: true,
    });
  }
});

export {};
