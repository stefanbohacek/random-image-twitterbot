const express = require( 'express' ),
      helpers = require( __dirname + '/helpers/helpers.js' ),
      twitter = require( __dirname + '/helpers/twitter.js' ),
      fs = require( 'fs' ),
      path = require( 'path' ),
      request = require( 'request' ),
      app = express();


app.use( express.static( 'public' ) );

/* You can use cron-job.org, uptimerobot.com, or a similar site to hit your /BOT_ENDPOINT to wake up your app and make your Twitter bot tweet. */

app.all( `/${process.env.BOT_ENDPOINT}`, function ( req, res ) {
  console.log( "received a request..." );

  helpers.loadImageAssets( function( err, urls ){
    /* First, load images from the assets folder. */
    if ( !err && urls && urls.length > 0 ){

      /* Pick a random image. */
      
      let url = helpers.randomFromArray( urls );

      /* You could also get the first image alphabetically. */
      //  let url = urls.sort()[0];

      /* If you want to delete the image after it's posted, update your .env file: */
      //  REMOVE_POSTED_IMAGES='yes'

      helpers.loadImage( url, function( err, img_data ){
        twitter.postImage( helpers.randomFromArray( [
          'Check this out!',
          'New picture!'
        ] ), img_data, function( err ){
          if ( !err ){
            let remove_posted_images = process.env.REMOVE_POSTED_IMAGES;
            if ( remove_posted_images === 'yes' || remove_posted_images === 'true' ){
              helpers.removeAsset( url );
            }
          }        
        } );
      } );
    }
  } );
  res.sendStatus( 200 );
} );

let listener = app.listen( process.env.PORT, function () {
  console.log( `Your app is listening on port ${listener.address().port}` );
} );
