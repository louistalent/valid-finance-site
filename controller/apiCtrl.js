const TrendingOption = require("../models/trendingModel");
const Ads = require("../models/ads");
const axios = require('axios');
const path = require("path");
const multer = require("multer");

const Addtoken = async (req, res) => {
    let Option = new TrendingOption({
        ...req.body.tokenData
    });
    await Option.save();
    res.json('success');
}

const GetData = (req, res) => {
    console.log("wowoowow")
    TrendingOption.find()
        .then(result => {
            res.json(result);
        })
        .catch(err => {
            console.log(err)
        });
}

const Removetoken = (req, res) => {
    TrendingOption.deleteOne({ _id: req.body.id })
        .then(result => {
            if (result) {
                TrendingOption.find()
                    .then(result => {
                        res.json(result);
                    })
                    .catch(err => {
                        console.log(err)
                    });
            }
        })
        .catch(err => {
            res.json(err)
        })
}

const GetPrice = async (req, res) => {
    console.log('GetPrice called')
    let response = null;
    new Promise(async (resolve, reject) => {
        try {
            response = await axios.get('https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest?start=1&limit=5000&convert=USD', {
                headers: {
                    'X-CMC_PRO_API_KEY': 'd163c519-7b42-448b-8870-2cfce809247b',
                },
            });
        } catch (ex) {
            response = null;
            reject(ex);
        }
        if (response.data) {
            res.json(response.data)
        }
    });
}


const GetToken = async (req, res) => {
    // eth 
    // bsc
    // polygon
    // fantom
    // avalanche
    console.log("GetToken : ", req.body.value);

    const api = `https://api.dex.guru/v2/tokens/search/${req.body.value}?network=bsc,eth,polygon,fantom,avalanche`;
    await axios.get(api)
        .then(result => {
            res.send(result.data)
        })
        .catch((err) => {
            res.send(err)
        })
}

const GetOptionlist = async (req, res) => {
    await TrendingOption.find({ network: req.body.network })
        .then(result => {
            if (result) {
                res.send(result)
            }
        })
        .catch(err => {
            res.json(err)
        })
}

const getChartData = async (req, res) => {

    console.log('getChartData');
    const { address, network, from, to } = req.body;

    const api = `https://api.dex.guru/v1/tradingview/history?symbol=${address}-${network}_USD&resolution=60&from=${from}&to=${to}&countback=320`;
    // const api = `https://api.dex.guru/v1/tradingview/history?symbol=0x56083560594e314b5cdd1680ec6a493bb851bbd8-bsc_USD&resolution=10&from=1648990444&to=1649170444&countback=300`;
    console.log(api)

    // address: Network.address,
    //     network: Network.network,
    //     from: '1644872497',
    //     to: (new Date().getTime() / 1000).toFixed(0)
    // https://api.dex.guru/v1/tradingview/history?symbol=0x56083560594e314b5cdd1680ec6a493bb851bbd8-bsc_USD&resolution=60&from=1644872497&to=2644872497&countback=320

    await axios.get(api)
        .then(result => {
            res.send(result.data)
        })
        .catch((err) => {
            res.send(err)
        })
}

const getTradingHistory = async (req, res) => {
    try {
        console.log('getTradingHistory address: ', req.body.address);

        // const api = `https://io3.dexscreener.io/u/search/pairs?q=${req.body.address}`
        const api = `https://www.dextools.io/chain-bsc/api/Pancakeswap/1/pairexplorer?v=2.10.0&pair=0x62be1533f3a78de99ca297ebbe489a3fb7253bef&ts=1649259998-0&h=1`;

        const result = await axios.get(api);
        console.log('first res: ', result);
        res.send(result.data);

        // const History = `https://io12.dexscreener.io/u/trading-history/recent/${result.data.pairs[0].platformId}/${result.data.pairs[0].pairAddress}`;
        // const res_his = await axios.get(History,
        //     {
        //         headers: {
        //             'Cookie': '__cf_bm=OlJh0WPyhNrrCr5KM1v4VK9Z9AnnyHcAeuSo9DbKBAI-1649146654-0-AUr+Nr5pjyuEyLgp/MX4tzDeslcMRTbnYTjPSGVs+l0U8GTT1F7217Lpx3SDKcxWaJVokyfajJS+gZAwtpAGvLE=; path=/; expires=Tue, 05-Apr-22 08:47:34 GMT; domain=.dexscreener.io; HttpOnly; Secure; SameSite=None'
        //         },
        //     }
        // )
        // console.log('second res: ', res_his);
        // res.send(res_his.data);
    } catch (error) {
        console.log(error)
        res.send(error)
    }
}

const UploadAds = async (req, res) => {
    Ads.findOne({ network: req.body.network })
        .then(result => {
            if (result === null) {
                let Option = new Ads({ network: req.body.network, file1: req.images.file1, file2: req.images.file2, file3: req.images.file3 });
                Option.save()
                    .then(result => {
                        res.send({
                            flag: 'create',
                            file1: req.images.file1,
                            file2: req.images.file2,
                            file3: req.images.file3
                        })
                    })
            } else {
                console.log(req.images)
                Ads.updateOne({ network: req.body.network }, { file1: req.images.file1, file2: req.images.file2, file3: req.images.file3 })
                    .then(result => {
                        res.send({
                            flag: 'update',
                            file1: req.images.file1,
                            file2: req.images.file2,
                            file3: req.images.file3
                        })
                    })
            }
        })
        .catch(err => {
            console.log(err);
        })
}

const imageMulti = (req, res, next) => {
    let d = req.files
    let row = {}
    for (let i in d) {
        row[d[i].fieldname] = d[i].filename
    }
    req.images = row
    next()
}

const getAds = async (req, res) => {
    Ads.find({ network: req.body.network })
        .then(result => {
            if (result) {
                res.send(result)
            }
        })
        .catch(err => {
            res.json(err)
        })
}


//---------------------------------------

module.exports = {
    Addtoken,
    GetData,
    Removetoken,
    GetPrice,
    GetToken,
    GetOptionlist,
    getChartData,
    getTradingHistory,
    UploadAds,
    imageMulti,
    getAds
};