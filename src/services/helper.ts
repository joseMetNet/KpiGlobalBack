import { CustomError } from '../config';
import * as jwt from 'jsonwebtoken';
import { config } from '../config';
import { AuthTokenPayload } from '../interface';
import { DefaultAzureCredential } from '@azure/identity';
import { BlobServiceClient } from '@azure/storage-blob';

export function createAuthToken(payload: AuthTokenPayload): string {
  return jwt.sign(payload, config.AUTH_TOKEN_SECRET, {
    algorithm: 'HS256',
    issuer: 'metnet',
    audience: 'audience',
    expiresIn: config.AUTH_TOKEN_EXPIRY_DURATION
  }
  );
}

export async function sendVerificationEmail(code: string, email: string): Promise<string | CustomError> {
  try {
    const emailBody: string = buildEmailBody(code);
    const host: string = 'https://api.masiv.masivian.com/email/v1/delivery';
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Basic R2V0aW5jbG91ZC1NZXRuZXQuQXBpOjBrMmxnMkdFNlRYSA=='
      },
      body: `{
                    "Subject":"Activaci\u00F3n de cuenta",
                    "From":"Hone Solutions<gestiondocumental@honesolutions.com.co>",
                    "Template": {
                        "Type":"text/html",
                        "Value": "${emailBody}"
                    },
                    "Recipients":[{"To":"Efrain Palacios<${email}>"}]
               }`
    };
    const request = await fetch(host, options);
    if (!request.ok) {
      return CustomError.badRequest(`Error sending the verification email ${request.json}`);
    }
    return emailBody;
  } catch (err: any) {
    return CustomError.internalServer(err.message);
  }
}

export async function uploadFile(userId: number) {
  const defaultAzureCredential = new DefaultAzureCredential();
  const blobServiceClient = new BlobServiceClient(
    `https://${config.BLOB_ACCOUNT}.blob.core.windows.net`,
    defaultAzureCredential
  );
  const containerClient = blobServiceClient.getContainerClient(config.BLOB_CONTAINER);
  const blobName = `${userId}.png`;
  const blockBlobClient = containerClient.getBlockBlobClient(blobName);
  const content = '';
  //const uploadBlobResponse = await blockBlobClient.uploadFile(content, content.length);
  console.log(`Upload block blob ${blobName} successfully`);
}

function buildEmailBody(code: string) {
  const body: string =
		`
    <!DOCTYPE html PUBLIC '-//W3C//DTD XHTML 1.0 Strict//EN' 'http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd'>
<html xmlns='http://www.w3.org/1999/xhtml'>
  <head>
    <meta http-equiv='Content-Type' content='text/html; charset=utf-8'>
    <meta name='viewport' content='width=device-width, initial-scale=1.0'>
    <title>Verify your login</title>
  </head>
  <body style='font-family: Helvetica, Arial, sans-serif; margin: 0px; padding: 0px; background-color: #ffffff;'>
    <table role='presentation' style='width: 100%; border-collapse: collapse; border: 0px; border-spacing: 0px; font-family: Arial, Helvetica, sans-serif; background-color: rgb(239, 239, 239);'>
      <tbody>
        <tr>
          <td align='center' style='padding: 1rem 2rem; vertical-align: top; width: 100%;'>
            <table role='presentation' style='max-width: 600px; border-collapse: collapse; border: 0px; border-spacing: 0px; text-align: left;'>
              <tbody>
                <tr>
                  <td style='padding: 40px 0px 0px;'>
                    <div style='text-align: left;'>
                      <div style='padding-bottom: 20px;'>
                        <img src='https://i.ibb.co/Qbnj4mz/logo.png' alt='Company' style='width: 56px;'>
                      </div>
                    </div>
                    <div style='padding: 20px; background-color: rgb(255, 255, 255);'>
                      <div style='color: rgb(0, 0, 0); text-align: left;'>
                        <h1 style='margin: 1rem 0'>Verification code</h1>
                        <p style='padding-bottom: 16px'>Please use the verification code below to sign in.</p>
                        <p style='padding-bottom: 16px'>
                          <strong style='font-size: 130%'>${code}</strong>
                        </p>
                        <p style='padding-bottom: 16px'>If you didn’t request this, you can ignore this email.</p>
                        <p style='padding-bottom: 16px'>Thanks, <br>The Mailmeteor team </p>
                      </div>
                    </div>
                    <div style='padding-top: 20px; color: rgb(153, 153, 153); text-align: center;'>
                      <p style='padding-bottom: 16px'>Made with ♥ in Paris</p>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
      </tbody>
    </table>
  </body>
</html>
    `;
  return body;
}
