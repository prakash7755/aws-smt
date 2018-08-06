'use strict';
const express = require('express');
const app = express();
const cors = require('cors');
const bodyParsere = require('body-parser');
const port = process.env.PORT || 3030;
const { db, Smt400table, DeviceParam } = require('./models');
const uuid = require('uuid-pure').newId;
app.use(cors());
app.use(bodyParsere.urlencoded({ extended: true }));
app.use(bodyParsere.json());


// mob or web or device Insert Value

app.post('/SMT-400', async(req, res) => {
    try {
        if (req.body.mac.length !== 12) {
            return res.send('MacId Must Be 12 Characters');
        }
        const deviceParam = new DeviceParam(req.body);
        const result = await deviceParam.save();
        if (!result) {
            return res.json({ message: "Not Connected to database" });
        }
        res.json({ result: "ok" });
    } catch (error) {
        res.json(error);
    }
});

// Update Value

app.put('/SMT-400', async(req, res) => {
    const MsgID = uuid(15)
    const { mac, equip_mode, fan_speed, temp_cool, temp_heat, occupied, relay_status, wifi_lost } = req.body;
    try {
        if (mac.length !== 12) {
            console.log('Hi', mac)
            return res.send('MacId Must Be 12 Characters');
        }
        const result1 = await DeviceParam.find({ mac });
        const data = result1.reverse()[0];
        const result = await DeviceParam.findOneAndUpdate({ mac, _id: data._id }, { $set: { MsgID, mac, equip_mode, fan_speed, temp_cool, temp_heat, occupied, relay_status, wifi_lost } }, { new: true });
        if (!result) {
            return res.json({ message: "Not Connected to database" });
        }
        res.json({ result });
    } catch (error) {
        res.json(error);
    }
});

// mob or web or device get Value

app.get('/SMT-400/:id', async(req, res) => {
    try {
        const id = req.params.id;
        const result = await DeviceParam.find({ mac: id });
        if (!result) {
            return res.json({ message: "Not Connected to database" });
        }
        res.json(result.reverse()[0]);
    } catch (error) {
        res.json(error);
    }
});


app.listen(port, () => {
    console.log(`App Listen Port @ ${ port }`);
})