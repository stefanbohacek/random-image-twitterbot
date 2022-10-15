const fs = require('fs'),
path = require('path'),
request = require('request'),
exec  = require('child_process');

module.exports = {
    randomFromArray: (arr) => {
        return arr[Math.floor(Math.random() * arr.length)]; 
    },
    getRandomInt: (min, max) => {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },
    getRandomRange: (min, max, fixed) => {
        return (Math.random() * (max - min) + min).toFixed(fixed) * 1;
    },
    getRandomHex: () => {
        return '#' + Math.random().toString(16).slice(2, 8).toUpperCase();
    },
    shadeColor: (color, percent) => {
        // https://stackoverflow.com/questions/5560248/programmatically-lighten-or-darken-a-hex-color-or-rgb-and-blend-colors
        let f = parseInt(color.slice(1),16),t=percent<0?0:255,p=percent<0?percent*-1:percent,R=f>>16,G=f>>8&0x00FF,B=f&0x0000FF;
        return `#${(0x1000000+(Math.round((t-R)*p)+R)*0x10000+(Math.round((t-G)*p)+G)*0x100+(Math.round((t-B)*p)+B)).toString(16).slice(1)}`;
    },  
    loadAssets: (cb) => {
        console.log('reading assets folder...')
        let that = this;
        fs.readFile('./.glitch-assets', 'utf8',  (err, data) => {
            if (err) {
                console.log('error:', err);
                cb(err);
                return false;
            }
            cb(null, data);
        });      
    },
    loadImageAssets: (cb) => {
        let helpers = this;
        
        helpers.loadAssets((err, data) => {
            /* Filter images in the assets folder */
            data = data.split('\n');
            
            const dataJSON = JSON.parse('[' + data.join(',').slice(0, -1) + ']');
            
            const deletedImages = dataJSON.reduce((filtered, dataImage) => {
                if (dataImage.deleted) {
                    let someNewValue = { name: dataImage.name, newProperty: 'Foo' }
                    filtered.push(dataImage.uuid);
                }
                return filtered;
            }, []),
            imageUrls = [];
            
            for (let i = 0, j = data.length; i < j; i++){
                if (data[i].length){
                    const imageData = JSON.parse(data[i]),
                    imageUrl = imageData.url;
                    
                    if (imageUrl && deletedImages.indexOf(imageData.uuid) === -1 && helpers.extensionCheck(imageUrl)){
                        const fileName = helpers.getFilenameFromUrl(imageUrl).split('%2F')[1];
                        console.log(`- ${fileName}`);
                        imageUrls.push(imageUrl);
                    }
                }
            }
            if (imageUrls && imageUrls.length === 0){
                console.log('no images found...');
            }
            cb(null, imageUrls);
        });
    },
    extensionCheck: (url) => {
        let fileExtension = path.extname(url).toLowerCase(),
        extensions = ['.png', '.jpg', '.jpeg', '.gif'];
        return extensions.indexOf(fileExtension) !== -1;
    },
    getFilenameFromUrl: (url) => {
        return url.substring(url.lastIndexOf('/') + 1);
    },
    loadImage: (url, cb) => {
        console.log('loading remote image...');
        request({url: url, encoding: null},  (err, res, body) => {
            if (!err && res.statusCode == 200) {
                let b64content = 'data:' + res.headers['content-type'] + ';base64,';
                console.log('image loaded...');
                cb(null, body.toString('base64'));
            } else {
                console.log('ERROR:', err);
                cb(err);
            }
        });
    },
    removeAsset: (url, cb) => {
        console.log('removing asset', url)
        let helpers = this;
        console.log('removing asset...');
        helpers.loadAssets((err, data) => {
            let dataArray = data.split('\n'),
            imageData;
            dataArray.forEach((d) => {
                if (d.indexOf(url) > -1){
                    imageData = JSON.parse(d);
                    console.log(imageData);
                    return;
                }
            });
            
            data += `{"uuid":"${imageData.uuid}","deleted":true}\n`;
            console.log(data)
            fs.writeFile( './.glitch-assets', data);
            exec.exec('refresh');
        });
    },
    downloadFile: (uri, filename, cb) => {
        request.head(uri, (err, res, body) => {
            request(uri).pipe(fs.createWriteStream(filename)).on('close', cb);
        });
    }
};
