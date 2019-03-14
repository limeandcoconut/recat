/* eslint-disable import/prefer-default-export */
import {createSelector} from 'reselect'

export const app = (state) => state.app

export const getLocale = createSelector(
    [app],
    (app) => app.locale
)
