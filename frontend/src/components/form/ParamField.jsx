import styles from './ParamField.module.css'
import Input from './Input'

const ParamField = ({ label, value, onChange, fields }) => {

    function handleToggle() {
        onChange({ ...value, active: !value.active })
    }

    function handleFieldChange(e) {
        onChange({ ...value, [e.target.name]: e.target.value })
    }

    return (
        <div className={styles.card}>
            <div className={styles.header}>
                <span className={styles.label}>{label}</span>
                <button
                    type="button"
                    className={`${styles.toggle} ${value.active ? styles.on : ''}`}
                    onClick={handleToggle}
                    aria-pressed={value.active}
                >
                    <span className={styles.thumb} />
                </button>
            </div>
            {fields && value.active && (
                <div className={styles.fields}>
                    {fields.map(field => {
                        if (field.component) {
                            const Comp = field.component
                            return (
                                <Comp
                                    key={field.name}
                                    name={field.name}
                                    value={value[field.name] ?? ''}
                                    handleOnChange={handleFieldChange}
                                />
                            )
                        }
                        return (
                            <Input
                                key={field.name}
                                text={field.label}
                                type={field.type ?? 'text'}
                                name={field.name}
                                placeholder={field.placeholder ?? ''}
                                value={value[field.name] ?? ''}
                                handleOnChange={handleFieldChange}
                                number={field.number}
                            />
                        )
                    })}
                </div>
            )}
        </div>
    )
}

export default ParamField
