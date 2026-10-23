import { useMemo, useState } from 'react'
import { useApp } from '../../context/AppContext.jsx'
import { OPPORTUNITIES } from '../../data/opportunities.js'

export default function Opportunities() {
  const { skills, toast } = useApp()
  const [query, setQuery] = useState('')
  const [location, setLocation] = useState('')
  const [type, setType] = useState('')
  const [skill, setSkill] = useState('')
  const [expanded, setExpanded] = useState({})
  const [interested, setInterested] = useState({})

  const skillNames = skills.map((item) => item.name.toLowerCase())
  const locations = [...new Set(OPPORTUNITIES.map((job) => job.location))]
  const types = [...new Set(OPPORTUNITIES.map((job) => job.type.split(' · ')[0]))]
  const allSkills = [...new Set(OPPORTUNITIES.flatMap((job) => job.skills))].sort()

  const filtered = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()
    return OPPORTUNITIES.filter((job) => {
      const searchable = [
        job.title,
        job.company,
        job.location,
        job.type,
        job.description,
        ...job.skills,
      ].join(' ').toLowerCase()

      return (
        (!normalizedQuery || searchable.includes(normalizedQuery)) &&
        (!location || job.location === location) &&
        (!type || job.type.startsWith(type)) &&
        (!skill || job.skills.includes(skill))
      )
    })
  }, [location, query, skill, type])

  const expressInterest = (job) => {
    setInterested((current) => ({ ...current, [job.id]: true }))
    toast(`Interest marked for ${job.title}.`)
  }

  return (
    <div className="page-enter">
      <header className="page-head">
        <h1>Opportunities</h1>
        <p className="mu">
          Explore early-career roles that value demonstrated skills and project work.
        </p>
      </header>

      <section className="card opportunity-filters" aria-label="Filter opportunities">
        <div className="flt">
          <input
            aria-label="Search opportunities"
            placeholder="Search roles, companies, or skills"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          <select aria-label="Filter by location" value={location} onChange={(event) => setLocation(event.target.value)}>
            <option value="">All locations</option>
            {locations.map((item) => <option key={item}>{item}</option>)}
          </select>
          <select aria-label="Filter by job type" value={type} onChange={(event) => setType(event.target.value)}>
            <option value="">All job types</option>
            {types.map((item) => <option key={item}>{item}</option>)}
          </select>
          <select aria-label="Filter by required skill" value={skill} onChange={(event) => setSkill(event.target.value)}>
            <option value="">Any required skill</option>
            {allSkills.map((item) => <option key={item}>{item}</option>)}
          </select>
        </div>
        <p className="mu sm opportunity-count">
          {filtered.length} {filtered.length === 1 ? 'listing' : 'listings'} · Skill overlap is based on your profile
        </p>
      </section>

      {filtered.length ? (
        <div className="opportunity-list">
          {filtered.map((job) => {
            const matches = job.skills.filter((required) =>
              skillNames.includes(required.toLowerCase())
            )

            return (
              <article className="card opportunity-card" key={job.id}>
                <div className="opportunity-heading">
                  <div>
                    <span className="badge b-p">Unverified listing</span>
                    <h2>{job.title}</h2>
                    <p className="opportunity-company">{job.company}</p>
                  </div>
                  <span className="badge b-p">{job.location}</span>
                </div>

                <div className="opportunity-meta">
                  <span>{job.type}</span>
                  <span>{job.experience}</span>
                </div>

                <div className="opportunity-skills" aria-label="Required skills">
                  {job.skills.map((required) => (
                    <span className="badge b-v" key={required}>{required}</span>
                  ))}
                </div>
                <p className="mu sm">
                  {matches.length
                    ? `${matches.length} required ${matches.length === 1 ? 'skill overlaps' : 'skills overlap'} with your profile.`
                    : 'Build relevant project evidence to strengthen your profile for this role.'}
                </p>

                {expanded[job.id] && (
                  <div className="opportunity-detail">
                    <p>{job.description}</p>
                    <p><b>Experience / eligibility:</b> {job.experience}</p>
                    <p><b>Required skills:</b> {job.skills.join(', ')}</p>
                  </div>
                )}

                {interested[job.id] && (
                  <p className="interest-feedback" role="status">
                    Interest marked for {job.title}.
                  </p>
                )}

                <div className="row opportunity-actions">
                  <button
                    className="btn g sm"
                    type="button"
                    aria-expanded={Boolean(expanded[job.id])}
                    onClick={() => setExpanded((current) => ({
                      ...current,
                      [job.id]: !current[job.id],
                    }))}
                  >
                    {expanded[job.id] ? 'Hide Details' : 'View Details'}
                  </button>
                  <button
                    className="btn sm"
                    type="button"
                    disabled={Boolean(interested[job.id])}
                    onClick={() => expressInterest(job)}
                  >
                    {interested[job.id] ? 'Interest Marked' : 'Express Interest'}
                  </button>
                </div>
              </article>
            )
          })}
        </div>
      ) : (
        <div className="card">No opportunities match these filters. Try clearing a filter.</div>
      )}
    </div>
  )
}
