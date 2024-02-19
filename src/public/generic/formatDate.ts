export function formatDateMonthAndYear(date: Date): string {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long',
    };
  
    const formatter = new Intl.DateTimeFormat('en-US', options);
    return formatter.format(date);
  }