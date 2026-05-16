import Styles from './Button.module.css'

const Button = ({ children, onClick, variant, type = 'button', form, disabled }) => {
    const variantClass = variant ? Styles[variant] : ''

    return (
        <button
            type={type}
            onClick={onClick}
            form={form}
            disabled={disabled}
            className={`${Styles.button} ${variantClass}`}
        >
            {children}
        </button>
    )
}

export default Button
