import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Server, Cloud, Database, Shield, Activity, AlertCircle } from 'lucide-react';
import { BackupSimulation } from './BackupSimulation';
import { FailoverSimulation } from './FailoverSimulation';
import { MonitoringLogs } from './MonitoringLogs';

export const Dashboard = () => {
  const [activeView, setActiveView] = useState<'dashboard' | 'backup' | 'failover' | 'logs'>('dashboard');
  const [systemStatus, setSystemStatus] = useState({
    onPrem: 'healthy',
    aws: 'healthy',
    storage: 'healthy',
    network: 'healthy'
  });

  const handleBackToDashboard = () => setActiveView('dashboard');

  const statusColors = {
    healthy: 'status-healthy',
    failed: 'status-failed',
    warning: 'status-warning'
  };

  const statusIcons = {
    healthy: '🟢',
    failed: '🔴',
    warning: '🟡'
  };

  if (activeView === 'backup') {
    return <BackupSimulation onBack={handleBackToDashboard} />;
  }

  if (activeView === 'failover') {
    return <FailoverSimulation onBack={handleBackToDashboard} onStatusUpdate={setSystemStatus} />;
  }

  if (activeView === 'logs') {
    return <MonitoringLogs onBack={handleBackToDashboard} />;
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-gradient-primary">
            Hybrid Cloud Disaster Recovery
          </h1>
          <p className="text-muted-foreground text-lg">
            Enterprise-grade backup and failover simulation dashboard
          </p>
        </div>

        {/* System Status Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="card-gradient border-border">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm">
                <Server className="h-4 w-4 text-primary" />
                On-Premises
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <span className="text-2xl">{statusIcons[systemStatus.onPrem as keyof typeof statusIcons]}</span>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[systemStatus.onPrem as keyof typeof statusColors]}`}>
                  {systemStatus.onPrem.toUpperCase()}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="card-gradient border-border">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm">
                <Cloud className="h-4 w-4 text-primary" />
                AWS Cloud
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <span className="text-2xl">{statusIcons[systemStatus.aws as keyof typeof statusIcons]}</span>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[systemStatus.aws as keyof typeof statusColors]}`}>
                  {systemStatus.aws.toUpperCase()}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="card-gradient border-border">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm">
                <Database className="h-4 w-4 text-primary" />
                Storage Gateway
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <span className="text-2xl">{statusIcons[systemStatus.storage as keyof typeof statusIcons]}</span>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[systemStatus.storage as keyof typeof statusColors]}`}>
                  {systemStatus.storage.toUpperCase()}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="card-gradient border-border">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm">
                <Activity className="h-4 w-4 text-primary" />
                Network
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <span className="text-2xl">{statusIcons[systemStatus.network as keyof typeof statusIcons]}</span>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[systemStatus.network as keyof typeof statusColors]}`}>
                  {systemStatus.network.toUpperCase()}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="card-gradient border-border hover:border-primary/50 transition-colors cursor-pointer group" 
                onClick={() => setActiveView('backup')}>
            <CardHeader className="text-center">
              <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <Database className="h-8 w-8 text-primary" />
              </div>
              <CardTitle>Simulate Backup</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground mb-4">
                Watch data flow from on-premises servers through Storage Gateway to S3
              </p>
              <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                Start Simulation
              </Button>
            </CardContent>
          </Card>

          <Card className="card-gradient border-border hover:border-destructive/50 transition-colors cursor-pointer group" 
                onClick={() => setActiveView('failover')}>
            <CardHeader className="text-center">
              <div className="w-16 h-16 mx-auto bg-destructive/10 rounded-full flex items-center justify-center mb-4 group-hover:bg-destructive/20 transition-colors">
                <Shield className="h-8 w-8 text-destructive" />
              </div>
              <CardTitle>Trigger Failover</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground mb-4">
                Simulate disaster recovery failover to AWS Elastic Disaster Recovery
              </p>
              <Button variant="outline" className="w-full group-hover:bg-destructive group-hover:text-destructive-foreground transition-colors">
                Trigger Failover
              </Button>
            </CardContent>
          </Card>

          <Card className="card-gradient border-border hover:border-accent/50 transition-colors cursor-pointer group" 
                onClick={() => setActiveView('logs')}>
            <CardHeader className="text-center">
              <div className="w-16 h-16 mx-auto bg-accent/10 rounded-full flex items-center justify-center mb-4 group-hover:bg-accent/20 transition-colors">
                <Activity className="h-8 w-8 text-accent" />
              </div>
              <CardTitle>View Monitoring Logs</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground mb-4">
                Real-time monitoring and system event logs
              </p>
              <Button variant="outline" className="w-full group-hover:bg-accent group-hover:text-accent-foreground transition-colors">
                Open Logs
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Quick Stats */}
        <Card className="card-gradient border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-primary" />
              System Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-primary">99.9%</div>
                <div className="text-sm text-muted-foreground">Uptime</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-success">15min</div>
                <div className="text-sm text-muted-foreground">RTO Target</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-accent">1hr</div>
                <div className="text-sm text-muted-foreground">RPO Target</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-warning">3</div>
                <div className="text-sm text-muted-foreground">Backup Sites</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};