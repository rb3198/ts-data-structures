import { PriorityQueue as PriorityQueueFactory0 } from "./priority_queue";
export type PriorityQueue<T> = ReturnType<typeof PriorityQueueFactory0<T>>;
export const PriorityQueueFactory = PriorityQueueFactory0;
