import Styles from './Input.module.css'

const Input = ({ type, text, name, placeholder, value, handleOnChange, multiple, disabled, limit }) => {
  return (
    <div className={Styles['form-control']}>
        <label htmlFor={name}>{text}</label>
        <input
            type={type}
            name={name}
            placeholder={placeholder}
            value={value}
            onChange={handleOnChange}
            {...(multiple ? { multiple } : '')}
            {...(disabled ? { disabled }  : '')}
            {...(limit ? { maxLength: limit } : '')}
        />
    </div>
  )
}

export default Input