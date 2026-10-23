
import { createContext, useContext, useState, useCallback } from 'react'
import { useLocal } from '../hooks/useLocal.js'
import {
  INITIAL_SKILLS,
  INITIAL_PROJECTS,
  INITIAL_ACTIVITY,
} from '../data/student.js'
import { CANDIDATES } from '../data/candidates.js'

const Ctx = createContext(null)

export const useApp = () => useContext(Ctx)

export const DEFAULT_FILTERS = {
  q: '',
  city: '',
  skill: '',
  level: '',
  job: '',
  work: '',
  sort: 'match',
}

const today = () =>
  new Date().toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })

export function AppProvider({ children }) {
  const [skills, setSkills] = useLocal('js:skills', INITIAL_SKILLS)
  const [projects, setProjects] = useLocal('js:projects', INITIAL_PROJECTS)
  const [activity, setActivity] = useLocal('js:activity', INITIAL_ACTIVITY)

  const [assessmentHistory, setAssessmentHistory] = useLocal(
    'js:assessmentHistory',
    []
  )

  const [shortlist, setShortlist] = useLocal('js:shortlist', {})
  const [filters, setFilters] = useState(DEFAULT_FILTERS)
  const [message, setMessage] = useState('')

  const toast = useCallback((m) => {
    setMessage(m)
    setTimeout(() => setMessage(''), 2400)
  }, [])

  const log = (entry) => {
    setActivity((items) => [entry, ...items])
  }

  const addProject = (title, category, skillNames) => {
    const reviewId = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
    setProjects((currentProjects) => [
      {
        reviewId,
        title,
        date: today(),
        skillCount: skillNames.length,
        skills: [...skillNames],
        category,
        mentorStatus: 'pending',
      },
      ...currentProjects,
    ])

    setSkills((currentSkills) => [
      ...currentSkills,
      ...skillNames
        .filter((name) => !currentSkills.some((skill) => skill.name === name))
        .map((name) => ({
          name,
          category,
          status: 'Identified',
          project: title,
          score: null,
          reviewId,
          mentorStatus: 'pending',
        })),
    ])

    log('Project submitted: ' + title)
    return reviewId
  }
  const unlockProjectAssessments = (reviewId) => {
    if (!projects.some((project) => project.reviewId === reviewId)) return false
    setProjects((p) => p.map((project) => project.reviewId === reviewId
      ? { ...project, assessmentUnlocked: true }
      : project))
    return true
  }

  const recordAssessment = (name, score, passed) => {
    const attempt = {
      id: `${Date.now()}-${Math.random()}`,
      skill: name,
      score,
      passed,
      date: today(),
    }

    // Save every attempt, including failed attempts.
    setAssessmentHistory((history) => [attempt, ...history])

    // Update the current skill status and latest score.
    setSkills((currentSkills) =>
      currentSkills.map((skill) => {
        if (skill.name !== name) return skill

        if (passed) {
          return {
            ...skill,
            status: 'Verified',
            score,
            date: today(),
          }
        }

        if (skill.status === 'Verified') {
          return {
            ...skill,
            score,
            date: today(),
          }
        }

        return {
          ...skill,
          status: 'Not Passed',
          score,
          date: today(),
        }
      })
    )

    if (passed) {
      log(`Skill verified: ${name}`)
      log(`Assessment passed: ${name} (${score}%)`)
    } else {
      log(`Assessment not passed: ${name} (${score}%)`)
    }
  }

  const toggleShortlist = (id) => {
    const candidate = CANDIDATES[id]
    if (!candidate) return

    const name = candidate.name

    setShortlist((current) => {
      const next = { ...current }

      if (next[id]) {
        delete next[id]
        toast(name + ' removed from shortlist')
      } else {
        next[id] = today()
        toast(name + ' shortlisted')
      }

      return next
    })
  }

  const resetDemo = () => {
    setSkills(INITIAL_SKILLS)
    setProjects(INITIAL_PROJECTS)
    setActivity(INITIAL_ACTIVITY)
    setAssessmentHistory([])
    setShortlist({})
    toast('Demo data reset')
  }

  return (
    <Ctx.Provider
      value={{
        skills,
        projects,
        activity,
        assessmentHistory,
        shortlist,
        filters,
        setFilters,
        message,
        toast,
        addProject,
        unlockProjectAssessments,
        recordAssessment,
        toggleShortlist,
        resetDemo,
      }}
    >
      {children}
    </Ctx.Provider>
  )
}
