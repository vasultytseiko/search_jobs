import { Injectable } from '@nestjs/common';
import { CLIENT_HOST } from 'src/common/constants';
@Injectable()
export class EmailTemplateService {
  generateConfirmationHtml(token: string): string {
    return `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Document</title>
        <style>
            div{
                padding: 15px;
                text-align: center;
                background-color: #000000;
            }
            .header{
                font-family: 'Montserrat';
                font-style: normal;
                font-weight: 600;
                font-size: 28px;
                line-height: 43px;
                color: #9e9e9e;
            } 
            .text{
                font-family: 'Montserrat';
                font-style: normal;
                width: 400;
                text-align: center;
                font-weight: 400;
                font-size: 18px;
                line-height: 150%;
                width: 446px;
                color: #9e9e9e;
            }
            .confirm-link{
                font-family: 'Montserrat';
                text-decoration: none;
                font-weight: 400;
                font-size: 18px;
                line-height:  150%;
            }
            .text-div{
            display: flex;
            margin-left: 360px;
            
            }
        </style>
    </head>
    <body>
        
        <div>
            <h1 class="header"></h1>
            <div class="text-div" style="justify-content: center">
            <p class="text">
                Thank you for registering on our website,
                    <a style="color:#fba92c;"class ="confirm-link" href="${CLIENT_HOST}/email-confirmation/${token}">
                    click here
                    </a>
                    to confirm your email
            </p>
        </div>
        </div>
    </body>
    </html>
    `;
  }
  generatePasswordResetHtml(token: string): string {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Document</title>
        <style>
            div{
                padding: 15px;
                text-align: center;
                background-color: #000000;
            }
            .header{
                font-family: 'Montserrat';
                font-style: normal;
                font-weight: 600;
                font-size: 28px;
                line-height: 43px;
                color: #9e9e9e;
            } 
            .text{
                font-family: 'Montserrat';
                font-style: normal;
                width: 400;
                text-align: center;
                font-weight: 400;
                font-size: 18px;
                line-height: 150%;
                width: 446px;
                color: #9e9e9e;
            }
            .confirm-link{
                font-family: 'Montserrat';
                text-decoration: none;
                font-weight: 400;
                font-size: 18px;
                line-height:  150%;
            }
            .text-div{
            display: flex;
            margin-left: 360px;
            
            }
        </style>
    </head>
    <body>
        
        <div>
            <h1 class="header"></h1>
            <div class="text-div" style="justify-content: center">
            <p class="text">
                 You requested for reset password,
                    <a style="color:#fba92c;"class ="confirm-link" href="${CLIENT_HOST}/auth/reset-password/${token}">
                    click here
                    </a>
                    to reset your password
            </p>
        </div>
        </div>
    </body>
    </html>
    `;
  }
}
