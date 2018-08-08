/*
 * Copyright (C) 2015 Actor LLC. <https://actor.im>
 */

import React, { Component } from 'react';
import { Container } from 'flux/utils';
import classnames from 'classnames';

import MessageActions from './dropdown/MessageActions.react';
import RecentContextMenu from './dropdown/RecentContextMenu.react'

import DropdownStore from '../../stores/DropdownStore';
import DialogStore from '../../stores/DialogStore';
import ProfileStore from '../../stores/ProfileStore';

class MenuOverlay extends Component {
  static getStores() {
    return [DropdownStore, DialogStore, ProfileStore];
  }

  static calculateState() {
    const message = DropdownStore.getMessage();

    return {
      isMessageDropdownOpen: DropdownStore.isMessageDropdownOpen(message.rid),
      isRecentContextOpen: DropdownStore.isRecentContextOpen(),
      targetRect: DropdownStore.getTargetRect(),
      contextPos: DropdownStore.getContextPos(),
      contextPeer: DropdownStore.getPeer(),
      profile: ProfileStore.getProfile(),
      message
    };
  }

  constructor(props) {
    super(props);
  }

  render() {
    const { isMessageDropdownOpen, isRecentContextOpen, message, targetRect, contextPeer, contextPos, profile } = this.state;
    const currentPeer = DialogStore.getCurrentPeer();

    const menuOverlayClassName = classnames('menu-overlay', {
      'menu-overlay--opened': isMessageDropdownOpen || isRecentContextOpen
    });

    return (
      <div className={menuOverlayClassName}>
        {
          isMessageDropdownOpen
            ? <MessageActions message={message}
                              targetRect={targetRect}
                              peer={currentPeer}
                              profile={profile}
                              hideOnScroll/>
            : null
        }
        {
          isRecentContextOpen
            ? <RecentContextMenu peer={contextPeer}
                                 contextPos={contextPos}
                                 hideOnScroll/>
            : null
        }
      </div>
    );
  }
}

export default Container.create(MenuOverlay, { pure: false });
