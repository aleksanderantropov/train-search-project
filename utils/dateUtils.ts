// Date and time formatting utilities

export const formatDateTime = (isoString: string) => {
  const date = new Date(isoString);
  const dateStr = date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
  const timeStr = date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
  return { date: dateStr, time: timeStr };
};

export const formatDateHeader = (isoString: string): string => {
  const date = new Date(isoString);
  return date.toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
  });
};

export const formatDuration = (seconds: number) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  if (hours > 0 && minutes > 0) {
    return `${hours} ч ${minutes} м`;
  } else if (hours > 0) {
    return `${hours} ч`;
  } else {
    return `${minutes} м`;
  }
};

export const isNextDaySegment = (
  departureIsoString: string,
  searchDateIsoString: string
): boolean => {
  const departureDate = new Date(departureIsoString);
  const searchDate = new Date(searchDateIsoString);

  const searchYear = searchDate.getFullYear();
  const searchMonth = searchDate.getMonth();
  const searchDay = searchDate.getDate();

  const depYear = departureDate.getFullYear();
  const depMonth = departureDate.getMonth();
  const depDay = departureDate.getDate();

  const isDayAfter =
    depYear === searchYear &&
    depMonth === searchMonth &&
    depDay === searchDay + 1;

  const hours = departureDate.getHours();
  return isDayAfter && hours >= 0 && hours < 3;
};