import React from 'react'
import useTranslate from '../../lang/useTranslate'

import { Layout } from 'antd'

const Footer = () => {
    const t = useTranslate()
    
    return (
        <Layout.Footer
            style={{
                padding: 10,
                paddingLeft: 20,
                paddingRight: 20,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                boxShadow: '0px 0px 20px 0px rgba(0,0,0,0.1)',
                zIndex: 1
            }}
        >
            <div>
            </div>
            <div>
                <small>{`${t('version').toCapitalize()} 1.0.0`}</small>
            </div>
        </Layout.Footer>
    )
}

export default Footer