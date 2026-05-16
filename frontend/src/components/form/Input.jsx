import Styles from './Input.module.css'

const Input = ({ type, text, name, placeholder, value, handleOnChange, multiple, disabled, limit, form }) => {
  return (
    <div className={`${Styles['form-control']}${disabled ? ` ${Styles['disabled']}` : ''}`}>
        <label htmlFor={name}>{text}</label>
        <input
            type={type}
            name={name}
            placeholder={placeholder}
            value={value}
            onChange={handleOnChange}
            form={form}
            {...(multiple ? { multiple } : '')}
            {...(disabled ? { disabled }  : '')}
            {...(limit ? { maxLength: limit } : '')}
        />
    </div>
  )
}

export default Input