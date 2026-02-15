import { useState } from 'react';
import PCHealthCard from '../components/home/PCHealthCard';
import ActionsRecommendations from '../components/home/ActionsRecommendations';
import AskPCAI from '../components/home/AskPCAI';
import PerformanceMode from '../components/home/PerformanceMode';
import DeviceEssentials from '../components/home/DeviceEssentials';
import RecentActivity from '../components/home/RecentActivity';

const Home = () => {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-neutral-900 dark:text-white">System Dashboard</h1>
        <p className="text-neutral-600 dark:text-neutral-400 mt-1">Your PC is running smoothly</p>
      </div>

      {/* PC Health */}
      <PCHealthCard />

      {/* Actions & Recommendations */}
      <ActionsRecommendations />

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <AskPCAI />
        <PerformanceMode />
        <DeviceEssentials />
      </div>

      {/* Recent Activity */}
      <RecentActivity />
    </div>
  );
};

export default Home;
