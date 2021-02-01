const ecpay_logistics = require('ecpay-logistics');

Date.prototype.Format = function (fmt) {
    var o = {
        "M+": this.getMonth() + 1, //月份 
        "d+": this.getDate(), //日 
        "h+": this.getHours(), //小时 
        "m+": this.getMinutes(), //分 
        "s+": this.getSeconds(), //秒 
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
        "S": this.getMilliseconds() //毫秒 
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}

module.exports.updateStoreInfo = async (req, res) => {
    let base_param = {
        AllPayLogisticsID:"", // 請帶20碼uid, ex: 84851681561813188188, 為Create時所得到的物流交易編號
        CVSPaymentNo:"", // 請帶15碼uid, ex: 848516815618131, 為Create時所得到的寄貨編號
        CVSValidationNo:"", // 請帶10碼uid, ex: 8485168156, 為Create時所得到的驗證碼
        StoreType:"01",
        ReceiverStoreID:"",
        ReturnStoreID:"",
        PlatformID:""
    };
    
    let create = new ecpay_logistics();
    let ecpayRes = create.c2c_process_client.updatestoreinfo(parameters = base_param);
    if (typeof ecpayRes === 'string') {
        console.log('updateStoreInfo string', ecpayRes);
    } else {
        ecpayRes.then(function (result) {
            console.log('updateStoreInfo result', result);
        }).catch(function (err) {
            console.log('updateStoreInfo error', err);
        });
    }
}

module.exports.updateShipInfo = async (req, res) => {
    let base_param = {
        AllPayLogisticsID:"", // 請帶20碼uid, ex: 84851681561813188188, 為Create時所得到的物流交易編號
        ShipmentDate:"",
        ReceiverStoreID:"153319",
        PlatformID:""
    };
    
    let create = new ecpay_logistics();
    let ecpayRes = create.query_client.updateshipmentinfo(parameters = base_param);
    if (typeof ecpayRes === 'string') {
        console.log('updateShipInfo string', ecpayRes);
    } else {
        ecpayRes.then(function (result) {
            console.log('updateShipInfo result', result);
        }).catch(function (err) {
            console.log('updateShipInfo error', err);
        });
    }
}

module.exports.testData = async (req, res) => {
    let base_param = {
        LogisticsSubType: "FAMI",
        ClientReplyURL: "",
        PlatformID: ""
    };

    let create = new ecpay_logistics();
    let ecpayRes = create.query_client.createtestdata(parameters = base_param);
    if (typeof ecpayRes === 'string') {
        console.log('testData string', ecpayRes);
        res.send(ecpayRes)
    } else {
        ecpayRes.then(function (result) {
            console.log('testData result', result);
        }).catch(function (err) {
            console.log('testData error', err);
        });
    }
}

module.exports.print = async (req, res) => {
    let base_param = {
        AllPayLogisticsID: req.body.id, // 請帶20碼uid, ex: 84851681561813188188, 為Create時所得到的物流交易編號
        PlatformID: "",
    };

    let create = new ecpay_logistics();
    let ecpayRes = create.query_client.printtradedocument(parameters = base_param);
    if (typeof ecpayRes === 'string') {
        console.log('print string', ecpayRes);
        res.send(ecpayRes)
    } else {
        ecpayRes.then(function (result) {
            console.log('print result', result);
        }).catch(function (err) {
            console.log('print error', err);
        });
    }
}

module.exports.query = async (req, res) => {
    var id = req.body.id
    console.log('req.boyd', req.body)
    let base_param = {
        AllPayLogisticsID: id, // 請帶20碼uid, ex: 84851681561813188188, 為Create時所得到的物流交易編號
        PlatformID: ""
    };

    let create = new ecpay_logistics();
    let ecpayRes = create.query_client.querylogisticstradeinfo(parameters = base_param);
    if (typeof ecpayRes === 'string') {

        console.log('query string', ecpayRes);
    } else {
        ecpayRes.then(function (result) {
            console.log('query result', result);
        }).catch(function (err) {
            console.log('query error', err);
        });
    }
}

module.exports.map = async (req, res) => {
    console.log('ecpay map start')
    // 參數值為[PLEASE MODIFY]者，請在每次測試時給予獨特值
    let base_param = {
        MerchantTradeNo: "", // 請帶20碼uid, ex: f0a0d7e9fae1bb72bc93
        ServerReplyURL: `${req.headers.referer}`, // 物流狀況會通知到此URL
        LogisticsType: "CVS",
        LogisticsSubType: "UNIMART",
        IsCollection: "N",
        ExtraData: "",
        Device: ""
    };

    let create = new ecpay_logistics();
    let ecpayRes = create.query_client.expressmap(parameters = base_param);

    if (typeof ecpayRes === 'string') {
        console.log('map === string', ecpayRes);
        res.send(ecpayRes)
    } else {
        ecpayRes.then(function (result) {
            console.log('map result', result);
        }).catch(function (err) {
            console.log('error', err);
        });
    }
}
module.exports.create = async (req, res) => {
    console.log('ecpay create start')

    var d = new Date().Format("yyyy/MM/dd hh:mm:ss");
    console.log('date', d)

    let base_param = {
        MerchantTradeNo: "", // 請帶20碼uid, ex: f0a0d7e9fae1bb72bc93, 為aiocheckout時所產生的
        MerchantTradeDate: d, // 請帶交易時間, ex: 2017/05/17 16:23:45, 為aiocheckout時所產生的
        LogisticsType: "CVS",
        LogisticsSubType: "UNIMART",//UNIMART、FAMI、HILIFE、UNIMARTC2C、FAMIC2C、HILIFEC2C
        GoodsAmount: "200", // 1~19,999
        CollectionAmount: "200", // 此為超商代收金額, 必須與goodsAmount一致
        IsCollection: "",
        GoodsName: "ecpayTest",
        SenderName: "CK,H",
        SenderPhone: "",
        SenderCellPhone: "0912345678",
        ReceiverName: "綠界科技g",
        ReceiverPhone: "0229768888",
        ReceiverCellPhone: "0912345678",
        ReceiverEmail: "tesy@gmail.com",
        TradeDesc: "",
        ServerReplyURL: `${req.protocol}://${req.get('host')}/ecpayInfo`, // 物流狀況會通知到此URL
        ClientReplyURL: "",
        LogisticsC2CReplyURL: `${req.protocol}://${req.get('host')}/ecpayInfo`,
        Remark: "",
        PlatformID: "",
        ReceiverStoreID: "991182", // 請帶收件人門市代號(統一):991182  測試商店代號(全家):001779 測試商店代號(萊爾富):2001、F227
        ReturnStoreID: ""
    };


    let create = new ecpay_logistics();
    let ecpayRes = create.create_client.create(parameters = base_param);
    if (typeof ecpayRes === 'string') {
        console.log('ecpayRes === string', ecpayRes);
    } else {
        ecpayRes.then(function (result) {
            console.log('result', result);
        }).catch(function (err) {
            console.log('error', err);
        });
    }

}
