import React from 'react'
import CircularSpinner from './Circular'
// import './loader.css'
class ImageLoader extends React.Component {
   state = {
      src: `https://placeimg.com/295/295/any/tech?t=${new Date().getMilliseconds()}`,
      loaded: false
   }
   onImageLoaded = () => {
      this.setState({ loaded: true })
   }
   // refreshImage = () => {
   //    this.setState({
   //       loaded: false,
   //       src: `https://placeimg.com/295/295/any/tech?t=${new Date().getMilliseconds()}`
   //    })
   // }
   render() {
      const { src, loaded } = this.state;
      return (
         <>
            <div className="image-container">
               {/* <img src={src} onLoad={this.onImageLoaded} alt=""
               // onError={this.onImageError}
               /> */}
               {!loaded && (
                  <div className="image-container-overlay">
                     <CircularSpinner />
                  </div>
               )}
            </div>
            {/* <div>
               <button onClick={this.refreshImage} className="button">
                  Refresh Image
               </button>
            </div> */}
         </>
      )
   }
}
export default ImageLoader