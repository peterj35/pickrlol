import { getIsDev } from './env'
import ReactGA from 'react-ga'
import createHistory from 'history/createBrowserHistory'

/**
 * To be invoked once, when the app is mounted.
 *
 * Will initialize GA if not in development mode, and will log
 * an error if the GA tracking ID has not been defined.
 */
export const initTracking = () => {
  const GA_TRACKING_ID = process.env.REACT_APP_GA_TRACKING_ID

  let isTrackingEnabled = !getIsDev()

  if (isTrackingEnabled) {
    if (GA_TRACKING_ID) {
      ReactGA.initialize(GA_TRACKING_ID)
    } else {
      console.error(
        'The GA_TRACKING_ID has not been defined. Could not initialize GA'
      )
      isTrackingEnabled = false
    }
  } else {
    console.info('Not setting up tracking because in dev.')
  }

  const history = createHistory()
  if (isTrackingEnabled) {
    // Initialize google analytics page view tracking
    history.listen((location: { pathname: string }) => {
      ReactGA.set({ page: location.pathname }) // Update the user's current page
      ReactGA.pageview(location.pathname) // Record a pageview for the given page
    })
  }

  return history
}
