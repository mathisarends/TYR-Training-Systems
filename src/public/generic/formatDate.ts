export function formatDateMonthAndYear(date: Date): string {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long',
    };
  
    const formatter = new Intl.DateTimeFormat('en-US', options);
    return formatter.format(date);
  }

  export function formatCustomDate(inputDate: Date): string {
    const options : Intl.DateTimeFormatOptions = { day: '2-digit', month: 'long', hour: '2-digit', minute: '2-digit' };

    // Formatieren Sie das Datum mithilfe der Intl.DateTimeFormat API
    const formattedDate = new Intl.DateTimeFormat('de-DE', options).format(inputDate);

    return formattedDate;
}