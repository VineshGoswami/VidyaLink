import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const DataUsageMonitor = ({ dailyUsage, monthlyUsage, dataLimit }) => {
  const [selectedPeriod, setSelectedPeriod] = useState('daily');

  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 MB';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i))?.toFixed(1)) + ' ' + sizes?.[i];
  };

  const calculatePercentage = (used, total) => {
    return Math.min((used / total) * 100, 100);
  };

  const getUsageColor = (percentage) => {
    if (percentage >= 90) return 'text-error';
    if (percentage >= 70) return 'text-warning';
    return 'text-success';
  };

  const getProgressBarColor = (percentage) => {
    if (percentage >= 90) return 'bg-error';
    if (percentage >= 70) return 'bg-warning';
    return 'bg-success';
  };

  const currentUsage = selectedPeriod === 'daily' ? dailyUsage : monthlyUsage;
  const currentLimit = selectedPeriod === 'daily' ? dataLimit?.daily : dataLimit?.monthly;
  const usagePercentage = calculatePercentage(currentUsage?.total, currentLimit);

  return (
    <div className="bg-card border border-border rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-foreground flex items-center gap-2">
          <Icon name="Activity" size={18} className="text-primary" />
          Data Usage Monitor
        </h3>
        
        <div className="flex bg-muted rounded-lg p-1">
          <button
            onClick={() => setSelectedPeriod('daily')}
            className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
              selectedPeriod === 'daily' ?'bg-primary text-primary-foreground' :'text-muted-foreground hover:text-foreground'
            }`}
          >
            Daily
          </button>
          <button
            onClick={() => setSelectedPeriod('monthly')}
            className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
              selectedPeriod === 'monthly' ?'bg-primary text-primary-foreground' :'text-muted-foreground hover:text-foreground'
            }`}
          >
            Monthly
          </button>
        </div>
      </div>
      {/* Usage Overview */}
      <div className="space-y-4">
        <div className="text-center">
          <div className={`text-2xl font-bold ${getUsageColor(usagePercentage)}`}>
            {formatBytes(currentUsage?.total)}
          </div>
          <div className="text-sm text-muted-foreground">
            of {formatBytes(currentLimit)} used ({Math.round(usagePercentage)}%)
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="w-full bg-muted rounded-full h-3">
            <div 
              className={`h-3 rounded-full transition-all duration-500 ${getProgressBarColor(usagePercentage)}`}
              style={{ width: `${usagePercentage}%` }}
            />
          </div>
          
          {usagePercentage >= 80 && (
            <div className={`text-xs ${getUsageColor(usagePercentage)} flex items-center gap-1`}>
              <Icon name="AlertTriangle" size={12} />
              <span>
                {usagePercentage >= 90 ? 'Critical usage level' : 'High usage warning'}
              </span>
            </div>
          )}
        </div>

        {/* Usage Breakdown */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-foreground">Usage Breakdown</h4>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-primary rounded-full"></div>
                <span className="text-muted-foreground">Live Sessions</span>
              </div>
              <span className="font-medium text-foreground">
                {formatBytes(currentUsage?.liveStreaming)}
              </span>
            </div>
            
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-secondary rounded-full"></div>
                <span className="text-muted-foreground">Downloads</span>
              </div>
              <span className="font-medium text-foreground">
                {formatBytes(currentUsage?.downloads)}
              </span>
            </div>
            
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-accent rounded-full"></div>
                <span className="text-muted-foreground">Other</span>
              </div>
              <span className="font-medium text-foreground">
                {formatBytes(currentUsage?.other)}
              </span>
            </div>
          </div>
        </div>

        {/* Data Saving Tips */}
        {usagePercentage >= 70 && (
          <div className="bg-warning/10 border border-warning/20 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <Icon name="Lightbulb" size={16} className="text-warning mt-0.5" />
              <div>
                <h5 className="text-sm font-medium text-foreground mb-1">
                  Data Saving Tips
                </h5>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• Use audio-only mode for lectures</li>
                  <li>• Download content during off-peak hours</li>
                  <li>• Enable low-bandwidth mode</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DataUsageMonitor;