const express = require('express'),
      helpers = require(__dirname + '/helpers/helpers.js'),
      CronJob = require('cron').CronJob,
      cronSchedules = require(__dirname + '/helpers/cron-schedules.js'),    
      twitter = require(__dirname + '/helpers/twitter.js'),
      fs = require('fs'),
      path = require('path'),
      request = require('request'),
      app = express();

app.use(express.static('public'));

const listener = app.listen(process.env.PORT, () => {
    console.log(`Your app is listening on port ${listener.address().port}`);
    
    /*
    Check out https://www.npmjs.com/package/cron#available-cron-patterns to learn more about cron scheduling patterns.
    You can also use the helper cron-schedules.js module that has some common cron schedules.
    */
    
    const job = new CronJob(cronSchedules.EVERY_FOUR_HOURS, () => {
        helpers.loadImageAssets((err, urls) => {
            /* First, load images from the assets folder. */
            if (!err && urls && urls.length > 0){
                
                /* Pick a random image. */
                
                const url = helpers.randomFromArray(urls);
                
                /* You could also get the first image alphabetically. */
                //  let url = urls.sort()[0];
                
                /* If you want to delete the image after it's posted, update your .env file: */
                //  REMOVE_POSTED_IMAGES='yes'
                
                helpers.loadImage(url, (err, img_data) => {
                    twitter.postImage(helpers.randomFromArray([
                        'Check this out!',
                        'New picture!'
                    ]), img_data, (err) => {
                        if (!err){
                            const removePostedImages = process.env.REMOVE_POSTED_IMAGES;
                            if (removePostedImages === 'yes' || removePostedImages === 'true'){
                                helpers.removeAsset(url);
                            }
                        }        
                    });
                });
            }
        });
    });
    job.start();  
});