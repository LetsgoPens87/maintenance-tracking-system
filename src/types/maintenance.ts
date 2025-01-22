export interface MaintenanceRecord {
    id: string; // Add this field
    equipmentId: string;
    date: string;
    type: Type;
    technician: string;
    hoursSpent: number;
    description: string;
    partsReplaced?: string[];
    priority: Priority;
    completionStatus: CompletionStatus;
}

export enum Type {
    Preventive = 'Preventive',
    Repair = 'Repair',
    Emergency = 'Emergency'
}

export enum Priority {
    Low = 'Low',
    Medium = 'Medium',
    High = 'High'
}

export enum CompletionStatus {
    Complete = 'Complete',
    Incomplete = 'Incomplete',
    PendingParts = 'Pending Parts',
}
