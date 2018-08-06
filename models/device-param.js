'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const options = { timestamps: true };


const requiredFieldMessage = (filed) => {
    let message = `${filed} Should Not Be Empty`;
    return [true, message]
 }


const SMT400Schema = new Schema({
    mac: {type: String, required: requiredFieldMessage('Mac')},   
    MsgID: {type: String, default: ''},
    pair_key: {type: String, default: ''},
    dev_type: {type: String, default: ''},
    dis_dev_name: {type: String, default: ''},
    dev_ver: {type: String, default: ''},
    eheat_mode: {type: String, default: ''},
    perimt_mode: {type: String, default: ''},
    equip_mode: {type: String, default: ''},
    equip_status: {type: String, default: ''},
    fan_type: {type: String, default:''},
    fan_speed: {type: String, default: ''},
    temp_unit: {type: String, default: ''},
    temp_max: {type: String, default: ''},
    temp_min: {type: String, default: ''},
    temp_gap: {type: String, default:''},
    temp_cool: {type: String, default: ''},
    temp_heat: {type: String, default: ''},
    dis_humi: {type: String, default: ''},
    dis_temp: {type: String, default: ''},
    dis_outside: {type: String, default: ''},
    occupied: {type: String, default:''},
    buttonshow: {type: String, default: ''},
    fan_active: {type: String, default: ''},
    relay_active: {type: String, default: ''},
    relay_status: {type: String, default: ''},
    wifi_lost: {type: String, default:''},
    }, options);






module.exports = mongoose.model('SMT400', SMT400Schema);