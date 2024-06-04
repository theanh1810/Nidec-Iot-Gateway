import React, { useCallback } from 'react'
import useRoutes from './configs/useRoutes.config'
import { isArray } from './utils/checkType'
import useSocket from '@@socket'

import { Routes, Route, BrowserRouter } from 'react-router-dom'
import AppContext from '@@context/AppContext'

const App = () => {
	const socket = useSocket()
	const { routes } = useRoutes()

	const renderRoute = useCallback((routes) => {
		if (isArray(routes)) {
			return routes.map(route => {
				return (
					'children' in route ?
						<Route {...route}>{renderRoute(route.children)}</Route> :
						<Route {...route} />
				)
			})
		} else {
			throw new Error('Body: routes not an array')
		}
	}, [])

	return (
		<AppContext.Provider value={{ socket }}>
			<Routes>
				{renderRoute(routes)}
			</Routes>
		</AppContext.Provider>
	)
}

const Root = () => {
	return (
		<BrowserRouter>
			<App />
		</BrowserRouter>
	)
}

export default Root