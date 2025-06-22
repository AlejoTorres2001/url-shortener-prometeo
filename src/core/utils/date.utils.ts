/* eslint-disable @typescript-eslint/no-unused-vars */
export class DateUtils {
  /**
   * Formats a given date into ISO format with UTC timezone using Intl API.
   * @param date The date to be formatted
   * @returns Formatted date string in UTC.
   */
  static formatDateToUTC(date: Date): string {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZoneName: 'short',
      timeZone: 'UTC',
    }).format(date);
  }

  static formatTimestamp(timestamp: any): string {
    if (timestamp instanceof Date) {
      return timestamp.toISOString();
    } else if (typeof timestamp === 'string') {
      // Try to parse string to date
      try {
        return new Date(timestamp).toISOString();
      } catch (e) {
        return timestamp; // Return original if parsing fails
      }
    } else if (typeof timestamp === 'number') {
      // Handle numeric timestamp
      try {
        return new Date(timestamp).toISOString();
      } catch (e) {
        return String(timestamp);
      }
    }
    // Default fallback
    return timestamp ? String(timestamp) : '';
  }
}
