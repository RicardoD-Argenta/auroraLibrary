import EnumSelect from './EnumSelect'
import useToast from '../../hooks/useToast'
import styles from './ClassSelect.module.css'

export const GRADES = [
    ...Array.from({ length: 4 }, (_, i) => ({
        value: String(4 - i + 9),
        label: `${4 - i}° Ano Médio`
    })),
    ...Array.from({ length: 9 }, (_, i) => ({
        value: String(9 - i),
        label: `${9 - i}° Ano Fundamental`
    }))
]

const LETTERS = Array.from({ length: 26 }, (_, i) => {
    const letter = String.fromCharCode(65 + i)
    return { value: letter, label: letter }
})

function parseValue(val) {
    if (!val) return { grade: '', letter: '' }
    const lastChar = val.slice(-1)
    if (/[A-Z]/.test(lastChar)) {
        return { grade: val.slice(0, -1), letter: lastChar }
    }
    return { grade: val, letter: '' }
}

const ClassSelect = ({ name, value, handleOnChange }) => {
    const { grade, letter } = parseValue(value ?? '')
    const toast = useToast()

    function handleGradeChange(e) {
        const newGrade = e.target.value
        handleOnChange({ target: { name, value: letter ? newGrade + letter : newGrade } })
    }

    function handleLetterChange(e) {
        const newLetter = e.target.value
        handleOnChange({ target: { name, value: grade ? grade + newLetter : newLetter } })
    }

    return (
        <div className={styles.wrapper}>
            <span className={styles.label}>Turma</span>
            <div className={styles.row}>
                <div className={styles.grade}>
                    <EnumSelect name="grade" value={grade} handleOnChange={handleGradeChange} options={GRADES} placeholder="Ano" />
                </div>
                <div className={styles.letter}>
                    <EnumSelect name="letter" value={letter} handleOnChange={handleLetterChange} options={LETTERS} placeholder="Letra" />
                </div>
            </div>
            <input
                type="text"
                value={value ?? ''}
                onChange={() => {}}
                required
                pattern="^(1[0-3]|[1-9])[A-Z]$"
                tabIndex={-1}
                onInvalid={(e) => {
                    e.preventDefault()
                    toast.error('Selecione o ano e a turma do estudante')
                }}
                className={styles.hidden}
            />
        </div>
    )
}

export default ClassSelect
