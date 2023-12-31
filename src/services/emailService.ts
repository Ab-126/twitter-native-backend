import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";

const ses = new SESClient({});

require('dotenv').config()

function createSendEmailCommand(
  ToAddresses: string,
  fromAddress: string,
  message: string
) {
  return new SendEmailCommand({
    Destination: {
      ToAddresses: [ToAddresses],
    },
    Source: fromAddress,
    Message: {
      Subject: {
        Charset: "UTF-8",
        Data: "Your one-time password",
      },
      Body: {
        Text: {
          Charset: "UTF-8",
          Data: message,
        },
      },
    },
  });
}

export async function sendEmailToken(email: string, token: string) {
  const message = `Your one time password: ${token}`;

  const command = createSendEmailCommand(email, "abhi@gmail.com", message);
  try {
    return await ses.send(command);
  } catch (error) {
    console.log("Error sending email", error);
    return error;
  }
}
