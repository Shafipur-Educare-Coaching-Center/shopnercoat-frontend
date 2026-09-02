import React from 'react';
import { Metadata } from 'next';
import { getAccessToken } from '@/lib/server/getTokens';
import { getAdminOverviewData } from '@/server/admin.service';
import {
  AdminOverviewHeader,
  OverviewMetricCards,
  AgeDistributionBarChart,
  LocationDistributionPieChart,
  CollegeDistributionPieChart,
  QuickActionShortcuts,
  RecentAuditLogsTable,
} from '@/components/admin/overview';

export const metadata: Metadata = {
  title: 'Dashboard Overview | ShopnerCoat Admin',
  description:
    'Administrative dashboard overview with medical candidate metrics, demographic charts, and audit activity.',
};

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function AdminDashboardPage() {
  const token = await getAccessToken();
  const data = await getAdminOverviewData(token);

  return (
    <div className="w-full flex flex-col gap-6 sm:gap-8 pb-10">
      
      {/* 1. Header with Range Selector, Live Refresh & Export */}
      <AdminOverviewHeader lastUpdated={data.lastUpdated} />

      {/* 2. Top 4 High-Level KPI Metric Cards */}
      <OverviewMetricCards stats={data.stats} />

      {/* 3. Analytics Grid Row 1: Candidate Age Bar Chart + Location Pie Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <div className="lg:col-span-7 flex">
          <AgeDistributionBarChart
            data={data.ageDistribution}
            totalCandidates={data.stats.totalStudents}
          />
        </div>
        <div className="lg:col-span-5 flex">
          <LocationDistributionPieChart
            data={data.locationDistribution}
            totalCandidates={data.stats.totalStudents}
          />
        </div>
      </div>

      {/* 4. Analytics Grid Row 2: Top HSC Colleges Donut + Quick Action Shortcuts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <div className="lg:col-span-7 flex">
          <CollegeDistributionPieChart
            data={data.collegeDistribution}
            totalCandidates={data.stats.totalStudents}
          />
        </div>
        <div className="lg:col-span-5 flex">
          <QuickActionShortcuts />
        </div>
      </div>

      {/* 5. Real-Time Administrative System Audit Logs Table */}
      <div className="w-full">
        <RecentAuditLogsTable logs={data.recentAuditLogs} />
      </div>

    </div>
  );
}
