const fs = require('fs')
const https = require('https');

async function laodImages(count)
{
    var response = await fetch(`https://api.unsplash.com/photos/random/?query=landscape&count=${count}&client_id=FhoYRHwY2LaJ4Xt24CtoQlzTkviimX_a7IJgG7CjouM`);
    const images = await response.json();
    images.forEach(imageFile => {
        const filename = 'TripTales.Webapi/DevImages/' + imageFile.alt_description + '.jpg';
        var image = imageFile.urls.raw;
        console.log(image);
        const file = fs.createWriteStream(filename);
        https.get(image, response => {
            response.pipe(file);

            file.on('finish', () => {
                file.close();
                console.log('Finished downloading')
            });
        }).on('error', err => {
            fs.unlink(filename);
            console.error(`Error downloading image: ${err.message}`);
        });
    });
}

//  API allows only 30 Images per Request, so I have to call it again to get more.
laodImages(30)
laodImages(10)