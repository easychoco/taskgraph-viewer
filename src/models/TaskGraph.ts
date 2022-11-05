import { Expose, Type } from "class-transformer";

export class TaskGraph {
  @Expose()
  tasks!: Task[]

  constructor(init?: Partial<TaskGraph>) {
    Object.assign(this, init);
  }
};

export class Task {
  @Expose()
  name!: string
  @Expose()
  difficulty!: Difficulty
  @Expose()
  description?: string
  @Expose()
  notes?: string[]
  @Expose()
  depends?: string[]

  constructor(init?: Partial<Task>) {
    Object.assign(this, init);
  }
};

export type Difficulty = 'included' | 'easy' | 'light' | 'normal' | 'heavy' | 'hard';
