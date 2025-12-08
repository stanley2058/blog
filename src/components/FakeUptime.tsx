import { FakeUptimeClient } from "./FakeUptimeClient";

export async function FakeUptime() {
  "use cache";

  return <FakeUptimeClient serverDate={Date.now()} />;
}
