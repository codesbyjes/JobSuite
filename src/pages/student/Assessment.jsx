
import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useApp } from '../../context/AppContext.jsx'
import { QUIZZES, PASS_MARK } from '../../data/quizzes.js'

export default function Assessment() {
  const { skill } = useParams()
  const { recordAssessment, toast } = useApp()

  const Q = QUIZZES[skill]
  const [i, setI] = useState(0)
  const [a, setA] = useState([])
  const [score, setScore] = useState(null)

  if (!Q) {
    return (
      <>
        <h1>{skill}</h1>
        <div className="card">
          No sample assessment for this skill in the prototype.
          <br />
          <br />
          <Link className="btn g" to="/student/skills">
            Back to skills
          </Link>
        </div>
      </>
    )
  }

  if (score !== null) {
    const passed = score >= PASS_MARK

    return (
      <div
        className="card"
        style={{ maxWidth: 560, textAlign: 'center' }}
      >
        <div
          className="ring"
          style={{ '--p': score, margin: '0 auto 12px' }}
        >
          <span>{score}%</span>
        </div>

        <h2>
          {passed ? `Passed — ${skill} verified 🎉` : 'Not passed'}
        </h2>

        <p className="mu">
          {passed
            ? `You scored above the ${PASS_MARK}% threshold. Your skill is now verified in this local demo.`
            : `You need ${PASS_MARK}% to pass. Review the topic and try again.`}{' '}
          This is a demo result, not an external certification.
        </p>

        {passed ? (
          <Link className="btn" to="/student/skills">
            Back to skills
          </Link>
        ) : (
          <button
            className="btn"
            onClick={() => {
              setI(0)
              setA([])
              setScore(null)
            }}
          >
            Retry
          </button>
        )}
      </div>
    )
  }

  const finish = () => {
    if (a.filter((answer) => answer != null).length < Q.length) {
      toast('Answer every question first')
      return
    }

    const correctAnswers = a.filter(
      (answer, index) => answer === Q[index][2]
    ).length

    const finalScore = Math.round(
      (correctAnswers / Q.length) * 100
    )

    // Save the result through AppContext.
    recordAssessment(skill, finalScore, finalScore >= PASS_MARK)

    // Display the result screen.
    setScore(finalScore)
  }

  const [question, options] = Q[i]

  return (
    <>
      <h1>{skill} assessment</h1>

      <p className="mu">
        Question {i + 1} of {Q.length}
      </p>

      <div
        className="bar"
        style={{ maxWidth: 560, marginBottom: 14 }}
      >
        <i style={{ width: `${((i + 1) / Q.length) * 100}%` }} />
      </div>

      <div className="card" style={{ maxWidth: 560 }}>
        <h3>{question}</h3>

        {options.map((option, index) => (
          <button
            key={index}
            className={'opt' + (a[i] === index ? ' on' : '')}
            onClick={() => {
              const nextAnswers = [...a]
              nextAnswers[i] = index
              setA(nextAnswers)
            }}
          >
            {option}
          </button>
        ))}

        <div className="row" style={{ marginTop: 10 }}>
          <button
            className="btn g"
            disabled={i === 0}
            onClick={() => setI(i - 1)}
          >
            Previous
          </button>

          <span className="sp" />

          {i < Q.length - 1 ? (
            <button
              className="btn"
              onClick={() => {
                if (a[i] == null) {
                  toast('Choose an answer first')
                } else {
                  setI(i + 1)
                }
              }}
            >
              Next
            </button>
          ) : (
            <button className="btn" onClick={finish}>
              Submit assessment
            </button>
          )}
        </div>
      </div>
    </>
  )
}
