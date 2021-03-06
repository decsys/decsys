export const exportDateFormat = (date) => {
  const formattedDateTime = new Intl.DateTimeFormat("en-GB", {
    // TODO: better locale?
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    timeZone: "UTC",
    timeZoneName: "short",
    hour12: false,
  }).format(date);

  const [formattedDate, timeWithZone] = formattedDateTime.split(", ");
  const [time, tz] = timeWithZone.split(" ");
  return { date: formattedDate, time, tz, flat: formattedDateTime };
};

export const dateTimeOffsetStringComparer = (a, b) => {
  const ad = new Date(a).toISOString();
  const bd = new Date(b).toISOString();

  if (ad === bd) return 0;
  if (ad > bd) return 1;
  return -1;
};
