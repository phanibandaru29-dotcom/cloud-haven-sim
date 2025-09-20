import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Server, Database, Cloud, ArrowRight, Play, RotateCcw } from 'lucide-react';

interface BackupSimulationProps {
  onBack: () => void;
}

export const BackupSimulation = ({ onBack }: BackupSimulationProps) => {
  const [isRunning, setIsRunning] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);

  const steps = [
    { id: 1, name: 'Initiating Backup', description: 'Scanning on-premises data' },
    { id: 2, name: 'Data Transfer', description: 'Transferring to Storage Gateway' },
    { id: 3, name: 'Gateway Processing', description: 'Processing through AWS Storage Gateway' },
    { id: 4, name: 'S3 Storage', description: 'Storing in Amazon S3' },
    { id: 5, name: 'Verification', description: 'Verifying backup integrity' },
    { id: 6, name: 'Complete', description: 'Backup successfully completed' }
  ];

  const startSimulation = () => {
    setIsRunning(true);
    setCurrentStep(0);
    setProgress(0);
  };

  const resetSimulation = () => {
    setIsRunning(false);
    setCurrentStep(0);
    setProgress(0);
  };

  useEffect(() => {
    if (isRunning && currentStep < steps.length) {
      const timer = setTimeout(() => {
        setCurrentStep(prev => prev + 1);
        setProgress(prev => prev + (100 / steps.length));
      }, 2000);
      return () => clearTimeout(timer);
    }
    
    if (currentStep >= steps.length) {
      setIsRunning(false);
    }
  }, [isRunning, currentStep, steps.length]);

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gradient-primary">Backup Simulation</h1>
            <p className="text-muted-foreground">Hybrid Cloud Data Backup Workflow</p>
          </div>
          <Button variant="outline" onClick={onBack}>
            Back to Dashboard
          </Button>
        </div>

        {/* Control Panel */}
        <Card className="card-gradient border-border">
          <CardHeader>
            <CardTitle>Simulation Controls</CardTitle>
          </CardHeader>
          <CardContent className="flex gap-4">
            <Button 
              onClick={startSimulation} 
              disabled={isRunning}
              className="flex items-center gap-2"
            >
              <Play className="h-4 w-4" />
              {isRunning ? 'Running...' : 'Start Backup'}
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

        {/* Flow Diagram */}
        <Card className="card-gradient border-border">
          <CardHeader>
            <CardTitle>Data Flow Visualization</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between p-8">
              {/* On-Premises Server */}
              <div className="text-center space-y-2">
                <div className={`w-20 h-20 rounded-lg bg-secondary flex items-center justify-center ${
                  currentStep >= 1 ? 'pulse-glow' : ''
                }`}>
                  <Server className="h-10 w-10 text-primary" />
                </div>
                <div className="text-sm font-medium">On-Premises</div>
                <div className="text-xs text-muted-foreground">Source Data</div>
              </div>

              {/* Arrow 1 */}
              <div className="flex items-center">
                <ArrowRight className={`h-8 w-8 mx-4 ${
                  currentStep >= 2 ? 'flow-arrow' : 'text-muted-foreground'
                }`} />
                {currentStep >= 2 && (
                  <div className="absolute">
                    <div className="w-4 h-4 bg-primary rounded-full data-flow"></div>
                  </div>
                )}
              </div>

              {/* Storage Gateway */}
              <div className="text-center space-y-2">
                <div className={`w-20 h-20 rounded-lg bg-secondary flex items-center justify-center ${
                  currentStep >= 3 ? 'pulse-glow' : ''
                }`}>
                  <Database className="h-10 w-10 text-accent" />
                </div>
                <div className="text-sm font-medium">Storage Gateway</div>
                <div className="text-xs text-muted-foreground">AWS Hybrid</div>
              </div>

              {/* Arrow 2 */}
              <div className="flex items-center">
                <ArrowRight className={`h-8 w-8 mx-4 ${
                  currentStep >= 4 ? 'flow-arrow' : 'text-muted-foreground'
                }`} />
                {currentStep >= 4 && (
                  <div className="absolute">
                    <div className="w-4 h-4 bg-accent rounded-full data-flow"></div>
                  </div>
                )}
              </div>

              {/* Amazon S3 */}
              <div className="text-center space-y-2">
                <div className={`w-20 h-20 rounded-lg bg-secondary flex items-center justify-center ${
                  currentStep >= 5 ? 'pulse-glow' : ''
                }`}>
                  <Cloud className="h-10 w-10 text-success" />
                </div>
                <div className="text-sm font-medium">Amazon S3</div>
                <div className="text-xs text-muted-foreground">Cloud Storage</div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-6">
              <div className="flex justify-between text-sm mb-2">
                <span>Progress</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-primary to-accent h-2 rounded-full transition-all duration-1000"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Step Details */}
        <Card className="card-gradient border-border">
          <CardHeader>
            <CardTitle>Current Step</CardTitle>
          </CardHeader>
          <CardContent>
            {currentStep === 0 && !isRunning ? (
              <div className="text-center py-8 text-muted-foreground">
                Click "Start Backup" to begin the simulation
              </div>
            ) : (
              <div className="space-y-4">
                {steps.slice(0, currentStep + 1).map((step, index) => (
                  <div key={step.id} className={`flex items-center gap-4 p-4 rounded-lg ${
                    index === currentStep ? 'bg-primary/10 border border-primary/20' : 'bg-muted/5'
                  }`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                      index === currentStep ? 'bg-primary text-primary-foreground' : 
                      index < currentStep ? 'bg-success text-success-foreground' : 'bg-muted text-muted-foreground'
                    }`}>
                      {index < currentStep ? '✓' : step.id}
                    </div>
                    <div>
                      <div className="font-medium">{step.name}</div>
                      <div className="text-sm text-muted-foreground">{step.description}</div>
                    </div>
                    {index === currentStep && isRunning && (
                      <div className="ml-auto">
                        <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};