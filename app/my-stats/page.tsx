"use client";

import { useEffect, useState } from 'react';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { TrendingUp, Target, Award, Calendar, Activity, BarChart3, Database } from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface AnalyticsData {
  overview: {
    totalGoals: number;
    completedGoals: number;
    inProgressGoals: number;
    notStartedGoals: number;
    abandonedGoals: number;
    completionRate: number;
    avgProgress: number;
    recentAchievements: number;
  };
  charts: {
    weekly: Array<{ week: string; value: number; entries: number }>;
    monthly: Array<{ month: string; value: number; entries: number }>;
    goalsByCategory: Array<{ category: string; count: number }>;
  };
  streaks: {
    current: number;
    longest: number;
    calendar: Array<{
      date: string;
      hasProgress: boolean;
      value: number;
      entries: number;
    }>;
  };
}

export default function MyStats() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [demoLoading, setDemoLoading] = useState(false);

  const fetchData = async () => {
    try {
      const response = await fetch('/api/analytics');
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateDemoData = async () => {
    setDemoLoading(true);
    try {
      const response = await fetch('/api/demo-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        const result = await response.json();
        alert(`Success! Created ${result.entriesCreated} progress entries for ${result.goalsUpdated} goals.`);
        // Refresh the analytics data
        setLoading(true);
        await fetchData();
      } else {
        const error = await response.json();
        alert(`Error: ${error.error}`);
      }
    } catch (error) {
      console.error('Error generating demo data:', error);
      alert('Failed to generate demo data');
    } finally {
      setDemoLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your stats...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <p className="text-gray-600">Error loading your analytics data</p>
        </div>
      </div>
    );
  }

  const weeklyChartData = {
    labels: data.charts.weekly.map((entry) => entry.week),
    datasets: [
      {
        label: 'Progress Value',
        data: data.charts.weekly.map((entry) => entry.value),
        borderColor: 'rgb(99, 102, 241)',
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const monthlyChartData = {
    labels: data.charts.monthly.map((entry) => entry.month),
    datasets: [
      {
        label: 'Progress Value',
        data: data.charts.monthly.map((entry) => entry.value),
        backgroundColor: [
          'rgba(99, 102, 241, 0.8)',
          'rgba(59, 130, 246, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(239, 68, 68, 0.8)',
          'rgba(139, 92, 246, 0.8)',
        ],
        borderColor: [
          'rgba(99, 102, 241, 1)',
          'rgba(59, 130, 246, 1)',
          'rgba(16, 185, 129, 1)',
          'rgba(245, 158, 11, 1)',
          'rgba(239, 68, 68, 1)',
          'rgba(139, 92, 246, 1)',
        ],
        borderWidth: 2,
      },
    ],
  };

  const categoryChartData = {
    labels: data.charts.goalsByCategory.map((item) => item.category),
    datasets: [
      {
        data: data.charts.goalsByCategory.map((item) => item.count),
        backgroundColor: [
          '#6366f1',
          '#3b82f6',
          '#10b981',
          '#f59e0b',
          '#ef4444',
          '#8b5cf6',
        ],
        borderWidth: 0,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  const doughnutOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">My Stats</h1>
            <p className="text-gray-600">Track your progress and celebrate your achievements</p>
          </div>
          <button
            onClick={generateDemoData}
            disabled={demoLoading}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Database className="w-4 h-4" />
            <span>{demoLoading ? 'Generating...' : 'Generate Demo Data'}</span>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 mb-8 bg-gray-100 p-1 rounded-lg w-fit">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'charts', label: 'Charts', icon: TrendingUp },
            { id: 'streaks', label: 'Streaks', icon: Calendar },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-white text-indigo-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Goals</p>
                  <p className="text-3xl font-bold text-gray-900">{data.overview.totalGoals}</p>
                </div>
                <Target className="w-8 h-8 text-indigo-600" />
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Completed</p>
                  <p className="text-3xl font-bold text-green-600">{data.overview.completedGoals}</p>
                </div>
                <Award className="w-8 h-8 text-green-600" />
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">In Progress</p>
                  <p className="text-3xl font-bold text-blue-600">{data.overview.inProgressGoals}</p>
                </div>
                <Activity className="w-8 h-8 text-blue-600" />
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Completion Rate</p>
                  <p className="text-3xl font-bold text-indigo-600">{data.overview.completionRate}%</p>
                </div>
                <TrendingUp className="w-8 h-8 text-indigo-600" />
              </div>
            </div>
          </div>
        )}

        {/* Charts Tab */}
        {activeTab === 'charts' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Weekly Progress</h3>
                <Line data={weeklyChartData} options={chartOptions} />
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Progress</h3>
                <Bar data={monthlyChartData} options={chartOptions} />
              </div>
            </div>

            {data.charts.goalsByCategory.length > 0 && (
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Goals by Category</h3>
                <div className="max-w-md mx-auto">
                  <Doughnut data={categoryChartData} options={doughnutOptions} />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Streaks Tab */}
        {activeTab === 'streaks' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Current Streak</h3>
                  <Calendar className="w-6 h-6 text-orange-500" />
                </div>
                <p className="text-4xl font-bold text-orange-500">{data.streaks.current}</p>
                <p className="text-gray-600">days</p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Longest Streak</h3>
                  <Award className="w-6 h-6 text-purple-500" />
                </div>
                <p className="text-4xl font-bold text-purple-500">{data.streaks.longest}</p>
                <p className="text-gray-600">days</p>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Activity Calendar (Last 30 Days)</h3>
              <div className="grid grid-cols-7 gap-2">
                {data.streaks.calendar.map((day, index) => (
                  <div
                    key={index}
                    className={`w-8 h-8 rounded-md flex items-center justify-center text-xs font-medium ${
                      day.hasProgress
                        ? 'bg-green-100 text-green-800 border-2 border-green-200'
                        : 'bg-gray-100 text-gray-400 border-2 border-gray-200'
                    }`}
                    title={`${day.date}: ${day.value} progress (${day.entries} entries)`}
                  >
                    {new Date(day.date).getDate()}
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between mt-4 text-sm text-gray-600">
                <span>Less active</span>
                <div className="flex space-x-1">
                  <div className="w-3 h-3 rounded-sm bg-gray-100"></div>
                  <div className="w-3 h-3 rounded-sm bg-green-200"></div>
                  <div className="w-3 h-3 rounded-sm bg-green-400"></div>
                  <div className="w-3 h-3 rounded-sm bg-green-600"></div>
                </div>
                <span>More active</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

