import React, { Component } from 'react';
import ReactDOM from 'react-dom'
import {Map, InfoWindow, Marker, GoogleApiWrapper} from 'google-maps-react';
  
const Mystore = ({store}) => {


  const uniqueStore = Array.from(new Set(store));
  return (
        <ul>
          {uniqueStore.map(x => {
            return (
              <li><h3>{x}</h3></li>
            )
          })}
        </ul>
  )
}


export class Mexicomap extends Component {
constructor(props) {
    super(props);

    this.state = {
      places: [],
      showingInfoWindow: false,
      activeMarker: {},
      selectedStore: {},
      favouiteStore: [],
    }
    this.onMarkerClick = this.onMarkerClick.bind(this)
  }

onLoad(mapProps, map) {
  this.search(map, map.center);
}

onMarkerClick(props, marker) {
    this.setState({
      selectedStore: props,
      activeMarker: marker,
      showingInfoWindow: true,
      favouiteStore:[...this.state.favouiteStore, props.name]
    })
}


search(map, center) {
    const {google} = this.props;
    const service = new google.maps.places.PlacesService(map);

    const request = {
       location: center,
       radius: '400',
       type: ['stores']
     };

    service.nearbySearch(request, (results, status, pagination) => {

        this.pagination = pagination;
        this.setState({
          places: results,
          hasNextPage: pagination.hasNextPage,
          center: center,
        })
    })
  }

render() {

   if (!this.props.loaded) {
      return <div>Loading map...</div>
    }

    return (
      <Map google={this.props.google}
            initialCenter={{
            lat: 19.425004,
            lng: -99.126457
            }}
            onReady={this.onLoad.bind(this)}
            style={{width: '50%', height: '50%', position: 'relative'}}>


        <div>
          <h2>My Favourite Stores</h2>
          <Mystore store={this.state.favouiteStore}/>
        </div>

        {this.state.places.map(place => (
           <Marker
            onClick={this.onMarkerClick}
            name={place.name}
            position={{lat: place.geometry.viewport.f.f, lng: place.geometry.viewport.b.f}} />
        ))}

        <InfoWindow
          marker={this.state.activeMarker}
          visible={this.state.showingInfoWindow}
          onClose={this.onInfoWindowClose}>
            <div>
              <h1>{this.state.selectedStore.name}</h1>
            </div>
        </InfoWindow>
      </Map>
    );
  }
}
 
export default GoogleApiWrapper({
  apiKey: 'AIzaSyCVH8e45o3d-5qmykzdhGKd1-3xYua5D2A'
})(Mexicomap)