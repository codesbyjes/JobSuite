import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useApp } from '../../context/AppContext.jsx'
import { CATEGORY_SKILLS } from '../../data/quizzes.js'

const STAGES = ['Reading project metadata', 'Identifying technologies', 'Analysing potential skills', 'Preparing skill assessments']
const EMPTY = { title: '', desc: '', url: '', cat: 'Web Development', tech: '' }

export default function SubmitProject() {
  const { addProject, toast } = useApp()
  const [step, setStep] = useState(1)
  const [f, setF] = useState(EMPTY)
  const [err, setErr] = useState({})
  const [conf, setConf] = useState(false)
  const [stage, setStage] = useState(0)
  const [res, setRes] = useState(null)
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value })

  useEffect(() => {
    if (step !== 3) return
    let s = 0
    const t = setInterval(() => {
      s++; setStage(s)
      if (s >= STAGES.length) { clearInterval(t); const sk = CATEGORY_SKILLS[f.cat]; addProject(f.title, f.cat, sk); setRes({ title: f.title, sk }); toast('Analysis complete (simulated)') }
    }, 900)
    return () => clearInterval(t)
  }, [step]) // eslint-disable-line

  const next = () => {
    const e = {}
    if (!f.title.trim()) e.title = 'Enter a project title.'
    if (!f.desc.trim()) e.desc = 'Enter a short description.'
    if (!/^https?:\/\/(www\.)?github\.com\/[\w.-]+\/[\w.-]+/i.test(f.url.trim())) e.url = 'Enter a URL like https://github.com/user/repo.'
    setErr(e); if (!Object.keys(e).length) setStep(2)
  }
  const submit = () => { if (!conf) return setErr({ conf: 'Tick the box to continue.' }); setErr({}); setStage(0); setRes(null); setStep(3) }
  const reset = () => { setF(EMPTY); setConf(false); setRes(null); setStep(1) }

  if (step === 1) return (
    <><h1>Submit a project</h1><p className="mu">Step 1 of 3 · Project details</p>
      <div className="card" style={{ maxWidth: 640 }}>
        <label htmlFor="t">Project title *</label><input id="t" value={f.title} onChange={set('title')} /><div className="err">{err.title}</div>
        <label htmlFor="d">Short description *</label><textarea id="d" rows="3" value={f.desc} onChange={set('desc')} /><div className="err">{err.desc}</div>
        <label htmlFor="u">GitHub repository URL *</label><input id="u" placeholder="https://github.com/you/project" value={f.url} onChange={set('url')} /><div className="err">{err.url}</div>
        <label htmlFor="c">Category</label><select id="c" value={f.cat} onChange={set('cat')}>{Object.keys(CATEGORY_SKILLS).map((c) => <option key={c}>{c}</option>)}</select>
        <label htmlFor="tc">Technologies used (optional)</label><input id="tc" value={f.tech} onChange={set('tech')} /><br />
        <button className="btn" onClick={next}>Continue</button>
      </div></>
  )
  if (step === 2) return (
    <><h1>Confirm evidence</h1><p className="mu">Step 2 of 3</p>
      <div className="card" style={{ maxWidth: 640 }}>
        <p><b>{f.title}</b><br /><span className="mu">{f.url}</span><br /><span className="badge b-i">{f.cat}</span></p>
        <div className="card prot"><b>Privacy notice</b><p className="sm">Your submitted project evidence is used by JobSuite to identify potential skills. Recruiters cannot access your submitted repository contents or full project files through JobSuite.</p></div>
        <label style={{ display: 'flex', gap: 8, alignItems: 'center', color: 'var(--tx)' }}><input type="checkbox" style={{ width: 'auto' }} checked={conf} onChange={(e) => setConf(e.target.checked)} /> I understand and want to submit this project</label>
        <div className="err">{err.conf}</div><br />
        <div className="row"><button className="btn g" onClick={() => setStep(1)}>Back</button><button className="btn" onClick={submit}>Submit for analysis</button></div>
      </div></>
  )
  if (!res) return (
    <><h1>Analysing project</h1><p className="mu">Simulated demo: no GitHub or AI service is contacted.</p>
      <div className="card" style={{ maxWidth: 640 }}>{STAGES.map((s, i) => <div key={s} className="row" style={{ padding: '8px 0' }}>{i < stage ? '✅' : i === stage ? <span className="spin" /> : '⚪'}<span className={i > stage ? 'mu' : ''}>{s}</span></div>)}</div></>
  )
  return (
    <><h1>{res.title}</h1><p className="mu">AI-identified potential skills (simulated). These are not verified until you pass an assessment.</p>
      <div className="card" style={{ maxWidth: 640 }}>
        {res.sk.map((s) => <div key={s} className="row" style={{ padding: '8px 0', borderBottom: '1px solid var(--bd)' }}><b>{s}</b><span className="badge b-i">Identified</span><span className="sp" /><Link className="btn sm" to={`/student/assess/${s}`}>Start assessment</Link></div>)}<br />
        <Link className="btn g" to="/student/skills">Open skills & verification</Link> <button className="btn g" onClick={reset}>Submit another</button>
      </div></>
  )
}
