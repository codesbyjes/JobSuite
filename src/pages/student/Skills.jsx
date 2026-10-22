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
    <div className="page-enter">
      <header className="page-head">
        <h1>Skills & verification</h1>
        <p className="mu">Identified means AI-suggested. Verified means you passed a local demo assessment.</p>
      </header>
      <div className="row filter-row">
        {FILTERS.map((x) => (
          <button
            key={x}
            type="button"
            className={'btn sm' + (f === x ? '' : ' g')}
            aria-pressed={f === x}
            onClick={() => setF(x)}
          >
            {x}
          </button>
        ))}
      </div>
      {list.length ? (
        <div className="grid g4 stagger">
          {list.map((s) => (
            <div key={s.name} className="card skill-card">
              <b>{s.name}</b>
              <div className="mu sm">{s.category} · from {s.project}</div>
              <StatusBadge status={s.status} />
              {s.score != null && (
                <div className="sm">Score {s.score}%{s.date ? ' · ' + s.date : ''}</div>
              )}
              <Link
                className={'btn sm' + (s.status === 'Verified' ? ' g' : '')}
                to={`/student/assess/${s.name}`}
              >
                {s.status === 'Verified' ? 'Retake' : s.status === 'Identified' ? 'Start verification' : 'Take assessment'}
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <div className="card">No skills with this status yet. Submit a project to identify more.</div>
      )}
    </div>
  )
}
