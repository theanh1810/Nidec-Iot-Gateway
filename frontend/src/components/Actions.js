import React from 'react'
import useTranslate from '@@lang'
import { isFunction } from '@@utils/checkType'

import { Space } from 'antd'
import Button from './Button'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrashCan, faPen, faInfo } from '@fortawesome/free-solid-svg-icons'

const Actions = ({
	titleIndex,
	record,
	onEdit: emitEdit,
	onInfo: emitInfo,
	onDelete: emitDelete
}) => {
	const t = useTranslate()

	const handleEdit = () => {
		if (isFunction(emitEdit)) emitEdit(record)
	}

	const handleInfo = () => {
		if (isFunction(emitInfo)) emitInfo(record)
	}

	const handleDelete = () => {
		if (isFunction(emitDelete)) emitDelete(record)
	}

	return (
		<Space>
			{emitEdit && (
				<Button
					type='primary'
					icon={<FontAwesomeIcon icon={faPen} />}
					tooltipPlacement='left'
					tooltipTitle={t('edit')}
					onClick={handleEdit}
				/>
			)}
			{emitInfo && (
				<Button
					type='primary'
					icon={<FontAwesomeIcon icon={faInfo} />}
					tooltipPlacement='bottom'
					tooltipTitle={t('info')}
					onClick={handleInfo}
					color='green'
				/>
			)}
			{emitDelete && (
				<Button.Confirm
					type='primary'
					danger
					icon={<FontAwesomeIcon icon={faTrashCan} />}
					tooltipPlacement='right'
					tooltipTitle={t('delete')}
					popconfirmTitle={`${t('delete')} ${titleIndex ? record[titleIndex] : t('data')}`}
					onConfirm={handleDelete}
				/>
			)}
		</Space>
	)
}

export default Actions