
import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useApp } from '../../context/AppContext.jsx'
import StatusBadge from '../../components/StatusBadge.jsx'
import { QUIZZES } from '../../data/quizzes.js'

// Prototype evidence only. These are not live AI findings.
const PROJECT_EVIDENCE = {
  Python: [
    'Python source files detected',
    'Functions and data-processing logic found',
  ],
  SQL: [
    'Database queries found in project files',
    'Tables and data relationships referenced',
  ],
  'Web Development': [
    'HTML/CSS interface files found',
    'Web page structure identified',
  ],
  JavaScript: [
    'JavaScript source files found',
    'Event handling or application logic identified',
  ],
  'Data Structures': [
    'Data structure usage needs assessment confirmation',
  ],
  Java: [
    'Java source files need to be linked to a submitted project',
  ],
  'Machine Learning': [
    'Model or training evidence needs further review',
  ],
  'Data Modelling': [
    'Schema or data-relationship evidence needs further review',
  ],
}

const FILTERS = [
  'All',
  'Identified',
  'Assessment Pending',
  'Verified',
  'Not Passed',
]

export default function Skills() {
  const { skills } = useApp()

  const [filter, setFilter] = useState('All')
  const [query, setQuery] = useState('')
  const [expanded, setExpanded] = useState({})

  const counts = useMemo(
    () => ({
      total: skills.length,
      verified: skills.filter((s) => s.status === 'Verified').length,
      pending: skills.filter(
        (s) => s.status === 'Assessment Pending'
      ).length,
      identified: skills.filter(
        (s) => s.status === 'Identified'
      ).length,
    }),
    [skills]
  )

  const list = useMemo(
    () =>
      skills.filter((s) => {
        const matchesStatus =
          filter === 'All' || s.status === filter

        const haystack =
          `${s.name} ${s.category || ''} ${s.project || ''}`.toLowerCase()

        return (
          matchesStatus &&
          haystack.includes(query.trim().toLowerCase())
        )
      }),
    [skills, filter, query]
  )

  const statusHelp = (status) => {
    if (status === 'Verified') {
      return 'Passed the prototype assessment. Mentor confirmation is still required for full verification.'
    }

    if (status === 'Assessment Pending') {
      return 'A sample assessment is available for this skill.'
    }

    if (status === 'Identified') {
      return 'Suggested from mock project analysis. Evidence and skill level have not yet been independently verified.'
    }

    if (status === 'Not Passed') {
      return 'The last assessment did not meet the passing threshold. Review the topic and try again.'
    }

    return 'Verification status is not available.'
  }

  return (
    <>
      <div
        className="row"
        style={{
          alignItems: 'flex-start',
          marginBottom: 18,
        }}
      >
        <div style={{ flex: 1, minWidth: 220 }}>
          <h1>Skills &amp; verification</h1>
          <p className="mu" style={{ marginTop: 6 }}>
            Review the skills associated with your projects,
            inspect the available evidence, and take assessments.
          </p>
        </div>

        <Link className="btn g" to="/student/submit">
          ＋ Submit project
        </Link>
      </div>

      <div className="grid g4" style={{ marginBottom: 18 }}>
        <div className="card">
          <div className="mu sm">Skills identified</div>
          <div
            style={{
              fontSize: 28,
              fontWeight: 800,
              color: 'var(--a2)',
            }}
          >
            {counts.total}
          </div>
        </div>

        <div className="card">
          <div className="mu sm">Verified in demo</div>
          <div
            style={{
              fontSize: 28,
              fontWeight: 800,
              color: 'var(--ok)',
            }}
          >
            {counts.verified}
          </div>
        </div>

        <div className="card">
          <div className="mu sm">Assessments pending</div>
          <div
            style={{
              fontSize: 28,
              fontWeight: 800,
              color: 'var(--or)',
            }}
          >
            {counts.pending}
          </div>
        </div>

        <div className="card">
          <div className="mu sm">Awaiting assessment setup</div>
          <div
            style={{
              fontSize: 28,
              fontWeight: 800,
              color: 'var(--a2)',
            }}
          >
            {counts.identified}
          </div>
        </div>
      </div>

      <div className="card" style={{ marginBottom: 16 }}>
        <div className="flt" style={{ alignItems: 'end' }}>
          <div>
            <label htmlFor="skill-search">
              Search skills or projects
            </label>
            <input
              id="skill-search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g. Python, SQL, CampusConnect"
            />
          </div>

          <div>
            <label htmlFor="skill-filter">
              Verification status
            </label>
            <select
              id="skill-filter"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              {FILTERS.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="row" style={{ marginBottom: 12 }}>
        <h2 style={{ margin: 0 }}>Your skills</h2>
        <span className="sp" />
        <span className="mu sm">
          {list.length} result{list.length === 1 ? '' : 's'}
        </span>
      </div>

      {list.length > 0 ? (
        <div className="grid g2">
          {list.map((skill) => {
            const evidence =
              PROJECT_EVIDENCE[skill.name] || [
                'Project evidence has not been added to this prototype yet',
              ]

            const hasQuiz = Boolean(QUIZZES[skill.name])
            const isExpanded = Boolean(expanded[skill.name])

            return (
              <article
                className="card"
                key={skill.name}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 10,
                }}
              >
                <div
                  className="row"
                  style={{ alignItems: 'flex-start' }}
                >
                  <div
                    style={{
                      width: 42,
                      height: 42,
                      borderRadius: 12,
                      display: 'grid',
                      placeItems: 'center',
                      background:
                        'color-mix(in srgb, var(--a) 18%, transparent)',
                      border: '1px solid var(--bd)',
                      fontWeight: 800,
                      color: 'var(--a2)',
                      flexShrink: 0,
                    }}
                  >
                    {skill.name.slice(0, 2).toUpperCase()}
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h3>{skill.name}</h3>
                    <div className="mu sm">
                      {skill.category || 'Technical skill'}
                    </div>
                  </div>

                  <StatusBadge status={skill.status} />
                </div>

                <div className="sm">
                  <span className="mu">Project: </span>
                  <b>{skill.project || 'Not linked'}</b>
                </div>

                {skill.score != null && (
                  <div>
                    <div
                      className="row sm"
                      style={{
                        justifyContent: 'space-between',
                        marginBottom: 5,
                      }}
                    >
                      <span className="mu">
                        Last demo assessment
                      </span>
                      <b>{skill.score}%</b>
                    </div>

                    <div className="bar">
                      <i
                        style={{
                          width: `${Math.max(
                            0,
                            Math.min(100, skill.score)
                          )}%`,
                        }}
                      />
                    </div>

                    {skill.date && (
                      <div
                        className="mu sm"
                        style={{ marginTop: 5 }}
                      >
                        Recorded {skill.date}
                      </div>
                    )}
                  </div>
                )}

                <div className="sm mu">
                  {statusHelp(skill.status)}
                </div>

                <button
                  type="button"
                  className="btn g sm"
                  aria-expanded={isExpanded}
                  onClick={() =>
                    setExpanded((old) => ({
                      ...old,
                      [skill.name]: !old[skill.name],
                    }))
                  }
                >
                  {isExpanded
                    ? 'Hide project evidence'
                    : 'View project evidence'}
                </button>

                {isExpanded && (
                  <div
                    className="prot"
                    style={{
                      borderRadius: 10,
                      padding: 12,
                    }}
                  >
                    <div style={{ fontWeight: 700, marginBottom: 6 }}>
                      Evidence summary
                    </div>

                    <div
                      className="mu sm"
                      style={{ marginBottom: 8 }}
                    >
                      Illustrative prototype data — these statements
                      are not live AI findings.
                    </div>

                    <ul style={{ margin: 0, paddingLeft: 20 }}>
                      {evidence.map((item) => (
                        <li
                          key={item}
                          className="sm"
                          style={{ marginBottom: 4 }}
                        >
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div
                  className="row"
                  style={{ marginTop: 'auto', paddingTop: 4 }}
                >
                  <span className="sp" />

                  {hasQuiz ? (
                    <Link
                      className="btn"
                      to={`/student/assess/${encodeURIComponent(
                        skill.name
                      )}`}
                    >
                      {skill.status === 'Verified'
                        ? 'Retake assessment'
                        : 'Start assessment'}
                    </Link>
                  ) : (
                    <span
                      className="mu sm"
                      title="Add questions for this skill in src/data/quizzes.js"
                    >
                      Quiz setup required
                    </span>
                  )}
                </div>
              </article>
            )
          })}
        </div>
      ) : (
        <div className="card">
          <h3>No matching skills</h3>
          <p className="mu">
            Try another search or choose a different status filter.
            You can also submit a project to identify more skills.
          </p>
          <Link className="btn g" to="/student/submit">
            Submit a project
          </Link>
        </div>
      )}

      <p className="mu sm" style={{ marginTop: 18 }}>
        Prototype note: skills and evidence currently use local mock
        data. Passing an assessment in this demo is not an external
        certification or final mentor verification.
      </p>
    </>
  )
}
