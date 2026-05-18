import Styles from './Input.module.css'

const Input = ({ type, text, name, placeholder, value, handleOnChange, multiple, disabled, limit, form, number }) => {

  function handleNumberChange(e) {
    let val = e.target.value
    val = val.replace(/[^0-9,.]/g, '')
    const firstSep = val.search(/[,.]/)
    if (firstSep !== -1) {
      val = val.slice(0, firstSep + 1) + val.slice(firstSep + 1).replace(/[,.]/g, '')
    }
    handleOnChange({ target: { name, value: val } })
  }

  return (
    <div className={`${Styles['form-control']}${disabled ? ` ${Styles['disabled']}` : ''}`}>
        <label htmlFor={name}>{text}</label>
        <input
            type={number ? 'text' : type}
            name={name}
            placeholder={placeholder}
            value={value}
            onChange={number ? handleNumberChange : handleOnChange}
            form={form}
            {...(number ? { inputMode: 'decimal' } : {})}
            {...(multiple ? { multiple } : '')}
            {...(disabled ? { disabled }  : '')}
            {...(limit ? { maxLength: limit } : '')}
        />
    </div>
  )
}

export default Input