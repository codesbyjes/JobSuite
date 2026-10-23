import { Link, useParams } from 'react-router-dom'
import { useApp } from '../../context/AppContext.jsx'
import { CANDIDATES } from '../../data/candidates.js'
import { JOBS } from '../../data/jobs.js'
import { toPublicProfile, matchJob, initials } from '../../utils/match.js'

export default function CandidateProfile() {
  const { id } = useParams()
  const { shortlist, toggleShortlist, filters } = useApp()
  if (!CANDIDATES[id]) return <div className="card empty-state">Candidate not found. <Link to="/recruiter/talent">Back to talent discovery</Link></div>
  const c = toPublicProfile(CANDIDATES[id]) // approved fields only
  const job = JOBS.find((j) => String(j.id) === String(filters.job)), m = matchJob(c, job)
  return (
    <>
      <Link className="btn g sm" to="/recruiter/talent">← Back</Link><br /><br />
      <div className="card row"><div className="av" style={{ width: 64, height: 64 }}>{initials(c.name)}</div>
        <div className="sp"><h1 style={{ margin: 0 }}>{c.name}</h1><div className="mu">{c.city} · {c.college} · Class of {c.gradYear}</div><div className="mu sm">Resume, LinkedIn and GitHub profile links: demo placeholders</div></div>
        <button className="btn" onClick={() => toggleShortlist(c.id)}>{shortlist[c.id] ? 'Remove from shortlist' : 'Shortlist'}</button></div><br />
      <div className="grid g2">
        <div className="card"><h2>Verified skills</h2>
          {Object.entries(c.skills).map(([k, v]) => <span key={k} className="badge b-v">✔ {k} · {v}%</span>)}{!Object.keys(c.skills).length && <span className="mu">None yet</span>}
          <h3 style={{ marginTop: 14 }}>Work preferences</h3>
          <p className="sm">Preferred cities: {c.preferredLocations.join(', ')}<br />Relocation: {c.willingToRelocate ? 'Yes' : 'No'} · Remote: {c.remotePreference ? 'Yes' : 'No'}</p></div>
        <div className="card"><h2>Job match</h2>
          {m ? <><b style={{ fontSize: 28, color: 'var(--a)' }}>{m.pct}%</b> for {job.title}<p className="sm">Matched {m.matched.length} of {job.requiredSkills.length} required verified skills.<br />Matched: {m.matched.join(', ') || 'none'}<br />Missing: {m.missing.join(', ') || 'none'}<br />Formula: matched ÷ required × 100.</p></> : <p className="mu">Select a target role in Talent discovery to see a match breakdown.</p>}</div>
      </div><br />
      <div className="card prot"><h2>🔒 Protected project details</h2><p className="sm">JobSuite uses submitted project evidence to identify potential skills. Submitted repositories, source code and full project files are not available to recruiters through this profile.</p></div>
    </>
  )
}
