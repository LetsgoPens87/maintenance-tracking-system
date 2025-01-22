export interface Equipment {
    id: string;
    name: string;
    location: string;
    department: Department; // Reference to enum
    model: string;
    serialNumber: string;
    installDate: string; // Use string to match input format
    status: Status; // Reference to enum
}

// Define enums for department and status
export enum Department {
    Machining = 'Machining',
    Assembly = 'Assembly',
    Packaging = 'Packaging',
    Shipping = 'Shipping',
}

export enum Status {
    Operational = 'Operational',
    Down = 'Down',
    Maintenance = 'Maintenance',
    Retired = 'Retired',
}