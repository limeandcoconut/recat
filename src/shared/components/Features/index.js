import * as React from 'react'
import {withNamespaces} from 'react-i18next'
import styles from './features.module.less'

const Features = ({t}) => (
    <>
        <h2>{t('features')}</h2>
        <ul className={styles.wrapper}>
            <li className={styles.hot}>Webpack 4</li>
            <li className={styles.hot}>Babel 7</li>
            <li className={styles.hot}>ESLint 5</li>
            <li className={styles.hot}>Jest 24</li>
            <li className={styles.react}>React 16.x (latest), with Hooks!</li>
            <li>React Router 4</li>
            <li>Redux (+ Thunk)</li>
            <li>Immer</li>
            <li>Reselect</li>
            <li>React Helmet</li>
            <li>Express Webserver + Server Side Prerendering</li>
            <li>{t('i18n-support')}</li>
            <li>CSS Modules</li>
            <li>PostCSS</li>
            <li>Prettier (incl. precommit-hook via lint-staged + husky)</li>
            <li>HMR (buggy, see Readme)</li>
        </ul>
    </>
)

export default withNamespaces()(Features)
