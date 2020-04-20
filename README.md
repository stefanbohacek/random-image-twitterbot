![Tweetin'](https://botwiki.org/wp-content/uploads/2018/02/love-trumps-hate.png)

# random-image-twitterbot

For a version that uses an automatic scheduler, check out the [random-image-twitterbot-cron](https://glitch.com/edit/#!/random-image-twitterbot-cron) project. (Note that this requires a [paid Glitch subscription](https://glitch.com/pricing)).


1. Update `.env` with your Twitter api keys ([see how to get them](https://botwiki.org/tutorials/how-to-create-a-twitter-app/)). Also update the `BOT_ENDPOINT`, this will be needed to activate your bot and can just be random letters.
2. Put all your images into the `assets` folder.
3. If you want to delete the image after posting, set `REMOVE_POSTED_IMAGES='true'` inside `.env`. (Otherwise leave empty.)
4. Set up a free service ([Uptime Robot](https://uptimerobot.com/), [cron-job.org](https://cron-job.org/en/), or [others](https://www.google.com/search?q=free+web+cron)) to wake up your bot every 25+ minutes and tweet. Use `https://YOURPROJECTNAME.glitch.me/BOT_ENDPOINT` as a URL to which to send the HTTP request.


Also, check out [this tutorial](https://botwiki.org/tutorials/random-image-tweet/) and [this guide](https://botwiki.org/tutorials/importing-github-glitch/) where I attempt to adapt the original code for this bot so that it runs on Glitch. 

# Support Botwiki/Botmakers

- [patreon.com/botwiki](https://patreon.com/botwiki)
- [botwiki.org/about/support](https://botwiki.org/about/support)

🙇