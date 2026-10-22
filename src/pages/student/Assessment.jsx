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

  if (!Q) return <><h1>{skill}</h1><div className="card">No sample assessment for this skill in the prototype.<br /><br /><Link className="btn g" to="/student/skills">Back to skills</Link></div></>
  if (score !== null) {
    const ok = score >= PASS_MARK
    return (
      <div className="card" style={{ maxWidth: 560, textAlign: 'center' }}>
        <div className="ring" style={{ '--p': score, margin: '0 auto 12px' }}><span>{score}%</span></div>
        <h2>{ok ? `Passed — ${skill} verified 🎉` : 'Not passed'}</h2>
        <p className="mu">{ok ? `You scored above the ${PASS_MARK}% threshold. Your skill is now verified in this local demo.` : `You need ${PASS_MARK}% to pass. Review the topic and try again.`} This is a demo result, not an external certification.</p>
        {ok ? <Link className="btn" to="/student/skills">Back to skills</Link> : <button className="btn" onClick={() => { setI(0); setA([]); setScore(null) }}>Retry</button>}
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
    <><h1>{skill} assessment</h1><p className="mu">Question {i + 1} of {Q.length}</p>
      <div className="bar" style={{ maxWidth: 560, marginBottom: 14 }}><i style={{ width: `${(i / Q.length) * 100}%` }} /></div>
      <div className="card" style={{ maxWidth: 560 }}><h3>{q}</h3>
        {opts.map((o, k) => <button key={k} className={'opt' + (a[i] === k ? ' on' : '')} onClick={() => { const n = [...a]; n[i] = k; setA(n) }}>{o}</button>)}
        <div className="row" style={{ marginTop: 10 }}><button className="btn g" disabled={!i} onClick={() => setI(i - 1)}>Previous</button><span className="sp" />
          {i < Q.length - 1 ? <button className="btn" onClick={() => a[i] == null ? toast('Choose an answer first') : setI(i + 1)}>Next</button> : <button className="btn" onClick={finish}>Submit assessment</button>}</div></div></>
  )
}
