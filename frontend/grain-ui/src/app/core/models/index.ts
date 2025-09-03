// filepath: /d:/instagram workspace/Grain/frontend/grain-ui/src/app/core/models/index.ts
export interface UserProgressDto {
  lastSentItem: number;
  status: 'Active' | 'InActive' | string;
}

export interface Dataset {
  id?: number;
  topic: string;
  useAi: boolean;
  itemCount?: number;
  progress?: UserProgressDto;
}

export interface User {
  userId: number;
  name?: string;
  email: string;
  userDataSets?: Dataset[];
}

export interface Preferences {
  topics: string[];
  useAi: boolean;
  frequency: 'daily' | 'weekly';
}