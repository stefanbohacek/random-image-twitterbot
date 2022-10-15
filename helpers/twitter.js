const helpers = require(__dirname + '/helpers.js'),
      config = {
        /* Be sure to update the .env file with your API keys. See how to get them: https://botwiki.org/tutorials/how-to-create-a-twitter-app */      
        twitter: {
            consumer_key: process.env.TWITTER_CONSUMER_KEY,
            consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
            access_token: process.env.TWITTER_ACCESS_TOKEN,
            access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
        }
      },
      Twit = require('twit'),
      T = new Twit(config.twitter);

module.exports = {
    postImage: (text, image_base64, cb) => {
        T.post('media/upload', {media_data: image_base64}, (err, data, response) => {
            if (err){
                console.log('ERROR:\n', err);
                if (cb){
                    cb(err);
                }
            }
            else{
                console.log('tweeting the image...');
                T.post('statuses/update', {
                    status: text,
                    media_ids: new Array(data.media_id_string)
                },
                (err, data, response) => {
                    if (err){
                        console.log('error:', err);
                    } else {
                        console.log('tweeted', `https://twitter.com/${ data.user.screen_name }/status/${ data.id_str }`);            
                    }
                    if (cb){
                        cb(err, data);
                    }
                });
            }
        });
    }
};
