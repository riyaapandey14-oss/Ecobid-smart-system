export interface AuditLogEntry {
  id: string;
  timestamp: string;
  adminName: string;
  action: string;
  target: string;
  details: string;
  status: 'Success' | 'Failure';
}

export const AuditService = {
  getLogs: (): AuditLogEntry[] => {
    try {
      const stored = localStorage.getItem('eco_audit_logs');
      const logs = stored ? JSON.parse(stored) : [];
      // Sort by newest first
      return logs.sort((a: any, b: any) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    } catch {
      return [];
    }
  },

  logAction: (entry: Omit<AuditLogEntry, 'id' | 'timestamp'>) => {
    try {
      const logs = AuditService.getLogs();
      const newLog = {
        ...entry,
        id: Math.random().toString(36).substr(2, 9),
        timestamp: new Date().toISOString()
      };
      // Keep only last 100 logs
      const updatedLogs = [newLog, ...logs].slice(0, 100);
      localStorage.setItem('eco_audit_logs', JSON.stringify(updatedLogs));
    } catch (e) {
      console.error("Failed to save audit log", e);
    }
  }
};