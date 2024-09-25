const express = require('express');
const router = express.Router()
const request = require('request');

router.post('/downlad-url', (req, res) => {
    downloadURL(req.body.url, () =>{
        res.send('Done')
    }) 
});

const downloadURL = (url, onend) => {
    const opts = {
      uri: url,
      method: 'GET',
      followAllRedirects: true
    }
  
    request(opts)
      .on('data', ()=>{})
      .on('end', () => onend())
      .on('error', (err) => {
        console.log('Error occurred during URL download', 'controller.url.download.error');
        // If needed, log non-sensitive error details or a generic error message
        // console.log(`Error type: ${err.name}`, 'controller.url.download.error');
      })
}

module.exports = router