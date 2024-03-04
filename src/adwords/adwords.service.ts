import { Injectable } from '@nestjs/common';
import { GoogleAdsApi } from 'google-ads-api';
import { Repository, UpdateResult, DeleteResult } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/user.entity';
const helpers = require('../../helpers/functions');
const { google } = require('googleapis');
import * as dotenv from 'dotenv';
dotenv.config();
// test account id 8750749686
const Oauth2Client = new google.auth.OAuth2(
  process.env.ADWORD_CLIENT,
  process.env.ADWORD_SECRET,
  process.env.ADWORD_REDIRECT,
);
const client = new GoogleAdsApi({
  client_id: process.env.ADWORD_CLIENT,
  client_secret: process.env.ADWORD_SECRET,
  developer_token: process.env.ADWORD_DEVELOPER,
});

@Injectable()
export class AdwordsService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  getAdwordLink(req) {
    const url = Oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: ['https://www.googleapis.com/auth/adwords'],
      prompt: 'consent',
    });
    return { url: url };
  }

  getAdwordsRedrect(req, res) {
    let code = req.query.code;
    res.redirect(process.env.ADWORD_FRONT_REDIRECT + '?code=' + code);
  }

  getAdwordsToken(req) {
    let code = req.query.code;
    return Oauth2Client.getToken(code)
      .then(({ tokens }) => {
        const refreshToken = tokens.refresh_token;

        if (refreshToken) {
          return client
            .listAccessibleCustomers(refreshToken)
            .then((data) => {
              const account = [];
              if (data.resource_names.length > 0) {
                for (const item of data.resource_names) {
                  account.push(item.replace('customers/', ''));
                }
              }
              return {
                success: true,
                account: account,
                refreshToken: tokens.refresh_token,
              };
            })
            .catch((err) => {
              console.log(err);
              return { sucess: false, message: 'Google Ads API Error' };
            });
        } else {
          return { sucess: false, message: 'Refresh Token Not Found' };
        }
      })
      .catch((err) => {
        console.log('err');
        console.log(err);
        return { success: false, message: 'Oauth2Client Error' };
      });
  }

  async postSelectAccount(req) {
    const userId = req.user.userId;
    const account = req.body.account;
    const refreshToken = req.body.refreshToken;
    if (userId && account) {
      try {
        const customer = client.Customer({
          customer_id: account.split('-').join(''),
          refresh_token: refreshToken,
          // login_customer_id: '1849844314',
        });
        await customer.report({
          entity: 'campaign',
          attributes: ['campaign.id'],
          // metrics: ['metrics.conversions'],
        });

        await this.userRepository.update(
          { id: userId },
          {
            ad_account: account.split('-').join(''),
            refreshToken: refreshToken,
          },
        );
        return { success: true };
      } catch (err) {
        console.log(err);
        return {
          success: false,
          message: "Manager Account can't be connected",
          manager: true,
        };
      }
    } else {
      return { success: false, message: 'UserId and Token mismatch' };
    }
  }
  async getCampaigns(req) {
    const userId = req.user.userId;
    const cusAccount = await this.userRepository.findOne({
      id: userId,
    });
    console.log('cusAccount');
    console.log(cusAccount);
    if (cusAccount.ad_account && cusAccount.refreshToken) {
      const customer = client.Customer({
        customer_id: cusAccount.ad_account,
        refresh_token: cusAccount.refreshToken,
      });
      return customer
        .report({
          entity: 'campaign',
          attributes: ['campaign.id'],
          metrics: [
            'metrics.average_cpc',
            // 'metrics.top_impression_percentage',
            // 'metrics.clicks',
            // 'metrics.ctr',
            // 'metrics.impressions',
            // 'metrics.cost_micros',
            // 'metrics.conversions',
            // 'metrics.conversions_value',
            // 'metrics.average_cpm',
          ],

          // attributes: [
          //   'campaign.id',
          //   'campaign.name',
          //   'campaign.status',
          //   'campaign.start_date',
          //   'campaign.end_date',
          //   'campaign_budget.amount_micros',
          //   'campaign.campaign_budget',
          //   'campaign.target_cpm',
          //   'campaign_budget.recommended_budget_estimated_change_weekly_clicks',
          // ],
          // metrics: [
          //   'metrics.average_cpc',
          //   'metrics.top_impression_percentage',
          //   'metrics.clicks',
          //   'metrics.ctr',
          //   'metrics.impressions',
          //   'metrics.cost_micros',
          //   'metrics.conversions',
          //   'metrics.conversions_value',
          //   'metrics.average_cpm',
          //   'metrics.phone_calls',
          // ],
        })
        .then((data) => {
          // console.log(data);
          return { success: true, campaign: data };
        })
        .catch((err) => {
          console.log(err);
          return { success: false, campaign: [] };
        });
    } else {
      return { success: false, campaign: [], account: 'none' };
    }
  }
  async filterCampaigns(req) {
    const userId = req.user.userId;
    const start_date = req.query.start;
    const end_date = req.query.end;
    const campaignId = req.query.campaignId;
    const createQuery =
      start_date && end_date
        ? { from_date: start_date, to_date: end_date }
        : {};

    const cusAccount = await this.userRepository.findOne({
      id: userId,
    });
    if (cusAccount.ad_account && cusAccount.refreshToken) {
      // console.log(cusAccount.ad_account);
      // console.log(cusAccount.refreshToken);
      const customer = client.Customer({
        customer_id: cusAccount.ad_account,
        refresh_token: cusAccount.refreshToken,
      });

      return customer
        .report({
          entity: 'campaign',
          attributes: [
            'campaign.id',
            'campaign.name',
            'campaign.status',
            'campaign.start_date',
            'campaign.end_date',
            'campaign_budget.amount_micros',
          ],
          metrics: [
            'metrics.conversions',
            'metrics.conversions_value',
            'metrics.average_cpm',
            'metrics.average_cpc',
            'metrics.top_impression_percentage',
            'metrics.clicks',
            'metrics.ctr',
            'metrics.impressions',
            'metrics.cost_micros',
          ],
          ...createQuery,
          constraints: {
            'campaign.id': campaignId,
          },
        })
        .then((data) => {
          // console.log(data);
          return { success: true, campaign: data };
        })
        .catch((err) => {
          console.log(err);
          return { success: false, campaign: [] };
        });
    } else {
      return { success: false, campaign: [] };
    }
  }
  async getAccount(req) {
    const userId = req.user.userId;
    if (userId) {
      try {
        const cusAccount = await this.userRepository.findOne({
          id: userId,
        });
        // console.log(cusAccount);
        return { success: true, user: cusAccount };
      } catch (err) {
        return { success: false };
      }
    } else {
      return { success: false };
    }
  }
  async updateAccount(req) {
    const userId = req.user.userId;
    const account = req.body.account;
    if (account && userId) {
      try {
        const updateAccount = await this.userRepository.update(
          { id: userId },
          {
            ad_account: account,
          },
        );
        return { success: true };
      } catch (err) {
        return { success: false };
      }
    } else {
      return { success: false };
    }
  }

  async test(req) {
    const userId = req.user.userId;
    if (userId) {
      const cusAccount = await this.userRepository.findOne({
        id: userId,
      });
      if (cusAccount.ad_account && cusAccount.refreshToken) {
        // console.log(cusAccount.ad_account);
        // console.log(cusAccount.refreshToken);
        const customer = client.Customer({
          customer_id: cusAccount.ad_account,
          refresh_token: cusAccount.refreshToken,
        });
        try {
          let result = await customer.report({
            entity: 'click_view',
            // entity: 'campaign_audience_view',

            constraints: {
              'campaign.id': '1849844314',
            },
          });
          // console.log('result');
          // console.log(result);
          return 'yes';
        } catch (err) {
          console.log(err);
          return 'no';
        }
      }
    }
  }
}
