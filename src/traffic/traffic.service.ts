import { Injectable } from '@nestjs/common';

import * as path from 'path';
import { GoogleAdsApi, enums } from 'google-ads-api';
import axios from 'axios';
import * as dotenv from 'dotenv';
const { v4: uuidv4 } = require('uuid');

const fs = require('fs');
const DeviceDetector = require('node-device-detector');
const helpers = require('../../helpers/functions');

dotenv.config();
import { Repository, UpdateResult, DeleteResult, MoreThan } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/user.entity';
import { Subscription } from '../stripe/subscriptions/subscription.entity';
import { Notification } from 'src/notification/notificaiton.entity';
import { compareSync } from 'bcrypt';
@Injectable()
export class TrafficService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Subscription)
    private subscriptionRepository: Repository<Subscription>,
    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>,
  ) {}

  private async botD(queryId) {
    let config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };
    if (queryId) {
      try {
        const botdetect: any = await axios.post(
          'https://botd.fpapi.io/api/v1/verify',
          {
            requestId: queryId, //req.query.requestId,
            secretKey: process.env.BOT_PRIVATE,
          },
        );

        const result = botdetect.data;
        let botType: any = '';
        if (result.bot.automationTool.probability > 0.75) {
          botType = 'automationTool';
        }
        if (result.bot.browserSpoofing.probability > 0.75) {
          botType = 'browserSpoofing';
        }
        if (result.bot.searchEngine.probability > 0.75) {
          botType = 'searchEngine';
        }
        if (result.vm.probability > 0.75) {
          botType = 'vm';
        }
        return botType;
      } catch (err) {
        console.log(err);
        return '';
      }
    } else {
      return '';
    }
  }

  async getTraffic(req) {
    const userAgent = req.get('user-agent');
    // console.log('userAgent');
    // console.log(userAgent);

    // vpn Ip  68.235.33.99
    // Real Ip  37.111.212.148
    const fakeRedirect = 'https://google.com';
    let ipNub = req.headers['x-forwarded-for'];
    let googleIp = req.headers['x-forwarded-for'];
    if (ipNub) {
      ipNub = ipNub.split(',')[0];
    } else {
      googleIp = '1.0.0.8';
      ipNub = '1.0.0.8';
      //ipNub = '103.135.233.72';
    }
    const userId = req.params.id ? parseInt(req.params.id) : 0;

    const jsCheck = req.query.js;
    const detector = new DeviceDetector();
    const result = detector.detect(userAgent);
    const device = result.device.type;
    const os = result.os.name + ' ' + result.os.version;
    const browser = result.client.name;
    const campaignid = req.query.campaignid;
    const keyword = req.query.keyword;

    try {
      const query: any = await this.subscriptionRepository
        .createQueryBuilder('subscription')
        .where(
          'subscription.bought_click > subscription.total_clicks AND subscription.userId = :userId AND subscription.current_period_end > :date AND (subscription.status = :status OR subscription.status =:status2)',
          {
            userId: userId,
            date: new Date().getTime() / 1000,
            status: 'active',
            status2: 'trialing',
          },
        )
        .getOne();

      let click_left = 0;

      if (query && query.bought_click) {
        click_left = (query.bought_click / 100) * 90;
      }
      if (query && query.total_clicks + 1 >= click_left) {
        const notification = await this.notificationRepository.findOne({
          userId,
          subscriptionId: query.subscriptionId,
        });

        if (!notification) {
          this.notificationRepository.save({
            content: 'You have 10% clicks left',
            userId: userId,
            subscriptionId: query.subscriptionId,
          });
        }
      }

      if (query) {
        if (campaignid && userId && campaignid !== '{campaignid}') {
          const time: any = new Date();
          let qIp = ipNub.split('.').splice(0, 3).join('.');
          const getIp = await helpers.fetchOne({
            TableName: 'ip2location',
            Key: {
              user_ip: qIp,
            },
          });

          // const dt: any = new Date();
          // console.log((dt - time) / 1000);
          query.total_clicks++;
          await this.subscriptionRepository.save(query);

          let country = '-';
          let isp = '-';
          let city = '-';
          let region = '-';
          let countryShort = '-';
          let proxyType = '';
          let isProxy = '';

          if (getIp.Item) {
            const userLocation = getIp.Item;
            country = userLocation.countryLong;
            isp = userLocation.isp;
            city = userLocation.city;
            region = userLocation.region;
            countryShort = userLocation.countryShort;
            proxyType = userLocation.proxyType;
            isProxy = userLocation.isProxy;
          }

          const rlInfo = await helpers.query({
            TableName: 'rule',
            IndexName: 'user_index',
            KeyConditionExpression: 'userId=:userId and campaignId=:campaignId',
            ExpressionAttributeValues: {
              ':userId': userId,
              ':campaignId': campaignid,
            },
          });

          const ruleInfo = rlInfo.Items;
          const redirect = fakeRedirect;
          let block = false;

          // START HELPER FUNCTIONS

          const blockByItem = (type, matchId) => {
            if (type.length > 0) {
              type.forEach((match) => {
                if (match === matchId) {
                  block = true;
                }
              });
              return block;
            }
            return block;
          };
          const blockByCountry = (type, matchId) => {
            if (type.length > 0) {
              let blockType = true;
              type.forEach((match) => {
                if (match === matchId) {
                  blockType = false;
                }
              });
              return blockType;
            }
          };
          const date = new Date();
          const insertTraffic = async (block, farm, botUser) => {
            const ifBotTrue = botUser ? { [botUser]: 1 } : {};
            const isItBot = {
              automationTool: 0,
              browserSpoofing: 0,
              searchEngine: 0,
              vm: 0,
              ...ifBotTrue,
            };
            const item = {
              id: uuidv4(),
              userId: userId,
              ip: ipNub,
              jsEnabled: jsCheck,
              device: device,
              os: os,
              browser: browser,
              country: country,
              countryShort: countryShort,
              isp: isp,
              proxy: proxyType,
              // proxyType: proxyType,
              clickTime: date.getTime(),
              city: city,
              region: region,
              campaignid: campaignid,
              keyword: keyword,
              block: block,
              farm: farm,
              bot: botUser,
              ...isItBot,
            };
            try {
              const createUrl = await helpers.create({
                TableName: 'traffic',
                Item: item,
              });
              return item;
            } catch (err) {
              console.log('err');
              console.log(err);
            }
          };
          // function for reuse
          const blockByGoogle = async () => {
            const cusAccount: any = await this.userRepository.findOne({
              id: userId,
            });

            if (
              cusAccount !== undefined &&
              cusAccount.ad_account &&
              cusAccount.refreshToken &&
              campaignid !== '{campaignid}' &&
              campaignid &&
              googleIp
            ) {
              const client = new GoogleAdsApi({
                client_id: process.env.ADWORD_CLIENT,
                client_secret: process.env.ADWORD_SECRET,
                developer_token: process.env.ADWORD_DEVELOPER,
              });
              const customer = client.Customer({
                customer_id: cusAccount.ad_account,
                // login_customer_id: process.env.ADWARD_LOGIN_ID,
                refresh_token: cusAccount.refreshToken,
              });
              const campaign_criterion = {
                campaign: `customers/${cusAccount.ad_account}/campaigns/${campaignid}`,
                negative: true,
                ip_block: {
                  ip_address: googleIp,
                },
              };
              try {
                const blockIp = await customer.campaignCriteria.create([
                  campaign_criterion,
                ]);
                console.log('block by google');
              } catch (err) {
                console.log('block by google err');
                console.log(err);
                const campaigns = await customer.query(
                  `SELECT campaign_criterion.ip_block.ip_address FROM campaign_criterion WHERE campaign_criterion.campaign='customers/${cusAccount.ad_account}/campaigns/${campaignid}' AND campaign_criterion.type='IP_BLOCK' LIMIT 100`,
                );

                const cariterionId = [];
                for (let i = 0; i < campaigns.length; i++) {
                  cariterionId.push(
                    campaigns[i].campaign_criterion.resource_name,
                  );
                }

                customer.campaignCriteria
                  .remove(cariterionId, {
                    response_content_type: 'RESOURCE_NAME_ONLY',
                  })
                  .then(async (blockIp) => {
                    console.log('blockIp');
                    console.log(blockIp);
                    if (blockIp.results.length > 0) {
                      console.log('results');
                      const createIp = await customer.campaignCriteria.create([
                        campaign_criterion,
                      ]);
                    }
                  });
              }
            }
          };
          // END HELPER FUNCTIONS

          let bot = await this.botD(req.query.requestId);

          // Check all traffic rule if the use set

          if (ruleInfo.length > 0) {
            if (
              blockByCountry(ruleInfo[0].country, country) ||
              blockByCountry(ruleInfo[0].city, city)
            ) {
              block = true;
            }

            blockByItem(ruleInfo[0].os, os);
            blockByItem(ruleInfo[0].ip, ipNub);
            blockByItem(ruleInfo[0].isp, isp);
            blockByItem(ruleInfo[0].browser, browser);
            blockByItem(ruleInfo[0].device, device);
            if ((ruleInfo[0].vpn || ruleInfo[0].proxy) && isProxy) {
              block = true;
            }
            if (ruleInfo[0].js && jsCheck !== 'enabled') {
              block = true;
            }
            if (bot) {
              block = true;
            }

            if (!block) {
              const ttlClick = await helpers.query({
                TableName: 'traffic',
                IndexName: 'user_index',
                KeyConditionExpression: 'userId=:userId',
                FilterExpression: 'ip =:ipNub',
                ExpressionAttributeValues: {
                  ':userId': userId,
                  ':ipNub': ipNub,
                },
                ScanIndexForward: false,
              });
              const totalClick = ttlClick.Items;

              // console.log('block');
              // console.log(totalClick);

              let lastClick = [];
              totalClick.map((item) => {
                lastClick.push(item.clickTime);
              });
              const clTime = new Date(Math.min(...lastClick));
              const clickLength = totalClick.length;

              if (
                ruleInfo[0].clickTime.minutes.time > helpers.todayMin(clTime)
              ) {
                if (ruleInfo[0].clickTime.minutes.click > clickLength) {
                  console.log('min can click');
                  const insert = await insertTraffic(false, false, false);
                  return {
                    success: true,
                    redirect: redirect,
                    data: insert,
                    message: 'min is okay',
                  };
                } else {
                  console.log('min block');
                  const insert = await insertTraffic(true, true, false);
                  blockByGoogle();
                  return {
                    success: true,
                    redirect: fakeRedirect,
                    data: insert,
                    message: 'min Block',
                  };
                }
              } else if (
                ruleInfo[0].clickTime.hour.time > helpers.todayMin(clTime)
              ) {
                if (ruleInfo[0].clickTime.hour.click > clickLength) {
                  console.log('hour can click');
                  const insert = await insertTraffic(false, false, false);
                  return {
                    success: true,
                    redirect: redirect,
                    data: insert,
                    message: 'hour is okay',
                  };
                } else {
                  console.log('hour block');
                  const insert = await insertTraffic(true, true, false);
                  blockByGoogle();
                  return {
                    success: true,
                    redirect: fakeRedirect,
                    data: insert,
                    message: 'hour is failed',
                  };
                }
              } else if (
                ruleInfo[0].clickTime.day.time >= helpers.todayMin(clTime)
              ) {
                if (ruleInfo[0].clickTime.day.click > clickLength) {
                  console.log('day can click');
                  const insert = await insertTraffic(false, false, false);
                  return {
                    success: true,
                    redirect: redirect,
                    data: insert,
                    message: 'day is okay',
                  };
                } else {
                  console.log('hour block');
                  const insert = await insertTraffic(true, true, false);
                  blockByGoogle();
                  return {
                    success: true,
                    redirect: fakeRedirect,
                    data: insert,
                    message: 'day is failed',
                  };
                }
              } else if (
                ruleInfo[0].clickTime.month.time >= helpers.todayMin(clTime)
              ) {
                if (ruleInfo[0].clickTime.month.click > clickLength) {
                  console.log('month can click');
                  const insert = await insertTraffic(false, false, false);
                  return {
                    success: true,
                    redirect: redirect,
                    data: insert,
                    message: 'month is okay',
                  };
                } else {
                  console.log('month block');
                  const insert = await insertTraffic(true, true, false);
                  blockByGoogle();
                  return {
                    success: true,
                    redirect: fakeRedirect,
                    data: insert,
                    message: 'month is failed',
                  };
                }
              } else {
                console.log('nothing');
                const insert = await insertTraffic(false, false, false);
                return {
                  success: true,
                  redirect: redirect,
                  data: insert,
                  message: 'nothing',
                };
              }
            } else {
              console.log('block by rule ');
              const insert = await insertTraffic(true, false, bot);
              blockByGoogle();
              return {
                success: true,
                redirect: fakeRedirect,
                data: insert,
                message: 'block by rule',
              };
            }
          } else {
            // it is for default rule if not set by user

            console.log('default block');
            let elBlock = false;

            if (isProxy) {
              elBlock = true;
            }

            if (jsCheck !== 'enabled') {
              elBlock = true;
            }
            if (bot) {
              elBlock = true;
            }
            if (elBlock) {
              const insert = await insertTraffic(true, false, bot);
              blockByGoogle();
              return {
                success: true,
                redirect: fakeRedirect,
                data: insert,
                message: 'block by default',
              };
            } else {
              const insert = await insertTraffic(false, false, false);
              return {
                success: true,
                redirect: redirect,
                data: insert,
                message: 'By default pass',
              };
            }
          }
        } else {
          return {
            success: true,
            redirect: fakeRedirect,
            message: 'invalid campaign Id',
          };
        }
      } else {
        return {
          success: true,
          redirect: fakeRedirect,
          message: 'Subscription is ended',
        };
      }
    } catch (err) {
      console.log(err);
      return {
        success: true,
        redirect: fakeRedirect,
        message: 'something error',
      };
    }
  }
  async testGoogle(req) {
    const userId = req.user.userId;
    const campaignid = req.query.campaignId;
    const cusAccount = await this.userRepository.findOne({
      id: userId,
    });

    const client = new GoogleAdsApi({
      client_id: process.env.ADWORD_CLIENT,
      client_secret: process.env.ADWORD_SECRET,
      developer_token: process.env.ADWORD_DEVELOPER,
    });
    const customer = client.Customer({
      customer_id: cusAccount.ad_account,
      // login_customer_id: process.env.ADWARD_LOGIN_ID,
      refresh_token: cusAccount.refreshToken,
    });
    const campaign_criterion = {
      campaign: 'customers/8750749686/campaigns/15718325238',
      negative: true,
      ip_block: {
        ip_address: '37.111.214.219',
      },
    };
    try {
      const blockIp = await customer.campaignCriteria.create([
        campaign_criterion,
      ]);

      return { suc: true };
    } catch (err) {
      console.log(err);
      return { suc: false };
    }
  }
  async filterTraffic(req) {
    const user = req.user.userId;
    const start = parseInt(req.query.start);
    const end = parseInt(req.query.end);
    let fetchByDefination: any = {
      KeyConditionExpression: 'userId=:userId',
      ExpressionAttributeValues: {
        ':userId': user,
      },
    };

    if (!isNaN(start) && start && end && !isNaN(end)) {
      fetchByDefination = {
        KeyConditionExpression: 'userId=:userId AND clickTime < :end',
        ExpressionAttributeValues: {
          ':userId': user,
          ':end': end,
        },
      };
    }

    return helpers
      .query({
        TableName: 'traffic',
        IndexName: 'user_index',
        ...fetchByDefination,
        ScanIndexForward: false,
      })
      .then((data) => {
        return { success: true, data: data, userId: req.user.userId };
      })
      .catch((err) => {
        console.log(err);
        return { success: false };
      });
  }

  async getLeftClicks(req) {
    const query: any = await this.subscriptionRepository
      .createQueryBuilder('subscription')
      .where(
        'subscription.bought_click > subscription.total_clicks AND subscription.userId = :userId AND subscription.current_period_end > :date AND (subscription.status = :status OR subscription.status =:status2)',
        {
          userId: req.user.userId,
          date: new Date().getTime() / 1000,
          status: 'active',
          status2: 'trialing',
        },
      )

      .getMany();

    let clicks = 0;
    let bought = 0;
    if (query && query.length > 0) {
      for (const item of query) {
        clicks += item.total_clicks;
        bought += item.bought_click;
      }
    }

    return { clicks: clicks, bought: bought, userId: req.user.userId };
  }

  async testTraffic(req) {
    const userId = req.query.userId;
    const campaignid = req.query.campaignid;
    const ipNub = req.query.ip;
    const cusAccount: any = await this.userRepository.findOne({
      id: userId,
    });

    if (
      cusAccount !== undefined &&
      cusAccount.ad_account &&
      cusAccount.refreshToken &&
      campaignid !== '{campaignid}' &&
      campaignid &&
      ipNub
    ) {
      const client = new GoogleAdsApi({
        client_id: process.env.ADWORD_CLIENT,
        client_secret: process.env.ADWORD_SECRET,
        developer_token: process.env.ADWORD_DEVELOPER,
      });
      const customer = client.Customer({
        customer_id: cusAccount.ad_account,
        // login_customer_id: process.env.ADWARD_LOGIN_ID,
        refresh_token: cusAccount.refreshToken,
      });

      const campaign_criterion = {
        campaign: `customers/${cusAccount.ad_account}/campaigns/${campaignid}`,
        negative: true,
        ip_block: {
          ip_address: ipNub,
        },
      };
      try {
        // const blockIp = await customer.campaignCriteria.create([
        //   campaign_criterion,
        // ]);

        // const blockIp = await customer.campaignCriteria.get(
        //   'customers/7033081535/campaignCriteria/18022283007~1721855609991',
        // )

        // const blockIp = await customer.campaignCriteria.remove(
        //   ['customers/7033081535/campaignCriteria/18022283007~1721855609991'],
        //   {
        //     response_content_type: 'RESOURCE_NAME_ONLY',
        //   },
        // );

        // const blockIp = await customer.campaignCriteria.update(
        //   [
        //     {
        //       campaign:
        //         'customers/7033081535/campaignCriteria/18022283007~1721855609991',
        //     },
        //   ],
        //   {
        //     response_content_type: 'RESOURCE_NAME_ONLY',
        //   },
        // );

        // console.log('block by google');
        // console.log('blockIp');
        // console.log(blockIp);

        // "query": "SELECT campaign.id, campaign.name, campaign.status, campaign.serving_status, campaign_criterion.criterion_id, campaign_criterion.type FROM campaign_criterion WHERE campaign_criterion.type='IP_BLOCK'"

        const campaigns = await customer.query(
          `SELECT campaign_criterion.ip_block.ip_address FROM campaign_criterion WHERE campaign_criterion.campaign='customers/7033081535/campaigns/18022283007' AND campaign_criterion.type='IP_BLOCK' LIMIT 100`,
        );

        const cariterionId = [];
        for (let i = 0; i < campaigns.length; i++) {
          cariterionId.push(campaigns[i].campaign_criterion.resource_name);
        }

        const blockIp = await customer.campaignCriteria.remove(cariterionId, {
          response_content_type: 'RESOURCE_NAME_ONLY',
        });

        const createBIp = await customer.campaignCriteria.create([
          campaign_criterion,
        ]);

        return { success: true };
      } catch (err) {
        console.log('err');
        console.log(err);
        return { success: false };
      }
    }

    // try {
    //   let ipNub = req.headers['x-forwarded-for'];
    //   if (ipNub) {
    //     ipNub = ipNub.split(',')[0];
    //   } else {
    //     ipNub = '1.0.0.0';
    //   }
    //   const time: any = new Date();
    //   let qIp = ipNub.split('.').splice(0, 3).join('.');
    //   const awsIp = await helpers.fetchOne({
    //     TableName: 'ip2location',
    //     Key: {
    //       user_ip: qIp,
    //     },
    //   });

    //   const newTime: any = new Date();
    //   console.log(newTime - time);
    //   return {
    //     userLocation: awsIp,
    //   };
    // } catch (err) {
    //   console.log(err);
    //   return {
    //     err: true,
    //   };
    // }
  }
}
