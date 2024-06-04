import React, { useMemo } from 'react'
import useProvider from '../store/useProvider'

import { Dropdown, Button } from 'antd'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLanguage } from '@fortawesome/free-solid-svg-icons'
import { LANG } from '../configs/app.config'

const LangSelect = () => {
	const { lang, setLang } = useProvider()

	const items = useMemo(() => Object.entries(LANG).map(([key, label]) => ({
		key,
		label,
		onClick: () => setLang(key)
	})), [])

	return (
		<Dropdown
			trigger={['click']}
			menu={{
				selectedKeys: lang,
				items
			}}
		>
			<Button
				type='text'
				icon={<FontAwesomeIcon icon={faLanguage} />}
			/>
		</Dropdown>
	)
}

export default LangSelect