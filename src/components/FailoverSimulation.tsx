import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Server, Cloud, AlertTriangle, Play, RotateCcw, CheckCircle, XCircle } from 'lucide-react';

interface FailoverSimulationProps {
  onBack: () => void;
  onStatusUpdate: (status: any) => void;
}

export const FailoverSimulation = ({ onBack, onStatusUpdate }: FailoverSimulationProps) => {
  const [isRunning, setIsRunning] = useState(false);
  const [currentPhase, setCurrentPhase] = useState(0);
  const [onPremStatus, setOnPremStatus] = useState('healthy');
  const [awsStatus, setAwsStatus] = useState('healthy');
  const [failoverComplete, setFailoverComplete] = useState(false);

  const phases = [
    { id: 1, name: 'Failure Detection', description: 'On-premises failure detected' },
    { id: 2, name: 'Alert Generation', description: 'Critical alerts generated' },
    { id: 3, name: 'Failover Initiation', description: 'Starting failover process' },
    { id: 4, name: 'AWS DRS Activation', description: 'Elastic Disaster Recovery activated' },
    { id: 5, name: 'Workload Migration', description: 'Migrating workloads to AWS' },
    { id: 6, name: 'Verification', description: 'Verifying failover success' },
    { id: 7, name: 'Complete', description: 'Failover completed successfully' }
  ];

  const startFailover = () => {
    setIsRunning(true);
    setCurrentPhase(0);
    setFailoverComplete(false);
    setOnPremStatus('healthy');
    setAwsStatus('healthy');
  };

  const resetSimulation = () => {
    setIsRunning(false);
    setCurrentPhase(0);
    setFailoverComplete(false);
    setOnPremStatus('healthy');
    setAwsStatus('healthy');
    onStatusUpdate({
      onPrem: 'healthy',
      aws: 'healthy',
      storage: 'healthy',
      network: 'healthy'
    });
  };

  useEffect(() => {
    if (isRunning && currentPhase < phases.length) {
      const timer = setTimeout(() => {
        setCurrentPhase(prev => prev + 1);
        
        // Update statuses based on phase
        if (currentPhase === 1) {
          setOnPremStatus('failed');
          onStatusUpdate({
            onPrem: 'failed',
            aws: 'healthy',
            storage: 'warning',
            network: 'warning'
          });
        } else if (currentPhase === 4) {
          setAwsStatus('active');
        } else if (currentPhase >= 6) {
          setFailoverComplete(true);
          onStatusUpdate({
            onPrem: 'failed',
            aws: 'healthy',
            storage: 'healthy',
            network: 'healthy'
          });
        }
      }, 2500);
      return () => clearTimeout(timer);
    }
    
    if (currentPhase >= phases.length) {
      setIsRunning(false);
    }
  }, [isRunning, currentPhase, phases.length, onStatusUpdate]);

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gradient-primary">Failover Simulation</h1>
            <p className="text-muted-foreground">Disaster Recovery Failover to AWS</p>
          </div>
          <Button variant="outline" onClick={onBack}>
            Back to Dashboard
          </Button>
        </div>

        {/* Control Panel */}
        <Card className="card-gradient border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              Failover Controls
            </CardTitle>
          </CardHeader>
          <CardContent className="flex gap-4">
            <Button 
              onClick={startFailover} 
              disabled={isRunning}
              variant="destructive"
              className="flex items-center gap-2"
            >
              <Play className="h-4 w-4" />
              {isRunning ? 'Failover in Progress...' : 'Trigger Failover'}
            </Button>
            <Button 
              variant="outline" 
              onClick={resetSimulation}
              className="flex items-center gap-2"
            >
              <RotateCcw className="h-4 w-4" />
              Reset
            </Button>
          </CardContent>
        </Card>

        {/* Infrastructure Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* On-Premises Status */}
          <Card className="card-gradient border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Server className="h-5 w-5" />
                On-Premises Infrastructure
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center p-8">
                <div className={`relative w-32 h-32 rounded-lg flex items-center justify-center transition-all duration-1000 ${
                  onPremStatus === 'healthy' ? 'bg-success/20 border-2 border-success' :
                  onPremStatus === 'failed' ? 'bg-destructive/20 border-2 border-destructive animate-pulse' :
                  'bg-muted/20 border-2 border-muted'
                }`}>
                  <Server className={`h-16 w-16 ${
                    onPremStatus === 'healthy' ? 'text-success' :
                    onPremStatus === 'failed' ? 'text-destructive' :
                    'text-muted-foreground'
                  }`} />
                  {onPremStatus === 'failed' && (
                    <XCircle className="absolute -top-2 -right-2 h-8 w-8 text-destructive bg-background rounded-full" />
                  )}
                  {onPremStatus === 'healthy' && (
                    <CheckCircle className="absolute -top-2 -right-2 h-8 w-8 text-success bg-background rounded-full" />
                  )}
                </div>
              </div>
              <div className="text-center">
                <div className={`text-lg font-bold ${
                  onPremStatus === 'healthy' ? 'text-success' :
                  onPremStatus === 'failed' ? 'text-destructive' :
                  'text-muted-foreground'
                }`}>
                  {onPremStatus === 'healthy' ? 'OPERATIONAL' :
                   onPremStatus === 'failed' ? 'CRITICAL FAILURE' : 'UNKNOWN'}
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  Primary data center status
                </div>
              </div>
            </CardContent>
          </Card>

          {/* AWS Cloud Status */}
          <Card className="card-gradient border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Cloud className="h-5 w-5" />
                AWS Elastic Disaster Recovery
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center p-8">
                <div className={`relative w-32 h-32 rounded-lg flex items-center justify-center transition-all duration-1000 ${
                  failoverComplete ? 'bg-success/20 border-2 border-success pulse-glow' :
                  currentPhase >= 3 ? 'bg-primary/20 border-2 border-primary' :
                  'bg-muted/20 border-2 border-muted'
                }`}>
                  <Cloud className={`h-16 w-16 ${
                    failoverComplete ? 'text-success' :
                    currentPhase >= 3 ? 'text-primary' :
                    'text-muted-foreground'
                  }`} />
                  {failoverComplete && (
                    <CheckCircle className="absolute -top-2 -right-2 h-8 w-8 text-success bg-background rounded-full" />
                  )}
                  {currentPhase >= 3 && !failoverComplete && (
                    <div className="absolute -top-2 -right-2 w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin bg-background"></div>
                  )}
                </div>
              </div>
              <div className="text-center">
                <div className={`text-lg font-bold ${
                  failoverComplete ? 'text-success' :
                  currentPhase >= 3 ? 'text-primary' :
                  'text-muted-foreground'
                }`}>
                  {failoverComplete ? 'ACTIVE - PRIMARY' :
                   currentPhase >= 3 ? 'ACTIVATING...' : 'STANDBY'}
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  Disaster recovery status
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Failover Process */}
        <Card className="card-gradient border-border">
          <CardHeader>
            <CardTitle>Failover Process</CardTitle>
          </CardHeader>
          <CardContent>
            {currentPhase === 0 && !isRunning ? (
              <div className="text-center py-8 text-muted-foreground">
                Click "Trigger Failover" to simulate a disaster recovery scenario
              </div>
            ) : (
              <div className="space-y-4">
                {phases.slice(0, currentPhase + 1).map((phase, index) => (
                  <div key={phase.id} className={`flex items-center gap-4 p-4 rounded-lg transition-all ${
                    index === currentPhase ? 'bg-primary/10 border border-primary/20' : 
                    index < currentPhase ? 'bg-success/10 border border-success/20' : 'bg-muted/5'
                  }`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                      index === currentPhase ? 'bg-primary text-primary-foreground' : 
                      index < currentPhase ? 'bg-success text-success-foreground' : 'bg-muted text-muted-foreground'
                    }`}>
                      {index < currentPhase ? '✓' : phase.id}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">{phase.name}</div>
                      <div className="text-sm text-muted-foreground">{phase.description}</div>
                    </div>
                    {index === currentPhase && isRunning && (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                        <span className="text-sm text-primary font-medium">In Progress</span>
                      </div>
                    )}
                    {index < currentPhase && (
                      <CheckCircle className="h-5 w-5 text-success" />
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Summary */}
        {failoverComplete && (
          <Card className="card-gradient border-success bg-success/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-success">
                <CheckCircle className="h-5 w-5" />
                Failover Complete
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-success">100%</div>
                  <div className="text-sm text-muted-foreground">Workloads Migrated</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-primary">2.5min</div>
                  <div className="text-sm text-muted-foreground">Total Failover Time</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-accent">0</div>
                  <div className="text-sm text-muted-foreground">Data Loss</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};