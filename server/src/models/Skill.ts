export type ComfortLevel = 1 | 2 | 3 | 4 | 5;

export class Skill {
  id: string;
  userId: string;
  name: string;
  comfortLevel: ComfortLevel;
  createdAt: Date;
  updatedAt: Date;

  constructor(params: {
    id: string;
    userId: string;
    name: string;
    comfortLevel: ComfortLevel;
    createdAt?: Date;
    updatedAt?: Date;
  }) {
    this.id = params.id;
    this.userId = params.userId;
    this.name = params.name;
    this.comfortLevel = params.comfortLevel;
    this.createdAt = params.createdAt ?? new Date();
    this.updatedAt = params.updatedAt ?? new Date();
  }
}
