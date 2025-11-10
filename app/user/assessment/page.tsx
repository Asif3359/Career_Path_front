'use client';

import { useState } from 'react';
import { useAuth } from '@/authProvider/AuthProvider';

// Available skills catalog
const AVAILABLE_SKILLS = [
  { name: 'JavaScript', category: 'Programming' },
  { name: 'Python', category: 'Programming' },
  { name: 'Java', category: 'Programming' },
  { name: 'C++', category: 'Programming' },
  { name: 'React', category: 'Frontend' },
  { name: 'Angular', category: 'Frontend' },
  { name: 'Vue.js', category: 'Frontend' },
  { name: 'Node.js', category: 'Backend' },
  { name: 'Django', category: 'Backend' },
  { name: 'Express.js', category: 'Backend' },
  { name: 'SQL', category: 'Database' },
  { name: 'MongoDB', category: 'Database' },
  { name: 'PostgreSQL', category: 'Database' },
  { name: 'AWS', category: 'Cloud' },
  { name: 'Docker', category: 'DevOps' },
  { name: 'Machine Learning', category: 'AI/ML' },
];

const AVAILABLE_INTERESTS = [
  'Web Development',
  'Mobile Development',
  'Data Science',
  'Machine Learning',
  'UI/UX Design',
  'Backend Development',
  'DevOps',
  'Cloud Computing',
  'Cybersecurity',
  'Game Development',
  'Problem Solving',
  'Team Leadership',
];

interface Question {
  id: string;
  question: string;
  options: string[];
  skill: string;
  correct_answer: string;
  incorrect_answers: string[];
}

interface UserAnswer {
  question: string;
  user_answer: string;
  correct_answer: string;
  is_correct: boolean;
  skill: string;
}

interface CareerPath {
  title: string;
  match_percentage: number;
  reasoning: string;
  required_skills: string[];
  skill_gaps: string[];
  growth_potential: string;
  salary_range: string;
  next_steps: string[];
}

interface Recommendations {
  analysis: string;
  career_paths: CareerPath[];
  skill_improvement_suggestions: Array<{
    skill: string;
    current_level: string;
    recommendation: string;
  }>;
}

export default function AssessmentPage() {
  const { token } = useAuth();
  const [step, setStep] = useState<'input' | 'questions' | 'results'>('input');
  
  // Step 1: Input
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  
  // Step 2: Questions
  const [assessmentId, setAssessmentId] = useState<string>('');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
  
  // Step 3: Results
  const [recommendations, setRecommendations] = useState<Recommendations | null>(null);
  const [overallScore, setOverallScore] = useState(0);
  
  // Loading and error states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

  // Toggle skill selection
  const toggleSkill = (skill: string) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter(s => s !== skill));
    } else {
      if (selectedSkills.length < 5) {
        setSelectedSkills([...selectedSkills, skill]);
      }
    }
  };

  // Toggle interest selection
  const toggleInterest = (interest: string) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(selectedInterests.filter(i => i !== interest));
    } else {
      if (selectedInterests.length < 5) {
        setSelectedInterests([...selectedInterests, interest]);
      }
    }
  };

  // Step 1: Generate Assessment
  const generateAssessment = async () => {
    if (selectedSkills.length === 0) {
      setError('Please select at least one skill');
      return;
    }
    if (selectedInterests.length === 0) {
      setError('Please select at least one interest');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_BASE_URL}/api/ai/generate-assessment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          skills: selectedSkills,
          interests: selectedInterests,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to generate assessment');
      }

      // Store assessment ID and questions
      setAssessmentId(data.data.assessment_id);
      
      // Parse questions from response
      const parsedQuestions: Question[] = data.data.questions.map((q: any, index: number) => ({
        id: q.id || `q${index + 1}`,
        question: q.question,
        options: q.options || [...q.incorrect_answers, q.correct_answer].sort(() => Math.random() - 0.5),
        skill: q.skill,
        correct_answer: q.correct_answer,
        incorrect_answers: q.incorrect_answers,
      }));

      setQuestions(parsedQuestions);
      setStep('questions');
    } catch (err: any) {
      setError(err.message || 'Failed to generate assessment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Handle answer selection
  const handleAnswerSelection = (selectedAnswer: string) => {
    const currentQuestion = questions[currentQuestionIndex];
    
    const answer: UserAnswer = {
      question: currentQuestion.question,
      user_answer: selectedAnswer,
      correct_answer: currentQuestion.correct_answer,
      is_correct: selectedAnswer === currentQuestion.correct_answer,
      skill: currentQuestion.skill,
    };

    const updatedAnswers = [...userAnswers, answer];
    setUserAnswers(updatedAnswers);

    // Move to next question or analyze results
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      analyzeResults(updatedAnswers);
    }
  };

  // Step 3: Calculate scores and get recommendations
  const analyzeResults = async (answers: UserAnswer[]) => {
    setLoading(true);
    setError('');

    try {
      // Calculate scores per skill
      const skillScores: Record<string, { correct: number; total: number }> = {};
      
      answers.forEach(answer => {
        if (!skillScores[answer.skill]) {
          skillScores[answer.skill] = { correct: 0, total: 0 };
        }
        skillScores[answer.skill].total++;
        if (answer.is_correct) {
          skillScores[answer.skill].correct++;
        }
      });

      const results = Object.entries(skillScores).map(([skill, scores]) => ({
        skill,
        score: scores.correct,
        total: scores.total,
        percentage: Math.round((scores.correct / scores.total) * 100),
      }));

      // Get recommendations from backend
      const response = await fetch(`${API_BASE_URL}/api/ai/analyze-results`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          assessment_id: assessmentId,
          skills: selectedSkills,
          interests: selectedInterests,
          results,
          answers,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to analyze results');
      }

      setRecommendations(data.data.recommendations);
      setOverallScore(data.data.overall_score || 0);
      setStep('results');
    } catch (err: any) {
      setError(err.message || 'Failed to analyze results. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Restart assessment
  const restartAssessment = () => {
    setStep('input');
    setSelectedSkills([]);
    setSelectedInterests([]);
    setQuestions([]);
    setCurrentQuestionIndex(0);
    setUserAnswers([]);
    setRecommendations(null);
    setOverallScore(0);
    setError('');
  };

  // Render loading state
  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
          <p className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
            {step === 'input' ? 'Generating your personalized assessment...' : 'Analyzing your results...'}
          </p>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            This may take 10-15 seconds
          </p>
        </div>
      </div>
    );
  }

  // Step 1: Skills and Interests Selection
  if (step === 'input') {
    return (
      <div className="mx-auto max-w-4xl space-y-8 py-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
            Career Assessment
          </h1>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
            Select your skills and interests to get personalized career recommendations
          </p>
        </div>

        {error && (
          <div className="rounded-lg bg-red-50 p-4 text-red-800 dark:bg-red-900/30 dark:text-red-400">
            <div className="flex items-center gap-2">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span>{error}</span>
            </div>
          </div>
        )}

        {/* Skills Selection */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Select Your Skills
            </h2>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {selectedSkills.length}/5 selected
            </span>
          </div>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Choose up to 5 skills you want to be assessed on
          </p>
          
          <div className="mt-6 space-y-4">
            {['Programming', 'Frontend', 'Backend', 'Database', 'Cloud', 'DevOps', 'AI/ML'].map(category => {
              const skillsInCategory = AVAILABLE_SKILLS.filter(s => s.category === category);
              if (skillsInCategory.length === 0) return null;
              
              return (
                <div key={category}>
                  <h3 className="mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                    {category}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {skillsInCategory.map(skill => (
                      <button
                        key={skill.name}
                        onClick={() => toggleSkill(skill.name)}
                        disabled={!selectedSkills.includes(skill.name) && selectedSkills.length >= 5}
                        className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                          selectedSkills.includes(skill.name)
                            ? 'bg-indigo-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-700 dark:text-gray-300'
                        }`}
                      >
                        {skill.name}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Interests Selection */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Select Your Interests
            </h2>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {selectedInterests.length}/5 selected
            </span>
          </div>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Choose up to 5 areas you're interested in
          </p>
          
          <div className="mt-6 flex flex-wrap gap-2">
            {AVAILABLE_INTERESTS.map(interest => (
              <button
                key={interest}
                onClick={() => toggleInterest(interest)}
                disabled={!selectedInterests.includes(interest) && selectedInterests.length >= 5}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                  selectedInterests.includes(interest)
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-700 dark:text-gray-300'
                }`}
              >
                {interest}
              </button>
            ))}
          </div>
        </div>

        {/* Start Button */}
        <div className="flex justify-center">
          <button
            onClick={generateAssessment}
            disabled={selectedSkills.length === 0 || selectedInterests.length === 0}
            className="rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-4 text-lg font-semibold text-white shadow-lg transition-all hover:from-indigo-700 hover:to-purple-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Start Assessment
          </button>
        </div>
      </div>
    );
  }

  // Step 2: Questions
  if (step === 'questions' && questions.length > 0) {
    const currentQuestion = questions[currentQuestionIndex];
    const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

    return (
      <div className="mx-auto max-w-3xl space-y-6 py-8">
        {/* Progress Bar */}
        <div>
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium text-gray-900 dark:text-white">
              Question {currentQuestionIndex + 1} of {questions.length}
            </span>
            <span className="text-gray-600 dark:text-gray-400">
              {Math.round(progress)}% Complete
            </span>
          </div>
          <div className="mt-2 h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700">
            <div
              className="h-2 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Question Card */}
        <div className="rounded-lg border border-gray-200 bg-white p-8 shadow-lg dark:border-gray-700 dark:bg-gray-800">
          <div className="mb-4 inline-block rounded-full bg-indigo-100 px-4 py-1 text-sm font-medium text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400">
            {currentQuestion.skill}
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {currentQuestion.question}
          </h2>

          <div className="mt-8 space-y-3">
            {currentQuestion.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelection(option)}
                className="w-full rounded-lg border-2 border-gray-200 bg-white p-4 text-left text-gray-900 transition-all hover:border-indigo-600 hover:bg-indigo-50 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:hover:bg-indigo-900/20"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border-2 border-gray-300 text-sm font-semibold dark:border-gray-600">
                    {String.fromCharCode(65 + index)}
                  </div>
                  <span>{option}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Step 3: Results
  if (step === 'results' && recommendations) {
    return (
      <div className="mx-auto max-w-5xl space-y-8 py-8">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 text-4xl text-white">
            🎉
          </div>
          <h1 className="mt-4 text-4xl font-bold text-gray-900 dark:text-white">
            Assessment Complete!
          </h1>
          <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
            Your overall score: <span className="font-bold text-indigo-600">{overallScore}%</span>
          </p>
        </div>

        {/* Analysis */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Analysis
          </h2>
          <p className="mt-4 text-gray-700 dark:text-gray-300">
            {recommendations.analysis}
          </p>
        </div>

        {/* Career Paths */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Recommended Career Paths
          </h2>
          <div className="mt-4 space-y-4">
            {recommendations.career_paths.map((career, index) => (
              <div
                key={index}
                className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                        {career.title}
                      </h3>
                      <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-800 dark:bg-green-900/30 dark:text-green-400">
                        {career.match_percentage}% Match
                      </span>
                    </div>
                    <p className="mt-2 text-gray-700 dark:text-gray-300">
                      {career.reasoning}
                    </p>
                  </div>
                </div>

                <div className="mt-6 grid gap-6 md:grid-cols-2">
                  {/* Required Skills */}
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                      Required Skills
                    </h4>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {career.required_skills.map((skill, idx) => (
                        <span
                          key={idx}
                          className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Skill Gaps */}
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                      Skills to Improve
                    </h4>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {career.skill_gaps.map((skill, idx) => (
                        <span
                          key={idx}
                          className="rounded-full bg-orange-100 px-3 py-1 text-xs font-medium text-orange-800 dark:bg-orange-900/30 dark:text-orange-400"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-900">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Growth Potential
                    </p>
                    <p className="mt-1 text-lg font-bold text-gray-900 dark:text-white">
                      {career.growth_potential}
                    </p>
                  </div>
                  <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-900">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Salary Range
                    </p>
                    <p className="mt-1 text-lg font-bold text-gray-900 dark:text-white">
                      {career.salary_range}
                    </p>
                  </div>
                </div>

                {/* Next Steps */}
                <div className="mt-6">
                  <h4 className="font-semibold text-gray-900 dark:text-white">
                    Next Steps
                  </h4>
                  <ul className="mt-3 space-y-2">
                    {career.next_steps.map((step, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <svg
                          className="mt-0.5 h-5 w-5 flex-shrink-0 text-indigo-600"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span className="text-gray-700 dark:text-gray-300">{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Skill Improvement Suggestions */}
        {recommendations.skill_improvement_suggestions.length > 0 && (
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Skill Improvement Plan
            </h2>
            <div className="mt-4 space-y-4">
              {recommendations.skill_improvement_suggestions.map((suggestion, index) => (
                <div
                  key={index}
                  className="rounded-lg border border-gray-200 p-4 dark:border-gray-700"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {suggestion.skill}
                    </h3>
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Current Level: {suggestion.current_level}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
                    {suggestion.recommendation}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-center gap-4">
          <button
            onClick={restartAssessment}
            className="rounded-lg border-2 border-indigo-600 px-8 py-3 font-semibold text-indigo-600 transition-all hover:bg-indigo-50 dark:hover:bg-indigo-900/20"
          >
            Take Another Assessment
          </button>
          <button
            onClick={() => window.location.href = '/user'}
            className="rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-3 font-semibold text-white transition-all hover:from-indigo-700 hover:to-purple-700"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return null;
}

