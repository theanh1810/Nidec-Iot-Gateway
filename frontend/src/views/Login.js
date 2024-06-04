import React, { useEffect, useRef } from 'react'
import useTranslate from '@@lang'
import useAuth from '@@api/useAuth'
import { useNavigate } from 'react-router-dom'
import useUser from '@@store/useUser'
import useProvider from '@@store/useProvider'

import { Row, Col, Input, Button, Form, Typography } from 'antd'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser, faLock } from '@fortawesome/free-solid-svg-icons'
import '@@styles/scss/custom-input.scss'

const { Title } = Typography

const Login = () => {
	const t = useTranslate()
	const { changeData } = useUser()
	const { redirectPath } = useProvider()
	const { login } = useAuth()
	const navigate = useNavigate()
	const ref = useRef()

	const handleLogin = async ({ username, password }) => {
		const { success, data } = await login({ username, password })
		if (success) {
			const { token, username } = data
			changeData({ token, username })
			navigate(redirectPath)
		}
	}

	useEffect(() => {
		ref.current.focus()
	}, [])

	return (
		<div
			style={{
				maxHeight: '100vh',
				minHeight: '100vh',
				backgroundImage: `linear-gradient(to left, #303030, #424242)`,
				backgroundSize: 'cover',
				backgroundPosition: 'center',
				backgroundRepeat: 'no-repeat',
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center'
			}}
		>
			<div
				style={{
					padding: 15,
					maxWidth: 300,
					backgroundColor: 'rgb(0, 0, 0, 0.2)',
					backdropFilter: 'blur(10px)',
					borderRadius: 10
				}}
			>
				<Form
					onFinish={handleLogin}
				>
					<Row gutter={[10, 10]}>
						<Col span={24}>
							<Title
								level={1}
								style={{
									color: '#d1d0c5',
									textAlign: 'center',
									fontSize: 30,
								}}
							>
								IOT Gateway
							</Title>
						</Col>
						<Col span={24}>
							<Form.Item
								style={{ marginBottom: 8 }}
								name='username'
							>
								<Input
									ref={ref}
									className='antd-custom-input'
									size='large'
									prefix={<FontAwesomeIcon icon={faUser} color='#d1d0c5' />}
									placeholder={t('username')}
								/>
							</Form.Item>
						</Col>
						<Col span={24}>
							<Form.Item
								style={{ marginBottom: 8 }}
								name='password'
							>
								<Input.Password
									className='antd-custom-input'
									size='large'
									prefix={<FontAwesomeIcon icon={faLock} color='#d1d0c5' />}
									placeholder={t('password')}
								/>
							</Form.Item>
						</Col>
						<Col span={24}>
							<Form.Item style={{ margin: 0 }}>
								<Button
									style={{
										color: '#d1d0c5',
										fontWeight: 500,
										backgroundColor: '#646669',
										border: 'none'
									}}
									htmlType='submit'
									block
									size='large'
								>
									{t('login').toCapitalize()}
								</Button>
							</Form.Item>
						</Col>
					</Row>
				</Form>
			</div>
		</div>
	)
}

export default Login