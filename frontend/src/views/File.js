import React, { useEffect, useState } from 'react'
import useTranslate from '@@lang'
import useFile from '@@api/useFile'
import useModal from '@@utils/hooks/useModal'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUpload, faRotate, faInbox, faDownload, faTrashCan } from '@fortawesome/free-solid-svg-icons'
import { faFileCode } from '@fortawesome/free-regular-svg-icons'
import { Row, Col, Space, Typography, Modal, Upload, Progress } from 'antd'
import Button from '@@components/Button'
import { HOST, PORT } from '@@configs/app.config'

const { Text } = Typography
const { Dragger } = Upload

const UploadFileModal = ({ open, onCancel }) => {
	const t = useTranslate()
	const { uploadFiles } = useFile()
	const [fileList, setFileList] = useState([])
	const [progress, setProgress] = useState(0)

	const onUploadProgress = (e) => {
		setProgress(() => Number((e.progress * 100).toFixed(2)))
	}

	const handleUploadFiles = async () => {
		const formData = new FormData()
		fileList.forEach(file => formData.append('files', file))

		const { success } = await uploadFiles({ formData, onUploadProgress })

		if (success) {
			setFileList([])
			setProgress(0)
		}
	}

	const handleRemove = (file) => setFileList(prev => {
		const index = fileList.indexOf(file)
		prev.splice(index, 1)
		return [...prev]
	})

	const handleBeforeUpdate = (file) => {
		setFileList(prev => [...prev, file])
		return false
	}

	const resetData = () => {
		setFileList([])
		setProgress(0)
	}

	useEffect(() => {
		if (!open) resetData()
	}, [open])

	return (
		<Modal
			title={t('upload file').toCapitalize()}
			open={open}
			onCancel={onCancel}
			cancelText={t('close').toUpperFirst()}
			cancelButtonProps={{
				type: 'primary',
				danger: true
			}}
			onOk={handleUploadFiles}
			okText={t('confirm').toUpperFirst()}
			okButtonProps={{
				style: { backgroundColor: 'green' }
			}}
		>
			<Dragger
				multiple={true}
				fileList={fileList}
				onRemove={handleRemove}
				beforeUpload={handleBeforeUpdate}
			>
				<Space
					direction='vertical'
				>
					<FontAwesomeIcon icon={faInbox} color='#1677ff' fontSize={50} />
					<Text style={{ color: 'gray' }}>{t('click or drag file to this area to upload')}</Text>
				</Space>
			</Dragger>
			{progress > 0 && (
				<Progress
					percent={progress}
					showInfo={false}
				/>
			)}
		</Modal>
	)
}

const File = () => {
	const t = useTranslate()
	const { state, open, close } = useModal()
	const { getFiles, removeFile } = useFile()
	const [dirs, setDirs] = useState([])


	const files = dirs.filter(({ type }) => type === 1).map(({ name }) => {
		const handleRemoveFile = () => {
			removeFile(name)
		}
		
		return (
			<div
				key={name}
				style={{
					display: 'flex',
					flexDirection: 'row',
					justifyContent: 'space-between',
					alignItems: 'center'
				}}
			>
				<Space>
					<FontAwesomeIcon icon={faFileCode} color='#a6a6a6' fontSize={30} />
					<Text>{name}</Text>
				</Space>
				<Space>
					<Button
						type='primary'
						href={`http://${HOST}:${PORT}/api/file/download?file=${name}`}
						icon={<FontAwesomeIcon icon={faDownload} />}
						tooltipTitle={t('download')}
						tooltipPlacement='bottom'
					/>
					<Button
						type='primary'
						danger
						icon={<FontAwesomeIcon icon={faTrashCan} />}
						tooltipTitle={t('delete')}
						tooltipPlacement='bottom'
						onClick={handleRemoveFile}
					/>
				</Space>
			</div>
		)
	})

	const handleGetFiles = async () => {
		const { success, data } = await getFiles()

		if (success) {
			setDirs(data.data)
		}
	}

	useEffect(() => {
		handleGetFiles()
	}, [])

	return (
		<div
			style={{
				height: '100%',
				padding: 10
			}}
		>
			<UploadFileModal
				open={state}
				onCancel={close}
			/>
			<Row gutter={[10, 10]}>
				<Col span={24}>
					<Space
						style={{
							padding: 10,
							backgroundColor: 'white',
							borderRadius: 5,
							width: '100%'
						}}
					>
						<Button
							type="primary"
							icon={<FontAwesomeIcon icon={faRotate} color='white' />}
							onClick={handleGetFiles}
						>
							{t('reload').toUpperFirst()}
						</Button>
						<Button
							onClick={open}
							type="primary"
							icon={<FontAwesomeIcon icon={faUpload} color='white' />}
							style={{ backgroundColor: 'green' }}
						>
							{t('upload file').toUpperFirst()}
						</Button>
					</Space>
				</Col>
				<Col span={24}>
					<Space
						direction='vertical'
						style={{
							width: '100%',
							padding: 10,
							backgroundColor: 'white',
							borderRadius: 5
						}}
					>
						{files}
					</Space>
				</Col>
			</Row>
		</div>
	)
}

export default File