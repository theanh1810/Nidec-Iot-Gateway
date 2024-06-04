import React from 'react'
import useTranslate from '../lang/useTranslate'
import useModal from '../utils/hooks/useModal'
import { isFunction } from '../utils/checkType'

import { Button as AntdButton, Tooltip, Popconfirm, Modal as AntdModal, Dropdown as AntDropdown } from 'antd'

const Button = ({
	children,
	type = 'primary',
	icon,
	tooltipTitle,
	tooltipPlacement,
	color,
	...props
}) => {
	return (
		<Tooltip
			title={tooltipTitle}
			placement={tooltipPlacement}
		>
			<AntdButton
				type={type}
				icon={icon}
				style={{
					backgroundColor: color,
					borderColor: color
				}}
				{...props}
			>
				{children}
			</AntdButton>
		</Tooltip>
	)
}

const Confirm = ({
	children,
	popConfirmPlacement = 'bottom',
	popconfirmTitle,
	confirmText = 'yes',
	cancelText =  'no',
	onConfirm: emitConfirm,
	onCancel: emitCancel,
	...props
}) => {
	const t = useTranslate()
	
	return (
		<Popconfirm
			title={popconfirmTitle}
			okText={t(confirmText).toUpperFirst()}
			cancelText={t(cancelText).toUpperFirst()}
			onConfirm={emitConfirm}
			onCancel={emitCancel}
			placement={popConfirmPlacement}
		>
			<Button {...props}>
				{children}
			</Button>
		</Popconfirm>
	)
}

const Modal = ({
	children,
	modalContent,
	modalTitle,
	modalWidth = 500,
	onConfirm: emitConfirm,
	onCancel: emitCancel,
	...props
}) => {
	const { state, open, close } = useModal()
	
	const handleConfirm = () => {
		isFunction(emitConfirm) && emitConfirm()
		close()
	}

	const handleCancel = () => {
		isFunction(emitCancel) && emitCancel()
		close()
	}

	return (
		<>
			<Button
				onClick={open}
				{...props}
			>
				{children}
			</Button>
			<AntdModal
				width={modalWidth}
				title={modalTitle}
				open={state}
				onOk={handleConfirm}
				onCancel={handleCancel}
				maskClosable={false}
				destroyOnClose={true}
			>
				{modalContent}
			</AntdModal>
		</>
	)
}

const Dropdown = ({
	children,
	trigger = ['click'],
	dropdownRender,
	...props
}) => {
	return (
		<AntDropdown
			trigger={trigger}
			dropdownRender={dropdownRender}
		>
			<Button {...props}>
				{children}
			</Button>
		</AntDropdown>
	)
}

Button.Confirm = Confirm
Button.Modal = Modal
Button.Dropdown = Dropdown

export default Button