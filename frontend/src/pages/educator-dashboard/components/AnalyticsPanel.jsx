import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import Icon from '../../../components/AppIcon';

const AnalyticsPanel = ({ analyticsData }) => {
  const connectionData = [
    { name: 'Good', value: analyticsData?.connectionQuality?.good, color: '#10B981' },
    { name: 'Fair', value: analyticsData?.connectionQuality?.fair, color: '#F59E0B' },
    { name: 'Poor', value: analyticsData?.connectionQuality?.poor, color: '#EF4444' }
  ];

  const engagementData = [
    { name: 'Mon', engagement: 85, attendance: 92 },
    { name: 'Tue', engagement: 78, attendance: 88 },
    { name: 'Wed', engagement: 92, attendance: 95 },
    { name: 'Thu', engagement: 88, attendance: 90 },
    { name: 'Fri', engagement: 95, attendance: 97 },
    { name: 'Sat', engagement: 82, attendance: 85 },
    { name: 'Sun', engagement: 75, attendance: 80 }
  ];

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <Icon name="Users" size={20} className="text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Students</p>
              <p className="text-2xl font-bold text-foreground">{analyticsData?.totalStudents}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Icon name="TrendingUp" size={14} className="text-success" />
            <span className="text-success">+12% from last week</span>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
              <Icon name="Clock" size={20} className="text-success" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Avg. Session Time</p>
              <p className="text-2xl font-bold text-foreground">{analyticsData?.avgSessionTime}m</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Icon name="TrendingUp" size={14} className="text-success" />
            <span className="text-success">+5% from last week</span>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-warning/10 rounded-lg flex items-center justify-center">
              <Icon name="Target" size={20} className="text-warning" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Completion Rate</p>
              <p className="text-2xl font-bold text-foreground">{analyticsData?.completionRate}%</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Icon name="TrendingDown" size={14} className="text-error" />
            <span className="text-error">-2% from last week</span>
          </div>
        </div>
      </div>
      {/* Connection Quality Distribution */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Icon name="Wifi" size={20} />
          Student Connection Quality
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={connectionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {connectionData?.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry?.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-4">
            {connectionData?.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: item?.color }}
                  />
                  <span className="text-sm font-medium text-foreground">{item?.name} Connection</span>
                </div>
                <span className="text-sm text-muted-foreground">{item?.value} students</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Weekly Engagement Trends */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Icon name="BarChart3" size={20} />
          Weekly Engagement & Attendance
        </h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={engagementData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis 
                dataKey="name" 
                stroke="var(--color-muted-foreground)"
                fontSize={12}
              />
              <YAxis 
                stroke="var(--color-muted-foreground)"
                fontSize={12}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'var(--color-card)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '8px'
                }}
              />
              <Bar dataKey="engagement" fill="var(--color-primary)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="attendance" fill="var(--color-success)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="flex items-center gap-6 mt-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-primary rounded-full" />
            <span className="text-sm text-muted-foreground">Engagement Rate</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-success rounded-full" />
            <span className="text-sm text-muted-foreground">Attendance Rate</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPanel;