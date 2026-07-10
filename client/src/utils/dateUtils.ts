import { format } from 'date-fns';

/**
 * Formats an ISO date string while preserving its exact calendar date, 
 * avoiding timezone offset shifts that could change the day (e.g., UTC midnight -> previous day 8 PM).
 */
export const formatLocalDate = (dateString: string | undefined | null, formatStr: string = 'MMM d, yyyy') => {
  if (!dateString) return '';
  
  try {
    const datePart = dateString.split('T')[0];
    const [year, month, day] = datePart.split('-');
    const date = new Date(Number(year), Number(month) - 1, Number(day));
    return format(date, formatStr);
  } catch (e) {
    // Fallback if parsing fails
    return format(new Date(dateString), formatStr);
  }
};
