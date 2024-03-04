import { Injectable } from '@nestjs/common';
const { v4: uuidv4 } = require('uuid');
const helpers = require('../../helpers/functions');
import { GoogleAdsApi } from 'google-ads-api';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class UrlService {
  async getUrlList(req) {
    const user = req.user.userId;
    // const url =
    //   process.env.TRACKING_URL +
    //   '/traffic/' +
    //   user +
    //   '?url={lpurl}&campaignid={campaignid}&keyword={keyword}';

    const url =
      '<script src="' +
      process.env.TRACKING_URL +
      '/analytics/analytics.js"></script>';

    return { url: url, success: true, user: user };
  }

  async postUrl(req) {
    // const user = req.user.userId;
    // const redirect = req.body.redirect;
    // try {
    //   const data = await this.getUrlList(req);
    //   const urlNumber = data.url.Items.length + 1;
    //   const uniqueId = parseInt(urlNumber) * user;
    //   const url =
    //     process.env.TRACKING_URL +
    //     '/traffic/' +
    //     user +
    //     '/' +
    //     uniqueId +
    //     '?url={lpurl}&campaignid={campaignid}&keyword={keyword}';
    //   if (data.Items) {
    //     return { success: false };
    //   } else {
    //     const createUrl = await helpers.create({
    //       TableName: 'url',
    //       Item: {
    //         id: uniqueId.toString(),
    //         url: url,
    //         redirect: redirect,
    //         userId: user,
    //       },
    //     });
    //   }
    //   return { success: true, url: url };
    // } catch (err) {
    //   console.log(err);
    //   return { success: false };
    // }
  }

  getUrl(req) {
    const user = req.user.userId;
    return (
      process.env.TRACKING_URL +
      '/traffic/' +
      user +
      '?url={lpurl}&campaignid={campaignid}&keyword={keyword}'
    );
  }

  async updateUrl(req) {
    // const id = req.body.id;
    // const redirect = req.body.redirect;
    // req.query.edit = id;
    // const getUrl = await this.getUrl(req);
    // const user = req.user.userId;
    // if (getUrl.success && getUrl.url.Item.userId === user && redirect && id) {
    //   const params = {
    //     TableName: 'url',
    //     Key: {
    //       id: id,
    //     },
    //     UpdateExpression: 'set redirect=:redirect',
    //     ExpressionAttributeValues: {
    //       ':redirect': redirect,
    //     },
    //     ReturnValues: 'UPDATED_NEW',
    //   };
    //   return helpers
    //     .update(params)
    //     .then((up) => {
    //       return { success: true };
    //     })
    //     .catch((err) => {
    //       console.log(err);
    //       return { success: false };
    //     });
    // }
    // return { success: false };
  }
  async deleteUrl(req) {
    // const id = req.body.id;
    // req.query.edit = id;
    // const getUrl = await this.getUrl(req);
    // const user = req.user.userId;
    // if (getUrl.success && getUrl.url.Item.userId === user && id) {
    //   const params = {
    //     TableName: 'url',
    //     Key: {
    //       id: id.toString(),
    //     },
    //   };
    //   return helpers
    //     .deleteById(params)
    //     .then((up) => {
    //       console.log(id.toString());
    //       return { success: true };
    //     })
    //     .catch((err) => {
    //       return { success: false };
    //     });
    // }
    // return { success: false };
  }
  client = new GoogleAdsApi({
    client_id: process.env.ADWORD_CLIENT,
    client_secret: process.env.ADWORD_SECRET,
    developer_token: process.env.ADWORD_DEVELOPER,
  });

  // Below these for URL rule creating

  getRule(req) {
    const user = req.user.userId;
    return helpers
      .query({
        TableName: 'rule',
        IndexName: 'user_index',
        KeyConditionExpression: 'userId=:userId',
        ExpressionAttributeValues: {
          ':userId': user,
        },
      })
      .then((url) => {
        return { success: true, url: url };
      })
      .catch((up) => {
        return { success: false };
      });
  }

  async posturlRule(req) {
    const id = req.user.userId;
    const minutes = parseInt(req.body.minutes);
    const minClick = parseInt(req.body.minClick);
    const hours = parseInt(req.body.hours) * 60;
    const hourclick = parseInt(req.body.hourclick);
    const day = parseInt(req.body.day) * 60 * 24;
    const dayClick = parseInt(req.body.dayclick);
    const month = parseInt(req.body.months) * 60 * 24 * 30;
    const monthclick = parseInt(req.body.monthclick);
    console.log('month');
    console.log(month);
    const proxy = req.body.proxy;
    const js = req.body.js;
    const vpn = req.body.vpn;
    const ip = req.body.ip;
    const os = req.body.os;
    const channel = req.body.channel;
    const browser = req.body.browser;
    const device = req.body.device;
    const country = req.body.country ? req.body.country : [];
    const city = req.body.city ? req.body.city : [];
    const isp = req.body.isp;
    const type = req.body.type;
    const account = req.body.account;
    const refreshToken = req.body.token;
    const campaignId = req.body.campaignId;
    const clicktime = {
      minutes: {
        click: minClick ? minClick : 0,
        time: minutes ? minutes : 0,
      },
      hour: {
        click: hourclick ? hourclick : 0,
        time: hours ? hours : 0,
      },
      day: {
        click: dayClick ? dayClick : 0,
        time: day ? day : 0,
      },
      month: {
        click: monthclick ? monthclick : 0,
        time: month ? month : 0,
      },
    };

    if (id && campaignId.length > 0 && typeof campaignId === 'object') {
      try {
        for (const cpi of campaignId) {
          const campaign = await helpers.query({
            TableName: 'rule',
            IndexName: 'user_index',
            KeyConditionExpression: 'userId=:userId and campaignId=:campaignId',
            ExpressionAttributeValues: {
              ':userId': id,
              ':campaignId': cpi.toString(),
            },
          });

          // console.log(campaign.Items);
          if (campaign.Items.length > 0) {
            const params = {
              TableName: 'rule',
              Key: {
                id: campaign.Items[0].id,
              },
              UpdateExpression:
                'set proxy=:proxy, js=:js, vpn=:vpn, ip=:ip, os=:os, channel=:channel, browser=:browser, device=:device, isp=:isp, country=:country, city=:city,clickTime=:clickTime',
              ExpressionAttributeValues: {
                ':proxy': proxy,
                ':js': js,
                ':vpn': vpn,
                ':ip': ip,
                ':os': os,
                ':channel': channel,
                ':browser': browser,
                ':device': device,
                ':isp': isp,
                ':country': country,
                ':city': city,
                ':clickTime': clicktime,
              },
              ReturnValues: 'UPDATED_NEW',
            };
            await helpers.update(params);
            if (account && refreshToken && campaignId && ip.length > 0) {
              const customer = this.client.Customer({
                customer_id: account,
                // login_customer_id: process.env.ADWARD_LOGIN_ID,
                refresh_token: refreshToken,
              });
              for (const singleIp of ip) {
                const campaign_criterion = {
                  campaign: campaignId,
                  negative: true,
                  ip_block: {
                    ip_address: singleIp,
                  },
                };
                customer.campaignCriteria.create([campaign_criterion]);
              }
            }
          } else {
            await helpers.create({
              TableName: 'rule',
              Item: {
                id: uuidv4(),
                startTime: 0,
                userId: id,
                campaignId: cpi.toString(),
                click: 0,
                clickTime: {
                  minutes: {
                    click: minClick,
                    time: minutes,
                  },
                  hour: {
                    click: hourclick,
                    time: hours,
                  },
                  day: {
                    click: dayClick,
                    time: day,
                  },
                  month: {
                    click: monthclick,
                    time: month,
                  },
                },
                proxy: true,
                js: true,
                vpn: true,
                ip: ip,
                os: os,
                channel: channel,
                browser: browser,
                device: device,
                isp: isp,
                country: country,
                city: city,
              },
            });
          }
        }
        return { success: true };
      } catch (err) {
        console.log(err);
        return { success: false };
      }
    }
  }
}
