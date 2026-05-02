export type Role     = 'admin' | 'manager' | 'user';
export type Status   = 'todo' | 'in-progress' | 'done';
export type Priority = 'low' | 'medium' | 'high';
export type DocType  = 'pdf' | 'docx' | 'xlsx' | 'unknown';

export interface User {
  id:        string;
  name:      string;
  email:     string;
  role:      Role;
  avatar:    string;
  team:      string;
  createdAt: string;
}

export interface Task {
  id:          string;
  title:       string;
  description: string;
  assignedTo:  string;
  createdBy:   string;
  status:      Status;
  priority:    Priority;
  createdAt:   string;
  dueDate:     string;
  tags:        string[];
  documents:   string[];
}

export interface Document {
  id:         string;
  name:       string;
  type:       DocType;
  size:       number;
  taskId:     string | null;
  uploadedBy: string;
  uploadedAt: string;
  dataUrl:    string;
}

export interface Toast {
  id:      string;
  message: string;
  variant: 'success' | 'error' | 'warning' | 'info';
}

export interface FiltersState {
  search:     string;
  status:     Status | '';
  priority:   Priority | '';
  assignedTo: string;
  sortBy:     'newest' | 'oldest' | 'priority' | 'dueDate';
}
