import * as React from 'react'
import {Route} from 'react-router-dom'
import styles from './status.module.less'
import Helmet from 'react-helmet'

// Yeah it's total rubbish but I'm willing to have some fun here
const Status = ({code = 418, children}) => (
    <Route
        render={({staticContext}) => {
            code = typeof code === 'number' && code > 99 && code < 600 ? code : 418
            if (staticContext) {
                staticContext.status = code
            }
            return (
                <div className={styles.wrapper} >
                    { code === 418 &&
                        <Helmet>
                            <meta name="robots" content="noindex, nofollow" />
                        </Helmet>
                    }
                    <img
                        className={styles.meme}
                        src={`https://http.cat/${code}`}
                    />
                    { code === 418 && 'Yeah you are little guy. Yeah you are. 😊'}
                    {children}
                </div>
            )
        }}
    />
)

export default Status

