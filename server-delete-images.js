const fs = require('fs'),
path = require('path'),
Twit = require('twit'),
config = require(path.join(__dirname, 'config.js'));

const T = new Twit(config.twitter);

const randomFromArray => (images){
    return images[Math.floor(Math.random() * images.length)];
}

const uploadRandomImage => (images){
    console.log('Reading image directory...');
    fs.readdir(__dirname + '/images', (err, files) => {
        if (err){
            console.log(err);
        } else {
            const images = [];
            files.forEach((f) => {
                images.push(f);
            });
            
            if (!images.length){
                console.log('No images, exiting!');
                return false;
            }
            
            console.log('Opening an image...');
            const imagePath = path.join(__dirname, '/images/' + randomFromArray(images)),
            b64content = fs.readFileSync(imagePath, {encoding: 'base64'});
            
            console.log('Uploading an image...');
            
            T.post('media/upload', {media_data: b64content},  (err, data, response) => {
                if (err){
                    console.log('ERROR:', err);
                } else {
                    console.log('Image uploaded!');
                    console.log('Now tweeting it...');
                    
                    T.post('statuses/update', {
                        /* You can include text with your image as well. */            
                        // status: 'New picture!', 
                        /* Or you can pick random text from an array. */            
                        status: randomFromArray([
                            'New picture!',
                            'Check this out!',
                            'How cute!'
                        ]), 
                        media_ids: new Array(data.media_id_string)
                    },
                    (err, data, response) => {
                        if (err){
                            console.log('ERROR:', err);
                        } else {
                            console.log('Posted an image! Now deleting...');
                            fs.unlink(imagePath, (err)=> {
                                if (err){
                                    console.log('ERROR: unable to delete image ' + imagePath);
                                    console.log(err);
                                } else {
                                    console.log('image ' + imagePath + ' was deleted');
                                }
                            });
                        }
                    });
                }
            });
        }
    });
}

/*
You have two options here. Either you will keep your bot running, and upload images using setInterval (see below; 10000 means '10 milliseconds', or 10 seconds), --
*/
setInterval(()=> {
    uploadRandomImage(images);
}, 10000);

/*
Or you could use cron (code.tutsplus.com/tutorials/scheduling-tasks-with-cron-jobs--net-8800), in which case you just need:
*/

// uploadRandomImage(images);
