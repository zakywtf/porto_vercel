const apiResponse = require("../helpers/apiResponse");
const mailer = require("../helpers/nodeMailer");
const { serviceLandCharacteristic } = require("../helpers/masterFunction")

const IndexController = {
    index: async (req, res) => {
        // res.render('login/login');
        var ip = req.header('x-forwarded-for') || req.connection.remoteAddress;
        // var ip = '36.73.53.127';
        // var loc = await getGeoLocation(ip, req.useragent)
        
        res.render('public/index', { datas: {  }});
    },

    ping: (req, res) => {
        return apiResponse.successResponse(res, 'Pong');
    },

    contactUs: async (req, res, next) => {
        const mailOptions = {
            from: req.body.name + ' <' + req.body.email + '>',
            to: 'contact@idepreneursclub.org',
            subject: "Enquiry from " + req.body.name,
            text: req.body.message,
            html: `
                <p>Name: ${req.body.name}</p>
                <p>Email: ${req.body.email}</p>
                <p>${req.body.message}</p>
            `
        }

        try {
            let contact = new ContactUs(req.body);

            contact.save((err) => {
                if(err) return next(err);
            });

            await mailer.sendMail(mailOptions);

            return apiResponse.successResponse(res, 'Thank You. Our representative will contact you shortly.');
        } catch (error) {
            return next(error);
        }
    },

    reduceLimits: async (req, res) => {
        return apiResponse.successResponse(res, 'Key: '+req.query.key);
    },

    serviceLandCharacteristic: async (req, res) => {
        const data = await serviceLandCharacteristic(req.query.village_id)
        return apiResponse.successResponseWithData(res, 'Data retrieved', data);
    },
    
}

module.exports = IndexController;