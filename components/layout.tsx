import { Button, Icon, Layout, Menu, Tag } from 'antd';
import {withRouter} from 'next/router';
import LoginModal from './forms/login';
import cookie from 'cookie';
import redirect from '../lib/redirect';
import * as React from "react";
import MenuItem from 'antd/lib/menu/MenuItem';
import 'antd/dist/antd.css';
import './layout.css';

const { Header, Content, Footer, Sider } = Layout;

// this gets rid of the style property not found errors.
const MyMenuItem = MenuItem as any;
const MyFooter = Footer as any;

const headerLink = ({ children, router, href }) => {
  const style = {
    marginLeft: 16,
    color: router.pathname === href? 'red' : 'white',
    fontSize: 12
  }

  const handleClick = (e) => {
    e.preventDefault();
    router.push(href);
  }

  return (
    <a href={href} onClick={handleClick} style={style}>
      {children}
    </a>
  )
}

const HeaderLink = withRouter(headerLink);

export interface LayoutProps {
  pageProps: any,
  apolloClient: any,
  title: string,
}

export default class JuiceLayout extends React.Component<LayoutProps, any> {
  loginModal: any 
  user: any
  collapsed: boolean

  constructor(props: any) {
    super(props)

    if (this.props.pageProps) {
      this.state = {
        user: this.props.pageProps.user,
        collapsed: false,
      }
    } else {
      this.state = {
        user: null,
        collapsed: true,
      }
    }
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const user = this.props.pageProps.user 
    if (this.state.user != user) {
      this.setState({user: this.props.pageProps.user})
    }
  }

  logout = () => {
    document.cookie = cookie.serialize('token', '', {
      maxAge: -1 
    })
    document.cookie = cookie.serialize('refresh', '', {
      maxAge: -1
    })
    this.props.apolloClient.cache.reset().then(() => {
      redirect({}, '/')
    })
  }

  showModal = () => {
    // this.loginModal is assigned in the onRef callback of <LoginModal>
    this.loginModal.show()
  }

  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  }

  render = () => {
    const rightMenuStyle = {
      float: 'right',
      background: '#001529',
    }
    const logoStyle = {
      height: '25px',
      margin: '9px'
    }
    const leftMenuStyle = {
      background: '#001529'
    }
    const contentStyle = { 
      margin: '8px 8px', 
      padding: 24,
      background: '#fff', 
      minHeight: 280 
    }
    const footerStyle = { textAlign: 'center' } 

    let topBar: any
    let sider: any = null

    // logged in users will see this
    if (this.state.user) {
      topBar = 
        <Menu
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={['1']}
        >
          <Icon
            className="trigger"
            type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}
            onClick={this.toggle}
            style={{padding: '0 24px'}}
          />
          <span style={{ color: 'red', fontSize: 12 }}>{this.props.title}</span>
          <MyMenuItem key="logout" style={rightMenuStyle} onClick={this.logout}>
            <Tag color="orange">2000.000000000890 BTC</Tag>
          </MyMenuItem>
        </Menu>
      
      sider = 
        <Sider
          trigger={null}
          collapsible={true}
          collapsedWidth="0"
          collapsed={this.state.collapsed}
          width="150"
        >
          <div style={logoStyle} />
          <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
            <Menu.Item key="profile" >
              <Icon type="user" />
              <span><HeaderLink href="/profile">profile</HeaderLink></span>
            </Menu.Item>
            <Menu.Item key="funds" >
              <Icon type="fund" />
              <span><HeaderLink href="/funds">funds</HeaderLink></span>
            </Menu.Item>
            <Menu.Item key="sketch" >
              <Icon type="bulb" />
              <span><HeaderLink href="/sketch">sketch</HeaderLink></span>
            </Menu.Item>
            <Menu.Item key="create" >
              <Icon type="bulb" />
              <span><HeaderLink href="/create">create</HeaderLink></span>
            </Menu.Item>
            <Menu.Item key="story" >
              <Icon type="read" />
              <span><HeaderLink href="/story">story</HeaderLink></span>
            </Menu.Item>
            <Menu.Item key="support" >
              <Icon type="customer-service" />
              <span><HeaderLink href="/support">support</HeaderLink></span>
            </Menu.Item>
          </Menu>
        </Sider>
    } else {
      topBar = 
        <Menu
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={['1']}
        >
          <MyMenuItem key="index" style={leftMenuStyle}><HeaderLink href="/">freemoon</HeaderLink></MyMenuItem>
          <MyMenuItem key="story" style={leftMenuStyle}><HeaderLink href="/story">story</HeaderLink></MyMenuItem>
          <MyMenuItem key="signup" style={rightMenuStyle}><HeaderLink href="/signup">signup</HeaderLink></MyMenuItem>
          <MyMenuItem key="login" style={rightMenuStyle}>
            <Button type="primary" onClick={this.showModal}>
              login
            </Button>
          </MyMenuItem>
        </Menu>
    }

    return (
      <span>
        <LoginModal 
          onRef={ref => (this.loginModal = ref)}
          apolloClient={this.props.apolloClient}
        />
        <Layout>
          {sider}
          <Layout className="layout">
            <Header style={{height: '46px', background: '#fff', padding: 0 }}>
              {topBar}
            </Header>
            <Content style={contentStyle}>
              {this.props.children}
            </Content>
            <MyFooter style={footerStyle}>
              freemoon ©2019 Created by ST6 😘 
            </MyFooter>
          </Layout>
        </Layout>
      </span>
    )
  }
}