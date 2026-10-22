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
      <div className="page-enter">
        <header className="page-head">
          <h1>{skill}</h1>
        </header>
        <div className="card form-card">
          No sample assessment for this skill in the prototype.
          <div className="row" style={{ marginTop: 16 }}>
            <Link className="btn g" to="/student/skills">Back to skills</Link>
          </div>
        </div>
      </div>
    )
  }
  if (score !== null) {
    const ok = score >= PASS_MARK
    return (
      <div className="page-enter card assess-wrap" style={{ textAlign: 'center' }}>
        <div className="ring" style={{ '--p': score, margin: '0 auto 12px' }}><span>{score}%</span></div>
        <h2>{ok ? `Passed — ${skill} verified 🎉` : 'Not passed'}</h2>
        <p className="mu">
          {ok
            ? `You scored above the ${PASS_MARK}% threshold. Your skill is now verified in this local demo.`
            : `You need ${PASS_MARK}% to pass. Review the topic and try again.`}
          {' '}This is a demo result, not an external certification.
        </p>
        {ok
          ? <Link className="btn" to="/student/skills">Back to skills</Link>
          : <button className="btn" type="button" onClick={() => { setI(0); setA([]); setScore(null) }}>Retry</button>}
      </div>
    )
  }
  const finish = () => {
    if (a.filter((x) => x != null).length < Q.length) return toast('Answer every question first')
    const sc = Math.round((a.filter((x, k) => x === Q[k][2]).length / Q.length) * 100)
    recordAssessment(skill, sc, sc >= PASS_MARK); setScore(sc)
  }
  const [q, opts] = Q[i]
  return (
    <div className="page-enter">
      <header className="page-head">
        <h1>{skill} assessment</h1>
        <p className="mu">Question {i + 1} of {Q.length}</p>
      </header>
      <div className="bar assess-wrap" style={{ marginBottom: 14 }}>
        <i style={{ width: `${(i / Q.length) * 100}%` }} />
      </div>
      <div className="card assess-wrap">
        <h3>{q}</h3>
        {opts.map((o, k) => (
          <button
            key={k}
            type="button"
            className={'opt' + (a[i] === k ? ' on' : '')}
            onClick={() => { const n = [...a]; n[i] = k; setA(n) }}
          >
            {o}
          </button>
        ))}
        <div className="row" style={{ marginTop: 12 }}>
          <button className="btn g" type="button" disabled={!i} onClick={() => setI(i - 1)}>Previous</button>
          <span className="sp" />
          {i < Q.length - 1
            ? <button className="btn" type="button" onClick={() => a[i] == null ? toast('Choose an answer first') : setI(i + 1)}>Next</button>
            : <button className="btn" type="button" onClick={finish}>Submit assessment</button>}
        </div>
      </div>
    </div>
  )
}
