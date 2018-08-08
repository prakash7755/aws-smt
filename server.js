'use strict';
const express = require('express');
const app = express();
const cors = require('cors');
const bodyParsere = require('body-parser');
const port = process.env.PORT || 3033;
const { db, Smt400table, DeviceParam } = require('./models');
const uuid = require('uuid-pure').newId;
const _ = require('underscore')
app.use(cors());
app.use(bodyParsere.urlencoded({ extended: true }));
app.use(bodyParsere.json());


// mob or web or device Insert Value

app.post('/SMT-400', async(req, res) => {
    const { mac, equip_mode, fan_speed, temp_cool, temp_heat, occupied, relay_status, wifi_lost } = req.body;
    try {

        if (req.body.mac.length !== 12) {
            return res.send('MacId Must Be 12 Characters');
        }
        const findValue = await DeviceParam.find({ mac });
        const findLastValue = findValue.reverse()[0];

        if (equip_mode === findLastValue.equip_mode && fan_speed === findLastValue.fan_speed &&
            temp_cool === findLastValue.temp_cool && temp_heat === findLastValue.temp_heat &&
            occupied === findLastValue.occupied && relay_status === findLastValue.relay_status &&
            wifi_lost === findLastValue.wifi_lost) {
            const deviceParam = new DeviceParam(req.body);
            const result = await deviceParam.save();
            if (!result) {
                return res.json({ message: "Not Connected to database" });
            }
            return res.json({ result: "ok" });
        }
        const MsgID = uuid(15);
        req.MsgID = MsgID;
        const deviceParam = new DeviceParam(req.body);
        const result = await deviceParam.save();
        if (!result) {
            return res.json({ message: "Not Connected to database" });
        }
        var arrayValue = ['mac', 'equip_mode', 'fan_speed', 'temp_cool', 'temp_heat', 'occupied', 'relay_status', 'wifi_lost'];
        const newArray = [ ['MsgID', MsgID]  ]
        arrayValue.map((data) => {
            if (! (findLastValue[data] == result[data])) {
                return newArray.push([ data, result[data] ])
            }
        });
         const finalResult = _.object(newArray)
        return res.json(finalResult);
    } catch (error) {
        res.json(error);
    }
});

// Update Value

// app.put('/SMT-400', async(req, res) => {
//     const MsgID = uuid(15)
//     const { mac, equip_mode, fan_speed, temp_cool, temp_heat, occupied, relay_status, wifi_lost } = req.body;
//     const data = { MsgID, mac, equip_mode, fan_speed, temp_cool, temp_heat, occupied, relay_status, wifi_lost };
//     try {
//         if (mac.length !== 12) {
//             console.log('Hi', mac)
//             return res.send('MacId Must Be 12 Characters');
//         }
//         const result1 = await DeviceParam.find({ mac });
//         const data = result1.reverse()[0];
//         const result = await DeviceParam.findOneAndUpdate({ mac, _id: data._id }, { $set: data }, { new: true });
//         if (!result) {
//             return res.json({ message: "Not Connected to database" });
//         }
//         res.json({ data });
//     } catch (error) {
//         res.json(error);
//     }
// });



// mob or web or device get Value

// app.get('/SMT-400/:id', async(req, res) => {
//     try {
//         const id = req.params.id;
//         const result = await DeviceParam.find({ mac: id });
//         const data = result.reverse()[0];
//         if (data.MsgID === "") {
//             return res.json(data);
//         }
//         const { MsgID, equip_mode, fan_speed, temp_cool, temp_heat, occupied, relay_status, wifi_lost } = data;
//         const resultData = { MsgID, equip_mode, fan_speed, temp_cool, temp_heat, occupied, relay_status, wifi_lost };
//         res.json(resultData);
//     } catch (error) {
//         res.json(error);
//     }
// });


app.listen(port, () => {
    console.log(`App Listen Port @ ${ port }`);
})