/*
 * Copyright (C) 2015-2016 Actor LLC. <https://actor.im>
 */

import { isFunction } from 'lodash';
import React, { Component, PropTypes } from 'react';
import { MessageContentTypes } from '../../../constants/ActorAppConstants';

// Default message content components
import DefaultService from './Service.react';
import DefaultText from './Text.react';
import DefaultSysText from './sysText.react';
import DefaultPhoto from './Photo.react';
import DefaultAnimation from './Animation.react';
import DefaultDocument from './Document.react';
import DefaultVoice from './Voice.react';
import DefaultContact from './Contact.react';
import DefaultLocation from './Location.react';
import DefaultModern from './Modern.react';
import DefaultSticker from './Sticker.react';

class MessageContent extends Component {
  static contextTypes = {
    delegate: PropTypes.object.isRequired
  }

  static propTypes = {
    content: PropTypes.object.isRequired
  }

  constructor(props, context) {
    super(props, context);

    const { dialog } = context.delegate.components;
    if (dialog && dialog.messages) {
      this.components = {
        Service: isFunction(dialog.messages.service) ? dialog.messages.service : DefaultService,
        Text: isFunction(dialog.messages.text) ? dialog.messages.text : DefaultText,
        SysText: isFunction(dialog.messages.sysText) ? dialog.messages.sysText : DefaultSysText,
        Modern: isFunction(dialog.messages.modern) ? dialog.messages.modern : DefaultModern,
        Photo: isFunction(dialog.messages.photo) ? dialog.messages.photo : DefaultPhoto,
        Animation: isFunction(dialog.messages.animation) ? dialog.messages.animation : DefaultAnimation,
        Document: isFunction(dialog.messages.document) ? dialog.messages.document : DefaultDocument,
        Voice: isFunction(dialog.messages.voice) ? dialog.messages.voice : DefaultVoice,
        Contact: isFunction(dialog.messages.contact) ? dialog.messages.contact : DefaultContact,
        Location: isFunction(dialog.messages.location) ? dialog.messages.location : DefaultLocation,
        Sticker:  isFunction(dialog.messages.sticker) ? dialog.messages.sticker : DefaultSticker
      };
    } else {
      this.components = {
        Service: DefaultService,
        Text: DefaultText,
        SysText: DefaultSysText,
        Modern: DefaultModern,
        Photo: DefaultPhoto,
        Animation: DefaultAnimation,
        Document: DefaultDocument,
        Voice: DefaultVoice,
        Contact: DefaultContact,
        Location: DefaultLocation,
        Sticker: DefaultSticker
      };
    }
  }

  shouldComponentUpdate(nextProps) {
    return this.props.content !== nextProps.content;
  }

  render() {
    const { content } = this.props;
    const { Service, Text, Photo, Animation, Document, Voice, Contact, Location, Modern, Sticker, SysText } = this.components;

    switch (content.content) {
      case MessageContentTypes.SERVICE:
        return (
          <Service
            {...content}
            className="message__content message__content--service"
          />
        );
      case MessageContentTypes.TEXT:
        return (
          <Text
            {...content}
            className="message__content message__content--text"
          />
        );
      case MessageContentTypes.CUSTOM_JSON:
        if (content.operation === 'revert') {
          // 撤回
          return (
            <SysText
              {...content}
              className="message__content message__content--systext"
            />        
          );
        }
        return '';
      case MessageContentTypes.PHOTO:
        return (
          <Photo
            {...content}
            className="message__content message__content--photo"
          />
        );
      case MessageContentTypes.ANIMATION:
        return (
          <Animation
            {...content}
            className="message__content message__content--photo"
          />
        );
      case MessageContentTypes.DOCUMENT:
        return (
          <Document
            {...content}
            className="message__content message__content--document"
          />
        );
      case MessageContentTypes.VOICE:
        return (
          <Voice
            {...content}
            className="message__content message__content--voice"
          />
        );
      case MessageContentTypes.CONTACT:
        return (
          <Contact
            {...content}
            className="message__content message__content--contact"
          />
        );
      case MessageContentTypes.LOCATION:
        return (
          <Location
            {...content}
            className="message__content message__content--location"
          />
        );
      case MessageContentTypes.TEXT_MODERN:
        return (
          <Modern
            {...content}
            className="message__content message__content--modern"
          />
        );
      case MessageContentTypes.STICKER:
        return (
          <Sticker
            {...content}
            className="message__content message__content--sticker"
          />
        );
      default:
        return null;
    }
  }
}

export default MessageContent;
