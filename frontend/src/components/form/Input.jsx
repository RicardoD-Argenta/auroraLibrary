import Styles from './Input.module.css'

const PHONE_MASK = '(__) _____-____'

const Input = ({ type, text, name, placeholder, value, handleOnChange, multiple, disabled, limit, form, number, min, phone }) => {

  function handleNumberChange(e) {
    let val = e.target.value
    val = val.replace(/[^0-9,.]/g, '')
    const firstSep = val.search(/[,.]/)
    if (firstSep !== -1) {
      val = val.slice(0, firstSep + 1) + val.slice(firstSep + 1).replace(/[,.]/g, '')
    }
    handleOnChange({ target: { name, value: val } })
  }

  function handlePhoneChange(e) {
    const digits = e.target.value.replace(/\D/g, '').slice(0, 11)
    if (digits.length === 0) {
      handleOnChange({ target: { name, value: '' } })
      return
    }
    let di = 0
    const masked = PHONE_MASK.split('').map(ch =>
      ch === '_' && di < digits.length ? digits[di++] : ch
    ).join('')
    handleOnChange({ target: { name, value: masked } })
  }

  return (
    <div className={`${Styles['form-control']}${disabled ? ` ${Styles['disabled']}` : ''}`}>
        <label htmlFor={name}>{text}</label>
        {type === 'textarea' ? (
            <textarea
                className={Styles['textarea']}
                name={name}
                placeholder={placeholder}
                value={value}
                onChange={handleOnChange}
                form={form}
                {...(disabled ? { disabled } : '')}
                {...(limit ? { maxLength: limit } : '')}
            />
        ) : (
            <input
                type={number ? 'text' : type}
                name={name}
                placeholder={phone ? PHONE_MASK : placeholder}
                value={value}
                onChange={number ? handleNumberChange : phone ? handlePhoneChange : handleOnChange}
                form={form}
                {...(number ? { inputMode: 'decimal' } : {})}
                {...(phone ? { inputMode: 'tel' } : {})}
                {...(multiple ? { multiple } : '')}
                {...(disabled ? { disabled }  : '')}
                {...(min ? { minLength: min } : '')}
                {...(limit ? { maxLength: limit } : '')}
            />
        )}
    </div>
  )
}

export default Input