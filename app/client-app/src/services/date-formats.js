export const exportDateFormat = date =>
  new Intl.DateTimeFormat("en-GB", {
    // TODO: better locale?
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    timeZone: "UTC",
    timeZoneName: "short",
    hour12: false
  }).format(date);
