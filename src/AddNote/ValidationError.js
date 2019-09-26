import React from 'react';

export default function ValidationError(props) {
    if (props.hasError) {
        return <h3 className="error">{props.message}</h3>
    }
    return <></>
}
