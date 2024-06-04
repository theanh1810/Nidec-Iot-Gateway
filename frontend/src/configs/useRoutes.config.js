import useTranslate from '@@lang'

import Layout from '@@views/layouts/Layout'
import Login from '@@views/Login'
import Home from '@@views/Home'
import Iot from '@@views/Iot'
import File from '@@views/File'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGaugeHigh, faTowerBroadcast, faFile } from '@fortawesome/free-solid-svg-icons'

const ICON_SIZE = '16px'

const useRoutes = () => {
	const t = useTranslate()

	const publicRoutes = [
		{
			key: '/',
			label: t('dashboard').toCapitalize(),
			path: '/',
			element: <Layout><Home /></Layout>,
			icon: <FontAwesomeIcon icon={faGaugeHigh} style={{ fontSize: ICON_SIZE }} />
		},
		{
			key: '/iot',
			label: t('iot').toCapitalize(),
			path: '/iot',
			element: <Layout><Iot /></Layout>,
			icon: <FontAwesomeIcon icon={faTowerBroadcast} style={{ fontSize: ICON_SIZE }} />
		},
		{
            key: '/file',
            label: t('file').toCapitalize(),
            path: '/file',
            element: <Layout><File /></Layout>,
            icon: <FontAwesomeIcon icon={faFile} style={{ fontSize: ICON_SIZE }} />
        },
	]

	const privateRoutes = [
		{
			key: '/login',
			label: 'login',
			path: '/login',
			element: <Login />
		}
	]

	return {
		publicRoutes,
		privateRoutes,
		routes: [...publicRoutes, ...privateRoutes]
	}
}

export default useRoutes