'use client';

import { useAuth } from '@/authProvider/AuthProvider';
import Link from 'next/link';

export default function UserDashboard() {
  const { user } = useAuth();

  return (
    <div className="space-y-6 py-8">
      {/* Welcome Section */}
      <div className="rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 p-8 text-white">
        <h1 className="text-3xl font-bold">Welcome back, {user?.username}! 👋</h1>
        <p className="mt-2 text-lg text-indigo-100">
          Continue your journey to discover the perfect career path.
        </p>
        <div className="mt-6 flex gap-4">
          <Link href="/user/assessment" className="rounded-lg bg-white px-6 py-3 text-sm font-semibold text-indigo-600 shadow-lg transition-all hover:bg-gray-50">
            Take Assessment
          </Link>
          <button className="rounded-lg border-2 border-white px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-white/10">
            Explore Careers
          </button>
        </div>
      </div>

      {/* Progress Overview */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Assessments Completed
              </p>
              <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
                3
              </p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900">
              <svg className="h-6 w-6 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Career Matches
              </p>
              <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
                12
              </p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900">
              <svg className="h-6 w-6 text-purple-600 dark:text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
                <path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Skills Evaluated
              </p>
              <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
                24
              </p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900">
              <svg className="h-6 w-6 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Profile Score
              </p>
              <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
                87%
              </p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-yellow-100 dark:bg-yellow-900">
              <svg className="h-6 w-6 text-yellow-600 dark:text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Current Assessment */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Continue Your Assessment
              </h2>
              <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800 dark:bg-green-900 dark:text-green-200">
                In Progress
              </span>
            </div>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Complete your skill evaluation to get personalized career recommendations.
            </p>
            <div className="mt-4">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-gray-900 dark:text-white">Progress</span>
                <span className="text-gray-600 dark:text-gray-400">65%</span>
              </div>
              <div className="mt-2 h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700">
                <div className="h-2 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600" style={{ width: '65%' }}></div>
              </div>
            </div>
            <Link href="/user/assessment" className="mt-4 block w-full rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-3 text-center text-sm font-semibold text-white shadow-lg transition-all hover:from-indigo-700 hover:to-purple-700">
              Continue Assessment
            </Link>
          </div>

          {/* Recommended Career Paths */}
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Recommended Career Paths
            </h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Based on your skills and interests
            </p>
            <div className="mt-6 space-y-4">
              {[
                { title: 'Software Engineer', match: '95%', color: 'green', icon: '💻' },
                { title: 'Data Scientist', match: '88%', color: 'blue', icon: '📊' },
                { title: 'Product Manager', match: '82%', color: 'purple', icon: '🎯' },
              ].map((career, index) => (
                <div key={index} className="flex items-center justify-between rounded-lg border border-gray-200 p-4 transition-all hover:border-indigo-600 hover:bg-indigo-50 dark:border-gray-700 dark:hover:bg-indigo-900/20">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-100 text-2xl dark:bg-gray-700">
                      {career.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {career.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {career.match} match
                      </p>
                    </div>
                  </div>
                  <button className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700">
                    Explore
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Next Steps */}
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
              Next Steps
            </h2>
            <div className="mt-4 space-y-3">
              {[
                { text: 'Complete Skill Assessment', done: false },
                { text: 'Review Career Matches', done: false },
                { text: 'Set Learning Goals', done: false },
                { text: 'Connect with Mentor', done: false },
              ].map((step, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className={`flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full ${step.done ? 'bg-green-600' : 'border-2 border-gray-300 dark:border-gray-600'}`}>
                    {step.done && (
                      <svg className="h-4 w-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                  <span className={`text-sm ${step.done ? 'text-gray-400 line-through dark:text-gray-500' : 'text-gray-900 dark:text-white'}`}>
                    {step.text}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Events */}
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
              Upcoming Events
            </h2>
            <div className="mt-4 space-y-4">
              <div className="rounded-lg bg-indigo-50 p-4 dark:bg-indigo-900/20">
                <div className="flex gap-3">
                  <div className="flex-shrink-0">
                    <div className="flex h-12 w-12 flex-col items-center justify-center rounded-lg bg-indigo-600 text-white">
                      <span className="text-xs font-medium">NOV</span>
                      <span className="text-lg font-bold">15</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      Career Workshop
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      2:00 PM - 4:00 PM
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-lg bg-purple-50 p-4 dark:bg-purple-900/20">
                <div className="flex gap-3">
                  <div className="flex-shrink-0">
                    <div className="flex h-12 w-12 flex-col items-center justify-center rounded-lg bg-purple-600 text-white">
                      <span className="text-xs font-medium">NOV</span>
                      <span className="text-lg font-bold">18</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      Mentorship Session
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      10:00 AM - 11:00 AM
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Achievement Badge */}
          <div className="rounded-lg border border-gray-200 bg-gradient-to-br from-yellow-50 to-orange-50 p-6 shadow-sm dark:border-gray-700 dark:from-yellow-900/20 dark:to-orange-900/20">
            <div className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-yellow-100 text-4xl dark:bg-yellow-900/50">
                🏆
              </div>
              <h3 className="mt-4 font-bold text-gray-900 dark:text-white">
                Achievement Unlocked!
              </h3>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                You've completed 3 assessments. Keep going!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

