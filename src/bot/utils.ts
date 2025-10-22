export function getDaysRemainingInMonth() {
  const avui = new Date();
  const ultimDiaMes = new Date(
    avui.getFullYear(),
    avui.getMonth() + 1,
    0,
  ).getDate();
  const diesRestants = ultimDiaMes - avui.getDate();

  return diesRestants;
}

export function getCurrentMonth(): number {
  const now = new Date();
  return now.getMonth() + 1;
}

export function isSummerTime() {
  const now = new Date();
  // Get the timezone offset for Spain at the current time
  const formatter = new Intl.DateTimeFormat("en", {
    timeZone: "Europe/Madrid",
    timeZoneName: "longOffset",
  });
  const parts = formatter.formatToParts(now);
  const offset = parts.find((part) => part.type === "timeZoneName")?.value;

  // Summer time: GMT+02:00, Winter time: GMT+01:00
  return offset === "GMT+02:00";
}

export function getSpainDateFromUTC(date: string) {
  // Convert UTC date to Spain date
  const utcDate = new Date(date);
  const hoursToAdd = isSummerTime() ? 2 : 1;
  return new Date(utcDate.getTime() + hoursToAdd * 60 * 60 * 1000);
}

export function getPoints(message: string) {
  // Message format is "mooot 123\n🎯3/6\n⏳00:00:00\n"
  const tries = message.split("\n")[1]?.replace("🎯", "").split("/")[0].trim();

  if (tries === "X") return 0;

  const points = 6 - parseInt(tries);

  return points + 1;
}

export function getTime(message: string) {
  // Message format is "mooot 123\n🎯3/6\n⏳hh:mm:ss (or mm:ss) \n"
  const time = message.split("\n")[2]?.replace("⏳", "").trim();

  console.log("time: " + time);

  if (!time || time.trim() === "") return 0;

  const parts = time.split(":").map(Number);

  if (parts.some((value) => Number.isNaN(value))) return 0;

  const totalSeconds = parts.length === 3
    ? parts[0] * 3600 + parts[1] * 60 + parts[2]
    : parts.length === 2
    ? parts[0] * 60 + parts[1]
    : parts[0];

  return totalSeconds;
}

export function getPointsForHability(hability: number) {
  const normalizedHability = hability / 10;
  const rand = Math.random();

  // 10% chance for unexpected results
  if (rand < 0.1) {
    // Complete random result for variability
    return Math.floor(Math.random() * 7); // 0-6 points completely random
  }

  const normalizedAction = normalizedHability * 0.7 + rand * 0.3;

  if (normalizedAction < 0.1) {
    return 0;
  } else if (normalizedAction < 0.3) {
    return 1;
  } else if (normalizedAction < 0.5) {
    return 2;
  } else if (normalizedAction < 0.7) {
    return 3;
  } else if (normalizedAction < 0.9) {
    return 4;
  } else if (normalizedAction < 0.98) {
    return 5;
  } else {
    return 6;
  }
}

export function getTimeForHability(hability: number) {
  const normalizedHability = hability / 10;
  const rand = Math.random();
  const normalizedAction = normalizedHability * 0.7 + rand * 0.3;

  let baseTime = 0;

  if (normalizedAction < 0.1) {
    baseTime = Math.floor(Math.random() * 27000) + 9000; // 2.5h to 10h
  } else if (normalizedAction < 0.3) {
    baseTime = Math.floor(Math.random() * 18000) + 3600; // 1h to 6h
  } else if (normalizedAction < 0.5) {
    baseTime = Math.floor(Math.random() * 1800) + 1800; // 30min to 60min
  } else if (normalizedAction < 0.7) {
    baseTime = Math.floor(Math.random() * 900) + 600; // 10min to 25min
  } else if (normalizedAction < 0.9) {
    baseTime = Math.floor(Math.random() * 300) + 300; // 5min to 10min
  } else if (normalizedAction < 0.98) {
    baseTime = Math.floor(Math.random() * 240) + 120; // 2min to 6min
  } else {
    baseTime = Math.floor(Math.random() * 120) + 60; // 1min to 3min
  }

  // Add random seconds (0-59) to make times more realistic
  const extraSeconds = Math.floor(Math.random() * 60);
  return baseTime + extraSeconds;
}

export function getFormatTime(
  seconds: number,
  includeHours: boolean = false,
): string {
  // Input is in seconds, output should be string like '00:12:24' or '12:24' if includeHours is false
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  return `${includeHours ? `${hours.toString().padStart(2, "0")}:` : ""}${
    minutes.toString().padStart(2, "0")
  }:${remainingSeconds.toString().padStart(2, "0")}`;
}
