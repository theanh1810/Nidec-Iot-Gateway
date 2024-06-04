import React, { useContext, useState, useEffect } from 'react'
import useSider from '../../store/useSider'
import useUser from '../../store/useUser'
import useTranslate from '../../lang/useTranslate'
import { useNavigate } from 'react-router-dom'
import useModal from '@@utils/hooks/useModal'

import { MenuFoldOutlined, MenuUnfoldOutlined, UserOutlined, BellOutlined } from '@ant-design/icons'
import { Layout, Button, Row, Col, Avatar, Space, Typography, Dropdown, Drawer } from 'antd'
import { DownOutlined } from '@ant-design/icons'
import LangSelect from '../../components/LangSelect'
import AppContext from '@@context/AppContext'

const { Text } = Typography

const Header = () => {
    const t = useTranslate()
    const navigate = useNavigate()
    const { socket } = useContext(AppContext)
    const { state, open, close } = useModal()
    const { toggle, isHide } = useSider()
    const { username } = useUser()
    const [notification, setNotification] = useState([])

    const items = [
        {
            key: 1,
            label: t('logout').toCapitalize(),
            onClick: () => navigate('/login')
        }
    ]

    const handleClearNotification = () => setNotification([])

    const handleErrorMessage = (errMessage) => setNotification(prev => {
        if (prev.length >= 100) prev.length = 99
        return [errMessage, ...prev]
    })

    useEffect(() => {
        socket.on('err-messenger', handleErrorMessage)

        return () => {
            socket.off('err-messenger', handleErrorMessage)
        }
    }, [])

    return (
        <Layout.Header
            style={{
                height: 'unset',
                lineHeight: 'unset',
                backgroundColor: '#fff',
                padding: 10,
                boxShadow: '0px 0px 20px 0px rgba(0,0,0,0.1)',
                zIndex: 1
            }}
        >
            <Row
                gutter={10}
                justify='center'
                align='middle'
            >
                <Col span={8}>
                    <Space>
                        <Button
                            type='text'
                            onClick={toggle}
                            icon={isHide ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                        />
                        <Avatar
                            shape='square'
                            size='small'
                            icon={<UserOutlined />}
                        />
                        <Dropdown
                            menu={{ items }}
                            trigger={['click']}
                        >
                            <Space>
                                <Text>{username}</Text>
                                <DownOutlined style={{ fontSize: 10 }} />
                            </Space>
                        </Dropdown>
                    </Space>
                </Col>
                <Col span={8}>
                </Col>
                <Col span={8}>
                    <Row
                        justify='end'
                        align='middle'
                    >
                        <Col>
                            <Button
                                type='text'
                                icon={<BellOutlined style={{ fontSize: 15 }} />}
                                onClick={open}
                            />
                        </Col>
                        <Col>
                            <LangSelect />
                        </Col>
                    </Row>
                </Col>
            </Row>
            <Drawer
                title='Notification'
                placement='right'
                extra={
                    <Button
                        type='primary'
                        danger
                        onClick={handleClearNotification}
                    >
                        clear
                    </Button>
                }
                open={state}
                onClose={close}
                closeIcon={null}
            >
                <Space
                    direction='vertical'
                >
                    {notification.map(n => <Text>{n}</Text>)}
                </Space>
            </Drawer>
        </Layout.Header>
    )
}

export default Header