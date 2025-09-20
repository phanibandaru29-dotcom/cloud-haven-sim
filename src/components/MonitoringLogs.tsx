import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, Download, Filter, Search, AlertTriangle, CheckCircle, Info, XCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface MonitoringLogsProps {
  onBack: () => void;
}

interface LogEntry {
  id: string;
  timestamp: string;
  level: 'info' | 'warning' | 'error' | 'success';
  source: string;
  message: string;
}

export const MonitoringLogs = ({ onBack }: MonitoringLogsProps) => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<LogEntry[]>([]);
  const [isLive, setIsLive] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const logsEndRef = useRef<HTMLDivElement>(null);

  const initialLogs: LogEntry[] = [
    {
      id: '1',
      timestamp: new Date(Date.now() - 300000).toISOString(),
      level: 'info',
      source: 'System Monitor',
      message: 'System health check completed - All services operational'
    },
    {
      id: '2',
      timestamp: new Date(Date.now() - 240000).toISOString(),
      level: 'success',
      source: 'Backup Service',
      message: 'Scheduled backup completed successfully - 2.5TB transferred'
    },
    {
      id: '3',
      timestamp: new Date(Date.now() - 180000).toISOString(),
      level: 'info',
      source: 'AWS Storage Gateway',
      message: 'Connection established to S3 bucket: dr-backup-primary'
    },
    {
      id: '4',
      timestamp: new Date(Date.now() - 120000).toISOString(),
      level: 'warning',
      source: 'Network Monitor',
      message: 'Latency spike detected: 250ms (threshold: 200ms)'
    },
    {
      id: '5',
      timestamp: new Date(Date.now() - 60000).toISOString(),
      level: 'info',
      source: 'DR Orchestrator',
      message: 'Disaster recovery test scheduled for next maintenance window'
    }
  ];

  const generateRandomLog = (): LogEntry => {
    const levels: ('info' | 'warning' | 'error' | 'success')[] = ['info', 'warning', 'error', 'success'];
    const sources = ['System Monitor', 'Backup Service', 'AWS Storage Gateway', 'Network Monitor', 'DR Orchestrator', 'Database Service', 'Application Server'];
    
    const messages = {
      info: [
        'Health check completed successfully',
        'Service status: operational',
        'Connection established to AWS services',
        'Monitoring threshold updated',
        'System maintenance completed',
        'Configuration backup created'
      ],
      warning: [
        'High CPU utilization detected: 85%',
        'Network latency above threshold',
        'Disk space warning: 15% remaining',
        'Backup window approaching deadline',
        'SSL certificate expires in 30 days'
      ],
      error: [
        'Connection timeout to primary database',
        'Backup job failed: network unreachable',
        'Authentication failed for service account',
        'Disk space critical: 5% remaining',
        'Service unavailable: 503 error'
      ],
      success: [
        'Backup completed successfully',
        'Failover test passed with flying colors',
        'System restored from backup',
        'Performance optimization applied',
        'Security patch installed successfully'
      ]
    };

    const level = levels[Math.floor(Math.random() * levels.length)];
    const source = sources[Math.floor(Math.random() * sources.length)];
    const messageOptions = messages[level];
    const message = messageOptions[Math.floor(Math.random() * messageOptions.length)];

    return {
      id: Date.now().toString() + Math.random(),
      timestamp: new Date().toISOString(),
      level,
      source,
      message
    };
  };

  useEffect(() => {
    setLogs(initialLogs);
    setFilteredLogs(initialLogs);
  }, []);

  useEffect(() => {
    if (isLive) {
      const interval = setInterval(() => {
        const newLog = generateRandomLog();
        setLogs(prev => [...prev, newLog].slice(-100)); // Keep last 100 logs
      }, 3000 + Math.random() * 2000); // Random interval between 3-5 seconds

      return () => clearInterval(interval);
    }
  }, [isLive]);

  useEffect(() => {
    let filtered = logs;
    
    if (searchTerm) {
      filtered = filtered.filter(log => 
        log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.source.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (selectedLevel !== 'all') {
      filtered = filtered.filter(log => log.level === selectedLevel);
    }
    
    setFilteredLogs(filtered);
  }, [logs, searchTerm, selectedLevel]);

  useEffect(() => {
    if (isLive && logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [filteredLogs, isLive]);

  const getLevelIcon = (level: string) => {
    switch (level) {
      case 'error': return <XCircle className="h-4 w-4 text-destructive" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-warning" />;
      case 'success': return <CheckCircle className="h-4 w-4 text-success" />;
      default: return <Info className="h-4 w-4 text-primary" />;
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'error': return 'border-l-destructive bg-destructive/5';
      case 'warning': return 'border-l-warning bg-warning/5';
      case 'success': return 'border-l-success bg-success/5';
      default: return 'border-l-primary bg-primary/5';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  const exportLogs = () => {
    const csvContent = [
      ['Timestamp', 'Level', 'Source', 'Message'],
      ...filteredLogs.map(log => [
        formatTimestamp(log.timestamp),
        log.level.toUpperCase(),
        log.source,
        log.message
      ])
    ].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `monitoring-logs-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gradient-primary">Monitoring Logs</h1>
            <p className="text-muted-foreground">Real-time system monitoring and event logs</p>
          </div>
          <Button variant="outline" onClick={onBack}>
            Back to Dashboard
          </Button>
        </div>

        {/* Controls */}
        <Card className="card-gradient border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Log Controls
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4 items-center">
              <div className="flex items-center gap-2">
                <Search className="h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search logs..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-64"
                />
              </div>
              
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <select 
                  value={selectedLevel}
                  onChange={(e) => setSelectedLevel(e.target.value)}
                  className="bg-background border border-border rounded-md px-3 py-2 text-sm"
                >
                  <option value="all">All Levels</option>
                  <option value="info">Info</option>
                  <option value="success">Success</option>
                  <option value="warning">Warning</option>
                  <option value="error">Error</option>
                </select>
              </div>

              <Button
                variant={isLive ? "destructive" : "default"}
                onClick={() => setIsLive(!isLive)}
                className="flex items-center gap-2"
              >
                <div className={`w-2 h-2 rounded-full ${isLive ? 'bg-red-500 animate-pulse' : 'bg-muted-foreground'}`} />
                {isLive ? 'Stop Live' : 'Start Live'}
              </Button>

              <Button
                variant="outline"
                onClick={exportLogs}
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Export CSV
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Log Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="card-gradient border-border">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary">{logs.length}</div>
              <div className="text-sm text-muted-foreground">Total Logs</div>
            </CardContent>
          </Card>
          <Card className="card-gradient border-border">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-destructive">
                {logs.filter(log => log.level === 'error').length}
              </div>
              <div className="text-sm text-muted-foreground">Errors</div>
            </CardContent>
          </Card>
          <Card className="card-gradient border-border">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-warning">
                {logs.filter(log => log.level === 'warning').length}
              </div>
              <div className="text-sm text-muted-foreground">Warnings</div>
            </CardContent>
          </Card>
          <Card className="card-gradient border-border">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-success">
                {logs.filter(log => log.level === 'success').length}
              </div>
              <div className="text-sm text-muted-foreground">Success</div>
            </CardContent>
          </Card>
        </div>

        {/* Logs Display */}
        <Card className="card-gradient border-border">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Event Logs</span>
              <span className="text-sm font-normal text-muted-foreground">
                Showing {filteredLogs.length} of {logs.length} logs
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {filteredLogs.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No logs match your current filters
                </div>
              ) : (
                filteredLogs.map((log) => (
                  <div
                    key={log.id}
                    className={`flex items-start gap-3 p-3 rounded-lg border-l-4 transition-all hover:bg-muted/10 ${getLevelColor(log.level)}`}
                  >
                    <div className="flex-shrink-0 mt-0.5">
                      {getLevelIcon(log.level)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 text-sm">
                        <span className="font-medium text-foreground">{log.source}</span>
                        <span className="text-muted-foreground">•</span>
                        <span className="text-muted-foreground">{formatTimestamp(log.timestamp)}</span>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          log.level === 'error' ? 'bg-destructive/20 text-destructive' :
                          log.level === 'warning' ? 'bg-warning/20 text-warning' :
                          log.level === 'success' ? 'bg-success/20 text-success' :
                          'bg-primary/20 text-primary'
                        }`}>
                          {log.level.toUpperCase()}
                        </span>
                      </div>
                      <div className="mt-1 text-sm text-foreground">{log.message}</div>
                    </div>
                  </div>
                ))
              )}
              <div ref={logsEndRef} />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};