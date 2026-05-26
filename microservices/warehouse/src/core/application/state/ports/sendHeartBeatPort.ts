import { Heartbeat } from "../../../domain/state/entities/heartbeat.entity";

export interface StatePortPublisher {
  publishHeartbeat(heartbeat : Heartbeat): Promise<void>;
}