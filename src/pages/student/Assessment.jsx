
import { useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { useApp } from '../../context/AppContext.jsx'
import { QUIZZES, PASS_MARK } from '../../data/quizzes.js'

export default function Assessment() {
  const { skill } = useParams()
  const [searchParams] = useSearchParams()
  const { recordAssessment, skills, projects, toast } = useApp()
  const reviewId = searchParams.get('review')
  const project = reviewId
    ? projects.find((item) => item.reviewId === reviewId)
    : null
  const projectIncludesSkill = Boolean(project?.skills?.includes(skill))
  const skillRecord = skills.find((item) => item.name === skill)
  const hasLockedProjectReview = projects.some((item) =>
    item.mentorStatus === 'pending' &&
    !item.assessmentUnlocked &&
    (item.skills || []).includes(skill)
  )
  const mentorApprovalPending = reviewId
    ? !projectIncludesSkill || !project?.assessmentUnlocked
    : (skillRecord?.mentorStatus === 'pending' &&
        !projects.some((item) =>
          item.reviewId === skillRecord.reviewId && item.assessmentUnlocked
        )) ||
      hasLockedProjectReview
  const Q = QUIZZES[skill]
  const [i, setI] = useState(0)
  const [a, setA] = useState([])
  const [score, setScore] = useState(null)

  if (mentorApprovalPending) {
    return (
      <div className="page-enter">
        <header className="page-head">
          <h1>{skill} assessment</h1>
          <p className="mu">Project Submitted → Skill Analysis → Mentor Review → Skill Assessment</p>
        </header>
        <div className="card form-card mentor-review-card">
          <span className="badge b-p">
            {reviewId && !projectIncludesSkill ? 'Project review not found' : 'Waiting for Mentor Approval'}
          </span>
          <h2>Assessment is locked</h2>
          <p>
            {reviewId && !projectIncludesSkill
              ? 'This project review could not be found.'
              : 'This skill is awaiting mentor review. Continue from the project analysis results when assessment access is available.'}
          </p>
          <Link className="btn g" to="/student/submit">Return to project workflow</Link>
        </div>
      </div>
    )
  }

  if (!Q) {
    return (
      <>
        <h1>{skill}</h1>
        <div className="card" style={{ maxWidth: 560 }}>
          No sample assessment for this skill in the prototype.
          <br /><br />
          <Link className="btn g" to="/student/skills">Back to skills</Link>
        </div>
      </>
    )
  }

  if (score !== null) {
    const passed = score >= PASS_MARK

    return (
      <div className="card" style={{ maxWidth: 560, textAlign: 'center' }}>
        {projectIncludesSkill && (
          <span className="badge b-p">Mentor review: Waiting for Mentor Approval</span>
        )}
        <div className="ring" style={{ '--p': score, margin: '0 auto 12px' }}><span>{score}%</span></div>
        <h2>{passed ? `Passed — ${skill} verified 🎉` : 'Not passed'}</h2>
        <p className="mu">
          {passed
            ? `You scored above the ${PASS_MARK}% threshold. Your skill is now verified in this local demo.`
            : `You need ${PASS_MARK}% to pass. Review the topic and try again.`}
          {' '}This is a demo result, not an external certification.
        </p>
        {passed
          ? <Link className="btn" to="/student/skills">Back to skills</Link>
          : <button className="btn" type="button" onClick={() => { setI(0); setA([]); setScore(null) }}>Retry</button>}
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
      <p className="mu">Question {i + 1} of {Q.length}</p>
      {projectIncludesSkill && (
        <p className="mu sm">Mentor review status: Waiting for Mentor Approval</p>
      )}
      <div className="bar" style={{ maxWidth: 560, marginBottom: 14 }}>
        <i style={{ width: `${(i / Q.length) * 100}%` }} />
      </div>
      <div className="card" style={{ maxWidth: 560 }}>
        <h3>{question}</h3>
        {options.map((o, k) => (
          <button
            key={k}
            type="button"
            className={'opt' + (a[i] === k ? ' on' : '')}
            onClick={() => { const n = [...a]; n[i] = k; setA(n) }}
          >
            {o}
          </button>
        ))}
        <div className="row" style={{ marginTop: 10 }}>
          <button className="btn g" type="button" disabled={!i} onClick={() => setI(i - 1)}>Previous</button>
          <span className="sp" />
          {i < Q.length - 1
            ? <button className="btn" type="button" onClick={() => a[i] == null ? toast('Choose an answer first') : setI(i + 1)}>Next</button>
            : <button className="btn" type="button" onClick={finish}>Submit assessment</button>}
        </div>
      </div>
    </>
  )
}
