import dayjs from 'dayjs';

export const getDateString = (date: string | Date): string =>
  dayjs(date).format('DD MMM YYYY');

export const getDateTimeString = (dateString: string | Date): string =>
  dayjs(dateString).format('MMM, DD, hh:mm A');

export const getFileTimeStampS = (dateString?: string | Date): string =>
  dayjs(dateString).format('YYYYMMDD_HHMM');
