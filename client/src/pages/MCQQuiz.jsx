import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/axios';

const MCQQuiz = () => {
  const { id } = useParams();
  const [mcqSet, setMcqSet] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [answers, setAnswers] = useState([]);

  useEffect(() => {
    api.get(`/mcqs/${id}`).then(({ data }) => setMcqSet(data.mcqSet));
  }, [id]);

  const handleAnswer = () => {
    const isCorrect = selectedOption === mcqSet.questions[currentQuestion].correctIndex;
    if (isCorrect) setScore(score + 1);
    setAnswers([...answers, { question: currentQuestion, selected: selectedOption, correct: isCorrect }]);
    
    if (currentQuestion + 1 < mcqSet.questions.length) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedOption(null);
    } else {
      setShowResults(true);
    }
  };

  if (!mcqSet) return <div className="text-center py-20">Loading...</div>;

  if (showResults) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 text-center">
        <h1 className="text-3xl font-bold mb-4">Quiz Complete!</h1>
        <p className="text-xl mb-4">Score: {score} / {mcqSet.questions.length}</p>
        <p className="text-gray-600 mb-6">{Math.round((score / mcqSet.questions.length) * 100)}% correct</p>
        <button onClick={() => window.location.reload()} className="btn-primary">Try Again</button>
      </div>
    );
  }

  const question = mcqSet.questions[currentQuestion];

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="bg-white rounded-xl shadow-sm p-8">
        <div className="flex justify-between items-center mb-6">
          <span className="text-sm text-gray-500">Question {currentQuestion + 1} of {mcqSet.questions.length}</span>
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
          {currentQuestion + 1 < mcqSet.questions.length ? 'Next Question' : 'Finish Quiz'}
        </button>
      </div>
    </div>
  );
};

export default MCQQuiz;
