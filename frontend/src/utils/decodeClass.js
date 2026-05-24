import { GRADES } from '../components/form/ClassSelect'

export function decodeClass(val) {
    if (!val) return ''
    const lastChar = val.slice(-1)
    const hasLetter = /[A-Z]/.test(lastChar)
    const grade = hasLetter ? val.slice(0, -1) : val
    const letter = hasLetter ? lastChar : ''
    const gradeEntry = GRADES.find(g => g.value === grade)
    if (!gradeEntry) return val
    return letter ? `${gradeEntry.label} - ${letter}` : gradeEntry.label
}
