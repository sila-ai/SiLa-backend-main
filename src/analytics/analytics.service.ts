import { Injectable } from '@nestjs/common';
import { IP2Location } from 'ip2location-nodejs';

const { v4: uuidv4 } = require('uuid');
import * as path from 'path';

const DeviceDetector = require('node-device-detector');
const helpers = require('../../helpers/functions');

import * as dotenv from 'dotenv';
dotenv.config();

@Injectable()
export class AnalyticsService {
  // from frontend take user, device ,  js

  getAnalyticScript(req) {
    const user: any = req.user.userId;
    if (user) {
      const bufferString = Buffer.from(user.toString())
        .toString('base64')
        .split('=')[0];
      const script = `<script src="${process.env.FRONTEND_URL}/analytics/analytics.js?id=${bufferString}"></script>`;
      return { success: true, script: script };
    }
    return { success: false };
  }

  getAnalyticsData(req) {
    const userId = req.user.userId;
    if (userId) {
      return helpers
        .query({
          TableName: 'analytics',
          IndexName: 'user_index',
          KeyConditionExpression: 'userId=:userId',
          ExpressionAttributeValues: {
            ':userId': userId,
          },
          ScanIndexForward: false,
        })
        .then((data) => {
          return { success: true, data: data };
        })
        .catch((err) => {
          console.log(err);
          return { success: false };
        });
    } else {
      return { success: false };
    }
  }
  postAnalyticsData(req) {
    const userId: any = req.query.id ? parseInt(req.query.id) : 0;
    if (userId) {
      const url = req.query.url;
      const detector = new DeviceDetector();
      const userAgent = req.query.device;
      const result = detector.detect(userAgent);
      const os = result.os.name + ' ' + result.os.version;
      const browser = result.client.name;
      const time = req.query.time; // it is a second
      const string = Buffer.from(userId, 'base64').toString();
      let ip = req.headers['x-forwarded-for'];
      if (ip) {
        ip = ip.split(',')[0];
      } else {
        ip = '37.111.192.241';
      }
      let ip2location = new IP2Location();
      ip2location.open(path.join(__dirname, '../../', 'ip/IPV6-COUNTRY.BIN'));
      const userLocation = ip2location.getAll(ip);
      const country = userLocation.countryLong;
      const countryShort = userLocation.countryShort;

      ip2location.close();

      const date = new Date();
      const todayIs =
        date.getDate() + '-' + (date.getMonth() + 1) + '-' + date.getFullYear();

      return helpers
        .create({
          TableName: 'analytics',
          Item: {
            id: uuidv4(),
            url: url,
            os: os,
            browser: browser,
            timespent: time,
            userId: string,
            ip: ip,
            country: country,
            countryShort: countryShort,
            today: todayIs,
          },
        })
        .then((data) => {
          return { success: true };
        })
        .catch((err) => {
          console.log(err);
          return { success: false };
        });
    }
    return { success: false };
  }
}
