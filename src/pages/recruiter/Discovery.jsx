import { useMemo } from 'react'
import { useApp, DEFAULT_FILTERS } from '../../context/AppContext.jsx'
import { CANDIDATES } from '../../data/candidates.js'
import { JOBS } from '../../data/jobs.js'
import { toPublicProfile, matchJob, avgScore, verifiedCount } from '../../utils/match.js'
import CandidateRow from '../../components/CandidateRow.jsx'

export default function Discovery() {
  const { filters: f, setFilters } = useApp()
  const set = (k) => (e) => setFilters({ ...f, [k]: e.target.value })
  const job = JOBS.find((j) => String(j.id) === String(f.job))
  const all = useMemo(() => CANDIDATES.map(toPublicProfile), [])
  const skillOpts = [...new Set(all.flatMap((c) => Object.keys(c.skills)))].sort()
  const list = useMemo(() => {
    const q = f.q.toLowerCase()
    const L = all.filter((c) => (!q || (c.name + Object.keys(c.skills).join(' ')).toLowerCase().includes(q)) && (!f.city || c.city === f.city) && (!f.skill || f.skill in c.skills) && (!f.level || c.level === f.level) && (f.work !== 'remote' || c.remotePreference) && (f.work !== 'reloc' || c.willingToRelocate)).map((c) => ({ c, m: matchJob(c, job) }))
    return L.sort((a, b) => f.sort === 'name' ? a.c.name.localeCompare(b.c.name) : f.sort === 'score' ? avgScore(b.c) - avgScore(a.c) : (b.m ? b.m.pct : verifiedCount(b.c)) - (a.m ? a.m.pct : verifiedCount(a.c)))
  }, [all, f, job])
  const Sel = ({ k, ph, opts }) => <select aria-label={ph} value={f[k]} onChange={set(k)}><option value="">{ph}</option>{opts.map(([v, l]) => <option key={v} value={v}>{l}</option>)}</select>
  return (
    <>
      <h1>Find the right talent.</h1><p className="mu">Match skills to opportunities — not college prestige.</p><br />
      <div className="card demo-note" role="note">
        <b>Fictional sample candidate profiles · Demo only</b>
        <span className="mu sm">These profiles and skill matches are illustrative, not real candidates or hiring recommendations.</span>
      </div><br />
      <div className="card"><div className="flt">
        <input aria-label="Search" placeholder="Search name or skill" value={f.q} onChange={set('q')} />
        <Sel k="city" ph="All cities" opts={[...new Set(all.map((c) => c.city))].map((x) => [x, x])} />
        <Sel k="skill" ph="Any verified skill" opts={skillOpts.map((x) => [x, x])} />
        <Sel k="level" ph="Any experience" opts={[['Fresher', 'Fresher'], ['Junior', 'Junior']]} />
        <Sel k="job" ph="Target role: none" opts={JOBS.map((j) => [j.id, j.title])} />
        <Sel k="work" ph="Any work preference" opts={[['remote', 'Open to remote'], ['reloc', 'Willing to relocate']]} />
        <select aria-label="Sort" value={f.sort} onChange={set('sort')}><option value="match">Best match</option><option value="score">Assessment score</option><option value="name">Name</option></select>
      </div>
        <div className="row" style={{ marginTop: 10 }}><span className="mu sm">{list.length} candidates{job ? ` · match = verified required skills ÷ ${job.requiredSkills.length} required` : ''}. College is never used in ranking.</span><span className="sp" /><button className="btn g sm" onClick={() => setFilters(DEFAULT_FILTERS)}>Clear filters</button></div></div><br />
      {list.length ? list.map(({ c, m }) => <CandidateRow key={c.id} c={c} job={job} m={m} />) : <div className="card">No candidates match these filters. Clear a filter to widen the search.</div>}
    </>
  )
}
