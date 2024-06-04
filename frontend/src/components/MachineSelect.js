import React, { useEffect, useMemo, useState } from 'react'
import useTranslate from '@@lang'
import useMachine from '@@api/useMachine'

import { Select } from 'antd'

const MachineSelect = ({ value, onChange }) => {
	const t = useTranslate()
	const { getMachines } = useMachine()
	const [machines, setMachines] = useState([])

	const options = useMemo(() => machines.map(machine => ({
		label: machine.Name,
		value: machine.ID
	})), [machines])

	const handleGetMachines = async () => {
		const { success, data } = await getMachines()
		if(success) {
			// console.log(data)
			setMachines(data.data)
		}
	}

	useEffect(() => {
		handleGetMachines()
	}, [])

	return (
		<Select
			style={{ width: '100%' }}
			placeholder={t('select machine')}
			allowClear
			showSearch
			options={options}
			value={value}
			onChange={onChange}
		/>
	)
}

export default MachineSelect