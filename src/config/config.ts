import { HealthState } from "@/Person";

interface HealthStateConfig {
  [k: number]: { color: string; displayInGraph: boolean; label: string };
}

const healthStateConfig: HealthStateConfig = {
  [HealthState.Healthy]: {
    color: "#D5E1C8",
    displayInGraph: false,
    label: "Healthy"
  },
  [HealthState.Infected]: {
    color: "#EF476F",
    displayInGraph: true,
    label: "Infected"
  },
  [HealthState.Healed]: {
    color: "#06D6A0",
    displayInGraph: true,
    label: "Healed"
  },
  [HealthState.Dead]: { color: "black", displayInGraph: true, label: "Dead" }
};

const borderWidth = 10;
const borderPosXRelative = 0.3;

export {
  healthStateConfig,
  HealthStateConfig,
  borderWidth,
  borderPosXRelative
};
