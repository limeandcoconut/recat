import {createSelector} from 'reselect'

// export const cats = (state) => state.cats

// export const getCats = createSelector(
//     [cats],
//     (cats) => {
//         cats.src,
//     }
// )

export const getCats = createSelector((state) => state.cats)
