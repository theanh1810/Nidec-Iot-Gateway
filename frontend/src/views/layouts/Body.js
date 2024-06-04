import React from 'react'

import { Layout } from 'antd'

const Body = ({ children }) => {
    return (
        <Layout.Content
            style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                overflow: 'auto'
            }}
        >
            {children}
        </Layout.Content>
    )
}

export default Body