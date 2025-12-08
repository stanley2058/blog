"use client";

import { useEffect, useState } from "react";
import { CommandInline } from "./CommandInline";
import { Text } from "./Text";

export function FakeUptimeClient({ serverDate }: { serverDate: number }) {
  const [uptime, setUptime] = useState<string>("");

  useEffect(() => {
    setUptime(formatUptimeLike(new Date(serverDate)));
  }, [serverDate]);

  return (
    <>
      <CommandInline>uptime</CommandInline>
      <Text>{uptime}</Text>
    </>
  );
}

function formatUptimeLike(
  bootTime: Date,
  options?: {
    now?: Date;
    users?: string;
    loadAvg?: [number, number, number];
  },
): string {
  const now = options?.now ?? new Date();
  const [l1, l5, l15] = options?.loadAvg ?? [0.42, 0.08, 0.01];

  // 1. Current time: "HH:MM:SS"
  const timeStr = now.toTimeString().split(" ")[0];

  // 2. Uptime in ms
  const uptimeMs = now.getTime() - bootTime.getTime();
  const uptimeSec = Math.floor(uptimeMs / 1000);

  // 3. Convert to days, hours, minutes
  const days = Math.floor(uptimeSec / 86400);
  const hours = Math.floor((uptimeSec % 86400) / 3600);
  const minutes = Math.floor((uptimeSec % 3600) / 60);

  // 4. Build "up ..." part, mimicking `uptime`
  let upPart = "";

  if (days > 0) {
    upPart += `${days} day${days > 1 ? "s" : ""},  `;
  }

  // Linux `uptime` formats the remaining as H:MM or just M min if < 1 hour
  if (hours > 0) {
    const mm = String(minutes).padStart(2, "0");
    upPart += `${hours}:${mm}`;
  } else {
    upPart += `${minutes} min`;
  }

  // 5. Users part
  const userStr = options?.users ?? "1 user";

  // 6. Load averages
  const loadStr = `load average: ${l1.toFixed(2)}, ${l5.toFixed(
    2,
  )}, ${l15.toFixed(2)}`;

  return `${timeStr} up ${upPart},  ${userStr},  ${loadStr}`;
}
