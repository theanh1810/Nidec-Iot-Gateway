import React from 'react'
import useTranslate from '../lang/useTranslate'

import { Row, Col, Space, Button, Input } from 'antd'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowDownAZ, faArrowUpAZ } from '@fortawesome/free-solid-svg-icons'

const Filter = ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close, visible }) => {
	const t = useTranslate()

	const handleSearch = () => {
		confirm()
		close()
	}

	const handleClear = () => {
		clearFilters()
		confirm()
		close()
	}

	const handleChangeSearch = (e) => setSelectedKeys([e.target.value])

	return (
		<Row
			gutter={[10, 10]}
			style={{ padding: 10, width: 200 }}
		>
			{/* <Col span={24}>
				<Space>
					<Button
						icon={<FontAwesomeIcon icon={faArrowDownAZ} />}
						onClick={handleSoftDown}
					/>
					<Button
						icon={<FontAwesomeIcon icon={faArrowUpAZ} />}
						onClick={handleSoftUp}
					/>
				</Space>
			</Col> */}
			<Col span={24}>
				<Input
					allowClear
					placeholder={t('search')}
					value={selectedKeys[0]}
					onChange={handleChangeSearch}
					onPressEnter={handleSearch}
				/>
			</Col>
			<Col span={24}>
				<Space>
					<Button
						type='primary'
						size='small'
						onClick={handleSearch}
					>
						{t('search').toUpperFirst()}
					</Button>
					<Button
						type='primary'
						size='small'
						onClick={handleClear}
						danger
					>
						{t('clear').toUpperFirst()}
					</Button>
				</Space>
			</Col>
		</Row>
	)
}

export default Filter