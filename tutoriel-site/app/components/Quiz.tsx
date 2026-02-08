'use client'

import { useState } from 'react'

interface Question {
  question: string
  options: string[]
  correctIndex: number
  explanation: string
}

interface QuizProps {
  questions: Question[]
  moduleId: string
}

export default function Quiz({ questions, moduleId }: QuizProps) {
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>(new Array(questions.length).fill(-1))
  const [showResults, setShowResults] = useState(false)

  const handleAnswer = (questionIndex: number, optionIndex: number) => {
    const newAnswers = [...selectedAnswers]
    newAnswers[questionIndex] = optionIndex
    setSelectedAnswers(newAnswers)
  }

  const handleSubmit = () => {
    setShowResults(true)
    const score = selectedAnswers.filter((answer, index) => answer === questions[index].correctIndex).length
    if (score === questions.length) {
      // Save completion to localStorage
      const progress = JSON.parse(localStorage.getItem('tutoriel-progress') || '{}')
      progress[moduleId] = true
      localStorage.setItem('tutoriel-progress', JSON.stringify(progress))
    }
  }

  const score = selectedAnswers.filter((answer, index) => answer === questions[index].correctIndex).length
  const isPerfect = score === questions.length

  return (
    <div className="bg-white rounded-lg shadow-md p-6 my-8">
      <h3 className="text-2xl font-bold mb-4 text-gray-900">Quiz de Validation 📝</h3>
      <p className="text-gray-600 mb-6">
        Testez vos connaissances avant de passer au module suivant.
      </p>

      <div className="space-y-6">
        {questions.map((q, qIndex) => (
          <div key={qIndex} className="border-b border-gray-200 pb-6 last:border-0">
            <p className="font-semibold mb-3 text-gray-900">
              {qIndex + 1}. {q.question}
            </p>
            <div className="space-y-2">
              {q.options.map((option, oIndex) => {
                const isSelected = selectedAnswers[qIndex] === oIndex
                const isCorrect = oIndex === q.correctIndex
                const showCorrection = showResults && isSelected

                return (
                  <button
                    key={oIndex}
                    onClick={() => handleAnswer(qIndex, oIndex)}
                    disabled={showResults}
                    className={`w-full text-left px-4 py-3 rounded-lg border transition-colors ${
                      showCorrection
                        ? isCorrect
                          ? 'bg-green-100 border-green-500'
                          : 'bg-red-100 border-red-500'
                        : isSelected
                        ? 'bg-blue-100 border-blue-500'
                        : 'bg-gray-50 border-gray-300 hover:bg-gray-100'
                    } ${showResults ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                  >
                    <span className="text-gray-800">{option}</span>
                    {showCorrection && (
                      <span className="ml-2">
                        {isCorrect ? '✅' : '❌'}
                      </span>
                    )}
                  </button>
                )
              })}
            </div>
            {showResults && (
              <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-gray-700">
                  <strong>Explication :</strong> {q.explanation}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      {!showResults ? (
        <button
          onClick={handleSubmit}
          disabled={selectedAnswers.includes(-1)}
          className={`mt-6 px-6 py-3 rounded-lg font-semibold transition-colors ${
            selectedAnswers.includes(-1)
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          Valider mes réponses
        </button>
      ) : (
        <div className={`mt-6 p-4 rounded-lg ${isPerfect ? 'bg-green-100' : 'bg-yellow-100'}`}>
          <p className="text-lg font-semibold mb-2">
            {isPerfect ? '🎉 Parfait !' : '📊 Résultat'}
          </p>
          <p className="text-gray-800">
            Score : {score} / {questions.length} ({Math.round((score / questions.length) * 100)}%)
          </p>
          {isPerfect && (
            <p className="text-sm text-green-800 mt-2">
              ✅ Module validé ! Vous pouvez passer au suivant.
            </p>
          )}
        </div>
      )}
    </div>
  )
}
