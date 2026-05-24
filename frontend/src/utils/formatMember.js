import { decodeClass } from './decodeClass'

export function formatMember(m) {
    if (!m) return ''
    const parts = [m.name]
    if (m.student?.isStudent) parts.push(decodeClass(m.student.studentClass))
    if (m.member?.isMember) parts.push(m.email || m.phone || '')
    return parts.filter(Boolean).join(' | ')
}
