/*
 * Copyright (C) 2015-2016 Actor LLC. <https://actor.im>
 */

import React, { Component, PropTypes } from 'react';
import { getDimentions, lightbox } from '../../../utils/ImageUtils';
import ActorClient from '../../../utils/ActorClient';

import MessageAlertActionCreators from '../../../actions/MessageAlertActionCreators';

class Photo extends Component {
  static propTypes = {
    fileUrl: PropTypes.string,
    w: PropTypes.number.isRequired,
    h: PropTypes.number.isRequired,
    preview: PropTypes.string.isRequired,
    isUploading: PropTypes.bool.isRequired
  };

  onClick(event) {
    event.preventDefault();
    lightbox.open(event.target.src, 'message');
  }

  getDimentions() {
    const { w: width, h: height } = this.props;
    return getDimentions(width, height);
  }
  
  handleCopy() {
    const { fileUrl, preview } = this.props;
    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d');
    var img = new Image();
    img.setAttribute('crossOrigin', 'anonymous');
    img.onload = () => {
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      ctx.drawImage(img, 0, 0);
      document.body.appendChild(canvas);
      var dataUrl = canvas.toDataURL();
      ActorClient.sendToElectron('copy-image', {dataUrl});
      MessageAlertActionCreators.show({title: '图片复制成功', type: 'success', key: new Date().getTime()})

    }
    img.src = fileUrl || preview;
  }

  render() {
    const { fileUrl, preview } = this.props;
    const { width, height } = this.getDimentions();
    console.log(fileUrl, preview);

    return (
      <div className="message__photo__box">
        <img
          className="message__photo"
          src={fileUrl || preview}
          width={width}
          height={height}
          onClick={this.onClick}
        />
        {
          ActorClient.isElectron() ?
          <div className="btn-box">
            <a className="download img-icon" href={fileUrl || preview} download={fileUrl || preview} target="_self">下载</a>
            <a className="copy img-icon" href="javascript:;" target="_self" onClick={this.handleCopy.bind(this)}>复制</a>
          </div> : null
        }
      </div>
    );
  }
}

export default Photo;
