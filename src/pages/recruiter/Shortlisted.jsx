import { Link } from 'react-router-dom'
import { useApp } from '../../context/AppContext.jsx'
import { CANDIDATES } from '../../data/candidates.js'
import { JOBS } from '../../data/jobs.js'
import { toPublicProfile, matchJob, initials } from '../../utils/match.js'

export default function Shortlisted() {
  const { shortlist, toggleShortlist, filters } = useApp()
  const job = JOBS.find((j) => String(j.id) === String(filters.job))
  const ids = Object.keys(shortlist)
  return (
    <><h1>Shortlisted</h1><br />
      {ids.length ? ids.map((id) => {
        const c = toPublicProfile(CANDIDATES[id]), m = matchJob(c, job)
        return (
          <div key={id} className="card row" style={{ marginBottom: 10 }}><div className="av">{initials(c.name)}</div>
            <div style={{ flex: 1, minWidth: 200 }}><b>{c.name}</b><div className="mu sm">{c.city} · shortlisted {shortlist[id]}</div>
              {Object.keys(c.skills).map((k) => <span key={k} className="badge b-v">{k}</span>)}{m && <div className="sm">{job.title} match: {m.pct}%</div>}</div>
            <Link className="btn g sm" to={`/recruiter/candidate/${id}`}>View profile</Link>
            <button className="btn g sm" onClick={() => toggleShortlist(c.id)}>Remove from shortlist</button></div>
        )
      }      ) : <div className="card empty-state">No one shortlisted yet. Open Talent discovery and shortlist candidates you want to follow up with.</div>}</>
  )
}
