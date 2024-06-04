import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuth from '@@api/useAuth'

import { Layout as AntdLayout } from 'antd'
import Header from './Header'
import Body from './Body'
import Footer from './Footer'
import Sider from './Sider'

const Layout = ({ children }) => {
	const navigate = useNavigate()
	const { verify } = useAuth()
	const [isVerified, setIsVerified] = useState(false)

	const handleVerify = async () => {
		const { success } = await verify()

		if (success) {
			setIsVerified(true)
		} else {
			navigate('/login')
		}
	}

	useEffect(() => {
		handleVerify()
	}, [])

	return (
		<>{isVerified && (
			<AntdLayout style={{ maxHeight: '100vh', minHeight: '100vh' }}>
				<Sider />
				<AntdLayout>
					<Header />
					<Body>
						{children}
					</Body>
					<Footer />
				</AntdLayout>
			</AntdLayout>
		)}</>
	)
}

export default Layout