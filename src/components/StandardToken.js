import React, {Component} from 'react'
import SimpleTokenCoin from './SimpleTokenCoin'
import _ from 'lodash';


function StandardToken(props) {
    const {standardToken} = props;

    var test

    standardToken.symbol().then(function (result) {
        alert(result)
        test = result
        alert(test)
    })
    alert(test)

        return (
            <p>The Symbol is: {test}</p>
                )
}

export default StandardToken