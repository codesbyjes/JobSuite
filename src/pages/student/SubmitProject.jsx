import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useApp } from '../../context/AppContext.jsx'
import { CATEGORY_SKILLS } from '../../data/quizzes.js'

const EMPTY = {
  title: '',
  desc: '',
  url: '',
  cat: Object.keys(CATEGORY_SKILLS)[0],
  tech: '',
}

const STAGES = [
  'Project details received',
  'Reviewing the selected category',
  'Identifying potential skills',
]

export default function SubmitProject() {
  const { addProject, projects, toast, unlockProjectAssessments } = useApp()
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [f, setF] = useState(EMPTY)
  const [err, setErr] = useState({})
  const [conf, setConf] = useState(false)
  const [stage, setStage] = useState(0)
  const [res, setRes] = useState(null)
  const [assessmentsUnlocked, setAssessmentsUnlocked] = useState(false)
  const [waitingCardVisible, setWaitingCardVisible] = useState(true)
  const set = (key) => (event) =>
    setF((current) => ({ ...current, [key]: event.target.value }))
  const workflowProjects = projects.filter(
    (project) => project.mentorStatus === 'pending'
  )

  useEffect(() => {
    if (step !== 3) return

    let currentStage = 0
    let completionTimer
    const timer = setInterval(() => {
      currentStage += 1
      setStage(currentStage)

      if (currentStage >= STAGES.length) {
        clearInterval(timer)
        completionTimer = setTimeout(() => {
          const skills = CATEGORY_SKILLS[f.cat]
          const reviewId = addProject(f.title, f.cat, skills)
          setRes({ title: f.title, skills, reviewId })
          toast('Project analysis complete')
        }, 500)
      }
    }, 900)

    return () => {
      clearInterval(timer)
      clearTimeout(completionTimer)
    }
  }, [step]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!assessmentsUnlocked || !waitingCardVisible) return
    const timer = setTimeout(() => setWaitingCardVisible(false), 300)
    return () => clearTimeout(timer)
  }, [assessmentsUnlocked, waitingCardVisible])

  const next = () => {
    const errors = {}
    if (!f.title.trim()) errors.title = 'Enter a project title.'
    if (!f.desc.trim()) errors.desc = 'Enter a short description.'
    if (!/^https?:\/\/(www\.)?github\.com\/[\w.-]+\/[\w.-]+/i.test(f.url.trim())) {
      errors.url = 'Enter a URL like https://github.com/user/repo.'
    }
    setErr(errors)
    if (!Object.keys(errors).length) setStep(2)
  }

  const submit = () => {
    if (!conf) {
      setErr({ conf: 'Tick the box to continue.' })
      return
    }
    setErr({})
    setStage(0)
    setRes(null)
    setAssessmentsUnlocked(false)
    setWaitingCardVisible(true)
    setStep(3)
  }

  const reset = () => {
    setF(EMPTY)
    setConf(false)
    setRes(null)
    setAssessmentsUnlocked(false)
    setWaitingCardVisible(true)
    setStep(1)
  }

  const unlockAssessments = () => {
    if (assessmentsUnlocked || !res) return
    if (unlockProjectAssessments(res.reviewId)) {
      setAssessmentsUnlocked(true)
    } else {
      toast('Project review could not be found')
    }
  }

  const handleResultsClick = (event) => {
    if (event.target.closest('a, button, input, select, textarea')) return
    unlockAssessments()
  }

  const handleWaitingCardKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      unlockAssessments()
    }
  }

  if (step === 1) {
    return (
      <div className="submission-step" key={step}>
        <h1>Submit a project</h1>
        <p className="mu">Step 1 of 3 · Project details</p>
        <div className="card" style={{ maxWidth: 640 }}>
          <label htmlFor="t">Project title *</label>
          <input id="t" value={f.title} onChange={set('title')} />
          <div className="err">{err.title}</div>
          <label htmlFor="d">Short description *</label>
          <textarea id="d" rows="3" value={f.desc} onChange={set('desc')} />
          <div className="err">{err.desc}</div>
          <label htmlFor="u">GitHub repository URL *</label>
          <input
            id="u"
            placeholder="https://github.com/you/project"
            value={f.url}
            onChange={set('url')}
          />
          <div className="err">{err.url}</div>
          <label htmlFor="c">Category</label>
          <select id="c" value={f.cat} onChange={set('cat')}>
            {Object.keys(CATEGORY_SKILLS).map((category) => (
              <option key={category}>{category}</option>
            ))}
          </select>
          <label htmlFor="tc">Technologies used (optional)</label>
          <input id="tc" value={f.tech} onChange={set('tech')} />
          <br />
          <button className="btn" type="button" onClick={next}>Continue</button>
        </div>
        {workflowProjects.length > 0 && (
          <section
            className="card mentor-workflows"
            style={{ maxWidth: 640, marginTop: 16 }}
            aria-labelledby="mentor-workflows-title"
          >
            <h2 id="mentor-workflows-title">Project review progress</h2>
            {workflowProjects.map((project) => (
              <div className="mentor-workflow-row" key={project.reviewId}>
                <div>
                  <b>{project.title}</b>
                  <div className="mu sm">Mentor review: Pending</div>
                  {project.assessmentUnlocked && (
                    <div className="mu sm">Assessment access unlocked</div>
                  )}
                </div>
                <span className="sp" />
                <Link
                  className="btn sm"
                  to={`/student/skills?review=${encodeURIComponent(project.reviewId)}`}
                >
                  Continue
                </Link>
              </div>
            ))}
          </section>
        )}
      </div>
    )
  }

  if (step === 2) {
    return (
      <div className="submission-step" key={step}>
        <h1>Confirm evidence</h1>
        <p className="mu">Step 2 of 3</p>
        <div className="card" style={{ maxWidth: 640 }}>
          <p>
            <b>{f.title}</b><br />
            <span className="mu">{f.url}</span><br />
            <span className="badge b-i">{f.cat}</span>
          </p>
          <div className="card prot">
            <b>Privacy notice</b>
            <p className="sm">
              Your submitted project evidence is used by JobSuite to identify
              potential skills. Recruiters cannot access your submitted
              repository contents or full project files through JobSuite.
            </p>
          </div>
          <label
            style={{
              display: 'flex',
              gap: 8,
              alignItems: 'center',
              color: 'var(--tx)',
            }}
          >
            <input
              type="checkbox"
              style={{ width: 'auto' }}
              checked={conf}
              onChange={(event) => setConf(event.target.checked)}
            />
            I understand and want to submit this project
          </label>
          <div className="err">{err.conf}</div>
          <br />
          <div className="row">
            <button className="btn g" type="button" onClick={() => setStep(1)}>
              Back
            </button>
            <button className="btn" type="button" onClick={submit}>
              Submit for analysis
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (!res) {
    return (
      <div className="submission-step" key={step}>
        <h1>Analysing project</h1>
        <p className="mu">Simulated demo: no GitHub or AI service is contacted.</p>
        <div className="card" style={{ maxWidth: 640 }}>
          {STAGES.map((item, index) => (
            <div
              key={item}
              className={`processing-step${index < stage ? ' is-complete' : index > stage ? ' is-pending' : ' is-current'}`}
            >
              {index < stage ? '✅' : index === stage ? <span className="spin" /> : '⚪'}
              <span className={index > stage ? 'mu' : ''}>{item}</span>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div
      className="submission-step project-results"
      key={step}
      onClick={handleResultsClick}
    >
      <h1>{res.title}</h1>
      <p className="mu">
        AI-identified potential skills (simulated). These are not verified
        until you pass an assessment.
      </p>
      <div className="card" style={{ maxWidth: 640 }}>
        {res.skills.map((skill) => (
          <div
            key={skill}
            className="row"
            style={{ padding: '8px 0', borderBottom: '1px solid var(--bd)' }}
          >
            <b>{skill}</b>
            <span className="badge b-i">Identified</span>
            <span className="sp" />
            <button
              className="btn sm"
              type="button"
              disabled={!assessmentsUnlocked}
              onClick={() =>
                navigate(
                  `/student/assess/${encodeURIComponent(skill)}?review=${encodeURIComponent(res.reviewId)}`
                )
              }
            >
              Start assessment
            </button>
          </div>
        ))}
        <br />
        <Link className="btn g" to="/student/skills">Open skills &amp; verification</Link>
        {' '}
        <button className="btn g" type="button" onClick={reset}>Submit another</button>
      </div>
      {waitingCardVisible && (
        <section
          className={`card mentor-review-card${assessmentsUnlocked ? ' is-unlocking' : ''}`}
          style={{ maxWidth: 640, marginTop: 16 }}
          role="button"
          tabIndex={0}
          aria-label="Click to continue to skill assessments"
          onKeyDown={handleWaitingCardKeyDown}
        >
          <h2>Mentor review: Pending</h2>
          <p>
            Assessment access can be unlocked for this demo without changing
            the project&apos;s mentor review status.
          </p>
          <div className="mentor-click-hint">Click anywhere to continue</div>
        </section>
      )}
    </div>
  )
}
