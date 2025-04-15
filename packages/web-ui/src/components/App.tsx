import React from 'react'
import { Router, Switch, Route } from 'react-router-dom'
import styled from 'styled-components'
import { initTracking } from '../lib/tracking'
import { gapUnitPx } from '../theme'
import NewTopicContainer from './NewTopicContainer'
import Toolbar from './Toolbar'
import Topic from './Topic'
import Topics from './Topics'
import EditTopicContainer from './EditTopicContainer'
import { ErrorBoundary } from 'react-error-boundary'
import DefaultErrorFallback from './DefaultErrorFallback'
import usePreventUnload from '../hooks/usePreventUnload'
import SiteContainer from './SiteContainer'
import Disclaimer from './Disclaimer'

const history = initTracking()

const TOOLBAR_HEIGHT_PX = 60

/**
 * The main App
 */
const App = () => {
  /**
   * Stop users from unloading the window, eg. if something is being uploaded
   */
  usePreventUnload()

  return (
    <ErrorBoundary FallbackComponent={DefaultErrorFallback}>
      <Router history={history}>
        <SiteContainer>
          <ViewsContainer>
            <PositionedToolbar />
            <View>
              {/* 
              Don't unmount Topics path to maintain scroll position 
              and loaded data.

              Rely on Topics component to conditionally render based on
              route match.

              Note using the children prop to render is needed to render always 
              whether there is a match or not. See: 
              https://v5.reactrouter.com/core/api/Route/children-func

              IMPROVE @peterj35: Encapsulate better (don't require logic
              in both rendered component as well as route glue component),
              and make more declarative.
            */}
              <Route exact path="/" children={() => <Topics />} />
              <Switch>
                <Route path="/disclaimer">
                  <Disclaimer />
                </Route>
                <Route exact path="/new">
                  <NewTopicContainer />
                </Route>
                <Route path="/edit/:topicId">
                  <EditTopicContainer />
                </Route>
                <Route path="/:topicId">
                  <Topic />
                </Route>
              </Switch>
            </View>
          </ViewsContainer>
        </SiteContainer>
      </Router>
    </ErrorBoundary>
  )
}

const ViewsContainer = styled.div`
  display: flex;
  flex-direction: column;
`

const PositionedToolbar = styled(Toolbar)`
  height: ${TOOLBAR_HEIGHT_PX}px;
  margin-bottom: ${gapUnitPx * 6}px;
`

const View = styled.div`
  width: 100%;

  display: grid;
  justify-content: center;
`

export default App
