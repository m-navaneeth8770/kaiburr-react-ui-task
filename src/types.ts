export interface TaskExecution {
  startTime: string; // Dates will come as strings from the API
  endTime: string;
  output: string;
}

export interface Task {
  id: string;
  name: string;
  owner: string;
  command: string;
  taskExecutions?: TaskExecution[]; // Optional array
}