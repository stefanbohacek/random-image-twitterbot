const fs = require( 'fs' ),
      path = require( 'path' ),
      request = require( 'request' ),
      exec  = require( 'child_process' );

module.exports = {
  randomFromArray: function( arr ) {
    return arr[Math.floor( Math.random() * arr.length )]; 
  },
  getRandomInt: function( min, max ) {
    return Math.floor( Math.random() * ( max - min + 1 ) ) + min;
  },
  getRandomRange: function( min, max, fixed ) {
    return ( Math.random() * ( max - min ) + min ).toFixed( fixed ) * 1;
  },
  getRandomHex: function() {
    return '#' + Math.random().toString( 16 ).slice( 2, 8 ).toUpperCase();
  },
  shadeColor: function( color, percent ) {
    // https://stackoverflow.com/questions/5560248/programmatically-lighten-or-darken-a-hex-color-or-rgb-and-blend-colors
    let f = parseInt( color.slice( 1 ),16 ),t=percent<0?0:255,p=percent<0?percent*-1:percent,R=f>>16,G=f>>8&0x00FF,B=f&0x0000FF;
    return `#${( 0x1000000+( Math.round( ( t-R )*p )+R )*0x10000+( Math.round( ( t-G )*p )+G )*0x100+( Math.round( ( t-B )*p )+B ) ).toString( 16 ).slice( 1 )}`;
  },  
  loadAssets: function( cb ){
    console.log( 'reading assets folder...' )
    let that = this;
    fs.readFile( './.glitch-assets', 'utf8', function ( err, data ) {
      if ( err ) {
        console.log( 'error:', err );
        cb( err );
        return false;
      }
      cb( null, data );
    } );      
  },
  loadImageAssets: function( cb ){
    let helpers = this;

    helpers.loadAssets( function( err, data ){
      /* Filter images in the assets folder */
      data = data.split( '\n' );

      let data_json = JSON.parse( '[' + data.join( ',' ).slice( 0, -1 ) + ']' );
      
      let deleted_images = data_json.reduce( function( filtered, data_img ) {
            if ( data_img.deleted ) {
               let someNewValue = { name: data_img.name, newProperty: 'Foo' }
               filtered.push( data_img.uuid );
            }
            return filtered;
          }, [] ),
          img_urls = [];
    
        for ( let i = 0, j = data.length; i < j; i++ ){
          if ( data[i].length ){
            let img_data = JSON.parse( data[i] ),
                image_url = img_data.url;
  
            if ( image_url && deleted_images.indexOf( img_data.uuid ) === -1 && helpers.extensionCheck( image_url ) ){
              let file_name = helpers.getFilenameFromUrl( image_url ).split( '%2F' )[1];
              console.log( `- ${file_name}` );
              img_urls.push( image_url );
            }
          }
        }
        if ( img_urls && img_urls.length === 0 ){
          console.log( 'no images found...' );
        }
        cb( null, img_urls );
    } );
  },
  extensionCheck: function( url ) {
    let file_extension = path.extname( url ).toLowerCase(),
        extensions = ['.png', '.jpg', '.jpeg', '.gif'];
    return extensions.indexOf( file_extension ) !== -1;
  },
  getFilenameFromUrl: function( url ) {
    return url.substring( url.lastIndexOf( '/' ) + 1 );
  },
  loadImage: function( url, cb ) {
    console.log( 'loading remote image...' );
    request( {url: url, encoding: null}, function ( err, res, body ) {
        if ( !err && res.statusCode == 200 ) {
          let b64content = 'data:' + res.headers['content-type'] + ';base64,';
          console.log( 'image loaded...' );
          cb( null, body.toString( 'base64' ) );
        } else {
          console.log( 'ERROR:', err );
          cb( err );
        }
    } );
  },
  removeAsset: function( url, cb ){
    let helpers = this;
    console.log( 'removing asset...' );
    helpers.loadAssets( function( err, data ){
      let data_array = data.split( '\n' ),
          img_data;
      data_array.forEach( function( d ){
        if ( d.indexOf( url ) > -1 ){
            img_data = JSON.parse( d );
            console.log( img_data );
            return;
        }
      } );

      data += `{"uuid":"${img_data.uuid}","deleted":true}\n`;
      fs.writeFile( __dirname + '/.glitch-assets', data );
      exec.exec( 'refresh' );
    } );
  },
  downloadFile: function( uri, filename, cb ){
    request.head( uri, function( err, res, body ){
      request( uri ).pipe( fs.createWriteStream( filename ) ).on( 'close', cb );
    } );
  }
};
