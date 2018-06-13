import React, {Component} from 'react'
import SimpleTokenCoin from './SimpleTokenCoin'

function Account(props) {
    const {account} = props;
    const {onChange} = props;

    return (
        <select id="leaveCode" name="leaveCode" onChange={onChange}>
            {account.map((result, index) => {
                return <option key={index}>{result}</option>
            })}
        </select>
    )
}

export default Account