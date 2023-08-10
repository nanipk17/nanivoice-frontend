import React from 'react'

const Alert = (props) => {
    return (
        <div className={`justvoice__alert ${props.open ? 'justvoice__alert__show' : 'justvoice__alert__hide'}`}>{props.children}</div>
    )
}

export default Alert