import { Button, Layout, Menu } from 'antd';
import {withRouter} from 'next/router'
import LoginModal from './forms/login'
import 'antd/dist/antd.css'
import cookie from 'cookie'
import redirect from '../lib/redirect'
import * as React from "react";
import MenuItem from 'antd/lib/menu/MenuItem';


const { Header, Content, Footer } = Layout;

// this gets rid of the style property not found errors.
const MyMenuItem = MenuItem as any;
const MyFooter = Footer as any;

const headerLink = ({ children, router, href }) => {
  const style = {
    marginRight: 10,
    color: router.pathname === href? 'red' : 'white'
  }

  const handleClick = (e) => {
    e.preventDefault()
    router.push(href)
  }

  return (
    <a href={href} onClick={handleClick} style={style}>
      {children}
    </a>
  )
}

const HeaderLink = withRouter(headerLink)

export interface LayoutProps {
  pageProps: any,
  apolloClient: any;
}

export default class JuiceLayout extends React.Component<LayoutProps, any>{
  loginModal:any 

  constructor(props: any) {
    super(props)

    if (this.props.pageProps) {
      this.state = {
        user: this.props.pageProps.user 
      }
    } else {
      this.state = {
        user: null 
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

  render = () => {
    const rightMenuStyle = {
      float: 'right',
      background: '#001529'
    }

    const leftMenuStyle = {
      float: 'left',
      background: '#001529'
    }
    const menuStyle = { lineHeight: '64px' }
    const contentStyle = { padding: '50px' }
    const footerStyle = { textAlign: 'center' } 

    let topBar: any

    // logged in users will see this
    if (this.state.user) {
      topBar = 
        <Menu
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={['1']}
          style={menuStyle}
        >
          <MyMenuItem key="index" style={leftMenuStyle}><HeaderLink href="/">gammex</HeaderLink></MyMenuItem>
          <MyMenuItem key="sketch" style={leftMenuStyle}><HeaderLink href="/sketch">sketch</HeaderLink></MyMenuItem>
          <MyMenuItem key="create" style={leftMenuStyle}><HeaderLink href="/create">create</HeaderLink></MyMenuItem>
          <MyMenuItem key="logout" style={rightMenuStyle}>
            <Button type="primary" onClick={this.logout}>
              {this.state.user.username} 
            </Button>
          </MyMenuItem>
        </Menu>
    } else {
      topBar = 
        <Menu
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={['1']}
          style={menuStyle}
        >
          <MyMenuItem key="index" style={leftMenuStyle}><HeaderLink href="/">gammex</HeaderLink></MyMenuItem>
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
          //onLogin={this.login}
        />
        <Layout className="layout">
          <Header>
            {topBar}
          </Header>
          <Content style={contentStyle}>
            {this.props.children}
          </Content>
          <MyFooter style={footerStyle}>
            gammex ©2019 Created by The Hajji Foundation 😘 
          </MyFooter>
        </Layout>
      </span>
    )
  }
}