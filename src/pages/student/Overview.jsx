import { Link } from 'react-router-dom'
import { useApp } from '../../context/AppContext.jsx'
import Kpi from '../../components/Kpi.jsx'
import StatusBadge from '../../components/StatusBadge.jsx'

export default function Overview() {
  const { skills, projects, activity } = useApp()
  const ver = skills.filter((s) => s.status === 'Verified').length
  const pend = skills.filter((s) => s.status === 'Assessment Pending').length
  return (
    <div className="page-enter">
      <header className="page-head">
        <h1>Hey, Jeslene! 👋</h1>
        <p className="mu">Keep building. Your skills create your opportunities.</p>
      </header>
      <div className="stack">
        <div className="grid g4 stagger">
          <Kpi label="Projects submitted" value={projects.length} />
          <Kpi label="Skills identified" value={skills.length} />
          <Kpi label="Skills verified" value={ver} />
          <Kpi label="Assessments pending" value={pend} />
        </div>
        <div className="grid g2">
          <div className="card">
            <h2>Skill verification progress</h2>
            <div className="row">
              <div className="ring" style={{ '--p': Math.round((ver / skills.length) * 100) }}>
                <span>{ver}/{skills.length}</span>
              </div>
              <div>
                {skills.slice(0, 6).map((s) => (
                  <div key={s.name} className="sm" style={{ padding: '4px 0' }}>
                    {s.name} <StatusBadge status={s.status} />
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="card">
            <h2>Your next steps</h2>
            <Link className="btn g" style={{ display: 'flex', marginBottom: 8 }} to="/student/assess/JavaScript">
              Take the JavaScript assessment
            </Link>
            <Link className="btn g" style={{ display: 'flex', marginBottom: 8 }} to="/student/assess/Data Structures">
              Verify Data Structures
            </Link>
            <Link className="btn g" style={{ display: 'flex' }} to="/student/submit">
              Submit another project
            </Link>
          </div>
        </div>
        <div className="grid g2">
          <div className="card">
            <h2>Recent projects</h2>
            {projects.map((p, i) => (
              <div key={i} className="list-row">
                <div>
                  <b>{p.title}</b>
                  <div className="mu sm">GitHub · {p.date} · analysed</div>
                </div>
                <span className="sp" />
                <span className="badge b-i">{p.skillCount} potential skills</span>
              </div>
            ))}
          </div>
          <div className="card">
            <h2>Recent activity</h2>
            {activity.slice(0, 6).map((a, i) => (
              <div key={i} className="sm activity-item">{a}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
