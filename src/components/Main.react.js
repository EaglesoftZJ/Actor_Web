/*
 * Copyright (C) 2015-2016 Actor LLC. <https://actor.im>
 */
import { isFunction } from 'lodash';
import React, { Component, PropTypes } from 'react';
import DelegateContainer from '../utils/DelegateContainer';

import VisibilityActionCreators from '../actions/VisibilityActionCreators';
import LoginActionCreators from '../actions/LoginActionCreators';
import MessageAlertActionCreators from '../actions/MessageAlertActionCreators';
import DialogActionCreators from '../actions/DialogActionCreators';

import DefaultSidebar from './Sidebar.react';
import DefaultToolbar from './Toolbar.react';
import ConnectionState from './common/ConnectionState.react';
import Favicon from './common/Favicon.react';
import Department from './Department.react';
import ModalsWrapper from './modals/ModalsWrapper.react';
import MenuOverlay from './common/MenuOverlay.react';
import SmallCall from './SmallCall.react';
import MessageAlert from './common/MessageAlert.react';

import loading from '../utils/DataLoading';
import ActorClient from '../utils/ActorClient';

import history from '../utils/history';
import { setTimeout } from 'timers';

class Main extends Component {
  static propTypes = {
    params: PropTypes.object,
    children: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.node),
      PropTypes.node
    ])
  };

  constructor(props) {
    super(props);

    this.components = this.getComponents();
  }

  getComponents() {
    const { components } = DelegateContainer.get();

    if (components) {
      return {
        Sidebar: isFunction(components.sidebar) ? components.sidebar : DefaultSidebar,
        Toolbar: isFunction(components.toolbar) ? components.toolbar : DefaultToolbar
      };
    }

    return {
      Sidebar: DefaultSidebar,
      Toolbar: DefaultToolbar
    };
  }
  componentWillMount() {
    if (ActorClient.isElectron()) {
      this.handleEletronEr();
    }
  }

  componentDidMount() {
    // 测试
    // message('测试测试测试');  

    this.onVisibilityChange();
    if (ActorClient.isElectron()) {
      window.messenger.listenOnRender('windows-blur', function(event, arg) {
        history.push('/im');
      })

      window.messenger.listenOnRender('windows-focus', function(event, arg) {

        history.push(`/im/${arg}`);
      })


      window.messenger.listenOnRender('setLoggedOut', function(event, arg) {
        if (ActorClient.isElectron()) {
            // 存储用户信息
          // ActorClient.sendToElectron('setLoginStore', {key: 'info.auto', value: false });
          // ActorClient.sendToElectron('setLoginStore', {key: 'info.isLogin', value: false });
          LoginActionCreators.setLoggedOut();
        }
      })
      this.getDialogStore();
    } else {
      document.addEventListener('visibilitychange', this.onVisibilityChange);

    }
  }

  componentWillUnmount() {
    document.removeEventListener('visibilitychange', this.onVisibilityChange);
  }

  handleEletronEr() {
    window.messenger.listenOnRender('inMainTimes', (event, data) => {
      if (data === 1 && LoginStore.isLoggedIn()) {
        // 打开客户端后第一次进入main并且处于登录状态，需要退出登录处理
        LoginActionCreators.setLoggedOut(true);
      }
    });
    ActorClient.sendToElectron('recodeInMain');
  }

  getDialogStore() {
    window.messenger.listenOnRender('dialogStore', function(event, arg) {
      if (arg) {
        console.log('getDialogStore', arg);
        DialogActionCreators.setDialogs(arg.dialogs);
      }
    });
    ActorClient.sendToElectron('getDialogStore');
  }

  handleVisible() {
    if (document.visibilityState === 'visible') {
      ActorClient.sendToElectron('window-visible');
    } else if (document.visibilityState === 'hidden') {
      ActorClient.sendToElectron('window-hidden');
    }
  }

  onVisibilityChange = () => {
    if (document.hidden) {
      VisibilityActionCreators.createAppHidden();
    } else {
      VisibilityActionCreators.createAppVisible();
    }
  };

  renderCall() {
    const { features } = DelegateContainer.get();

    if (!features.calls) {
      return null;
    }

    return <SmallCall />;
  }
  handleClick() {
    MessageAlertActionCreators.show({name: 123, type: 'success', key: new Date().getTime()})
  }

  render() {
    const { Sidebar, Toolbar } = this.components;
    return (
      <div className="app">
        {/* <a href="javascript:;" target="_self" onClick={this.handleClick.bind(this)} style={{position: 'absolute', 'zIndex': 99999, top: 0, left: 0}}>click</a> */}

        <ConnectionState />
        <Favicon />

        <Toolbar />
        <section className="wrapper">
          <Sidebar />
          {this.props.children}
        </section>

        <MessageAlert />
        <ModalsWrapper />
        <MenuOverlay />

        {this.renderCall()}
      </div>
    );
  }
}

export default Main;
