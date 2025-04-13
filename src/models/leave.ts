export type LeaveStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface LeaveType {
  id: string;
  name: string;
  description: string;
  companyId: string;
  defaultDays?: number;
  isPaid: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface LeaveRequest {
  id: string;
  employeeId: string;
  leaveTypeId: string;
  companyId?: string;
  startDate: Date;
  endDate: Date;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  reason: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateLeaveRequestData {
  employeeId: string;
  leaveTypeId: string;
  startDate: Date;
  endDate: Date;
  reason: string;
}

export interface UpdateLeaveRequestData {
  status?: 'PENDING' | 'APPROVED' | 'REJECTED';
  approvedBy?: string;
  approvedAt?: Date;
  startDate?: Date;
  endDate?: Date;
  reason?: string;
} 