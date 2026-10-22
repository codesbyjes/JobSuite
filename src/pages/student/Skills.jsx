import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useApp } from '../../context/AppContext.jsx'
import StatusBadge from '../../components/StatusBadge.jsx'

const FILTERS = ['All', 'Identified', 'Assessment Pending', 'Verified', 'Not Passed']
export default function Skills() {
  const { skills } = useApp()
  const [f, setF] = useState('All')
  const list = skills.filter((s) => f === 'All' || s.status === f)
  return (
    <><h1>Skills & verification</h1><p className="mu">Identified means AI-suggested. Verified means you passed a local demo assessment.</p>
      <div className="row" style={{ margin: '12px 0' }}>{FILTERS.map((x) => <button key={x} className={'btn sm' + (f === x ? '' : ' g')} onClick={() => setF(x)}>{x}</button>)}</div>
      {list.length ? <div className="grid g4">{list.map((s) => (
        <div key={s.name} className="card"><b>{s.name}</b><div className="mu sm">{s.category} · from {s.project}</div>
          <StatusBadge status={s.status} />{s.score != null && <div className="sm">Score {s.score}%{s.date ? ' · ' + s.date : ''}</div>}<br />
          <Link className={'btn sm' + (s.status === 'Verified' ? ' g' : '')} to={`/student/assess/${s.name}`}>{s.status === 'Verified' ? 'Retake' : s.status === 'Identified' ? 'Start verification' : 'Take assessment'}</Link></div>
      ))}</div> : <div className="card">No skills with this status yet. Submit a project to identify more.</div>}</>
  )
}
