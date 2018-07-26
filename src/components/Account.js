import React, {Component} from 'react'

function Account(props) {
    const {account} = props;
    const {onChange} = props;

    return (
        <select onChange={onChange}>
            {account.map((result, index) => {
                return <option key={index}>{result}</option>
            })}
        </select>
    )
}

export default Account