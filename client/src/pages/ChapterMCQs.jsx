import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { FaArrowLeft, FaCheckCircle } from 'react-icons/fa';
import api from '../api/axios';

const ChapterMCQs = () => {
  const { slug, chapterId } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [answers, setAnswers] = useState([]);

  useEffect(() => {
    api.get(`/books/${slug}/chapters/${chapterId}/mcqs`).then(({ data }) => {
      setData(data);
      setLoading(false);
    });
  }, [slug, chapterId]);

  const startQuiz = (mcqSet) => {
    setActiveQuiz(mcqSet);
    setCurrentQuestion(0);
    setScore(0);
    setAnswers([]);
    setShowResults(false);
    setSelectedOption(null);
  };

  const handleAnswer = () => {
    const question = activeQuiz.questions[currentQuestion];
    const isCorrect = selectedOption === question.correctIndex;
    
    if (isCorrect) setScore(score + 1);
    setAnswers([...answers, { question: currentQuestion, selected: selectedOption, correct: isCorrect }]);
    
    if (currentQuestion + 1 < activeQuiz.questions.length) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedOption(null);
    } else {
      setShowResults(true);
    }
  };

  if (loading) return <div className="flex justify-center py-20"><div className="animate-spin h-8 w-8 border-b-2 border-primary"></div></div>;

  if (!data) return <div className="text-center py-20">No data found</div>;

  const { chapter, mcqs } = data;

  // Quiz in progress
  if (activeQuiz && !showResults) {
    const question = activeQuiz.questions[currentQuestion];
    return (
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="bg-white rounded-xl shadow-sm p-8">
          <div className="flex justify-between items-center mb-6">
            <span className="text-sm text-gray-500">Question {currentQuestion + 1} of {activeQuiz.questions.length}</span>
            <span className="text-sm font-medium">Score: {score}</span>
          </div>
          <h2 className="text-xl font-semibold mb-6">{question.question}</h2>
          <div className="space-y-3 mb-6">
            {question.options.map((option, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedOption(idx)}
                className={`w-full text-left p-4 rounded-lg border-2 transition-colors ${
                  selectedOption === idx ? 'border-primary bg-orange-50' : 'border-gray-200 hover:border-primary'
                }`}
              >
                <span className="font-semibold mr-3">{String.fromCharCode(65 + idx)}.</span>
                {option}
              </button>
            ))}
          </div>
          <button
            onClick={handleAnswer}
            disabled={selectedOption === null}
            className="btn-primary w-full disabled:opacity-50"
          >
            {currentQuestion + 1 < activeQuiz.questions.length ? 'Next Question' : 'Finish Quiz'}
          </button>
        </div>
      </div>
    );
  }

  // Results
  if (showResults) {
    const percentage = Math.round((score / activeQuiz.questions.length) * 100);
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 text-center">
        <div className="bg-white rounded-xl shadow-sm p-8">
          <FaCheckCircle className={`text-6xl mx-auto mb-4 ${percentage >= 70 ? 'text-green-500' : percentage >= 40 ? 'text-yellow-500' : 'text-red-500'}`} />
          <h2 className="text-2xl font-bold mb-2">Quiz Complete!</h2>
          <p className="text-4xl font-bold text-primary mb-2">{score}/{activeQuiz.questions.length}</p>
          <p className="text-gray-600 mb-6">{percentage}% correct</p>
          <div className="flex gap-4 justify-center">
            <button onClick={() => startQuiz(activeQuiz)} className="btn-primary">Try Again</button>
            <button onClick={() => setActiveQuiz(null)} className="bg-gray-100 text-gray-700 px-6 py-3 rounded-lg">Back to MCQs</button>
          </div>
        </div>
      </div>
    );
  }

  // MCQ List
  return (
    <>
      <Helmet><title>{chapter?.name} - MCQs - Madu Web Tech</title></Helmet>
      
      <div className="bg-dark text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <Link to={`/mcqs/book/${slug}`} className="text-gray-400 hover:text-white flex items-center gap-2 mb-4">
            <FaArrowLeft /> Back to Chapters
          </Link>
          <h1 className="text-3xl font-bold text-white">{chapter?.name}</h1>
          <p className="text-gray-400 mt-2">{mcqs?.length || 0} MCQ Sets Available</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12">
        {mcqs?.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-gray-500">No MCQs available for this chapter yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {mcqs?.map((mcq) => (
              <div key={mcq._id} className="card p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-semibold text-lg mb-1">{mcq.title}</h3>
                    <p className="text-sm text-gray-500 capitalize">{mcq.difficulty} • {mcq.questions?.length || 0} Questions</p>
                  </div>
                </div>
                <button 
                  onClick={() => startQuiz(mcq)}
                  className="btn-primary"
                >
                  Start Quiz
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default ChapterMCQs;
