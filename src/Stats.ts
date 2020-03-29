import { HealthState } from './Person';

export interface StatEntry {
  timestamp: number;
  populations: {[k: string]: any};
}

export class Stats {
  records: StatEntry[] = [];

  addEntry(entry: StatEntry) {
    this.records.push(entry);
  }
}
