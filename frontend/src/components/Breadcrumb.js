import React from 'react'
import { useNavigate } from 'react-router-dom'
import { v4 } from 'uuid'
import { isFunction } from '../utils/checkType'

import { Breadcrumb as AntdBreadcrumb, Button } from 'antd'
import { HomeOutlined } from '@ant-design/icons'

const { Item } = AntdBreadcrumb
const KEY = v4()

const Breadcrumb = ({ data = [] }) => {
	const navigate = useNavigate()

	const handleGoHome = () => navigate('/')

	const renderBreadcrumb = ({ label, icon, onClick }, index) => {
		return (
			<Item key={`${KEY}-${index}`}>
				{isFunction(onClick) ? (
					<Button
						size='small'
						type='link'
						icon={icon}
						onClick={onClick}
					>
						{label && label}
					</Button>
				) : (<>
					{icon && icon}
					{label && <span>{label}</span>}
				</>)}
			</Item>
		)
	}
	
	return (
		<AntdBreadcrumb>
			<Item>
				<Button
					size='small'
					type='link'
					icon={<HomeOutlined />}
					onClick={handleGoHome}
				/>
			</Item>
			{data.map(renderBreadcrumb)}
		</AntdBreadcrumb>
	)
}

export default Breadcrumb