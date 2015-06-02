import React from 'react';
import Router from 'react-router';
import AppState from '../state';
import Modal from './Modal';
var Link = Router.Link;

export default React.createClass({
  render() {
    let layerImages = this.props.design.get('layers')
      .map(layerImageId => {
        var imageUrl = AppState.imageForLayer(layerImageId);
        return (
          <div className="layer" key={layerImageId}>
            <img src={imageUrl} width={100} height={100} />
          </div>
        );
      });
    return (
      <section className="show-design">
        <div className="show-canvas">
          <Link to="designDetail" params={{ designId: this.props.design.get('id') }}>
            <div className="canvas">
              {layerImages}
            </div>
          </Link>
        </div>
      </section>
    );
  }
})
