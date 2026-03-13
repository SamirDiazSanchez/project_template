export class User {
  userId: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;

  constructor(userId: string, name: string, email: string, role: string, isActive: boolean) {
    this.userId = userId;
    this.name = name;
    this.email = email;
    this.role = role;
    this.isActive = isActive;
  }
}

export interface PaginatedUsers {
  users: User[];
  totalRecords: number;
}
