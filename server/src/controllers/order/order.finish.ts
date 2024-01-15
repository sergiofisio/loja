import { prisma } from "../../prismaFunctions/prisma";
import axios from "axios";
import { Request, Response } from "express";
import { CustomError } from "../../class/class";
const { createTransport } = require("nodemailer");

const transporter = createTransport({
  host: process.env.ZOHO_HOST,
  secure: true,
  port: 465,
  auth: {
    user: process.env.ZOHO_USER,
    pass: process.env.ZOHO_PASSWORD,
  },
});

export async function finishOrder(req: Request, res: Response) {
  const { order_id } = req.params;
  const { email } = req.body;

  const basicAuthorization = Buffer.from(`${process.env.SECRET_KEY}:`).toString(
    "base64"
  );

  const user = await prisma.user.findUnique({ where: { email } });

  try {
    const order = await axios
      .request({
        method: "GET",
        url: `${process.env.BASE_URL}/orders/${order_id}`,
        headers: {
          accept: "application/json",
          authorization: `Basic ${basicAuthorization}`,
        },
      })
      .then(function (response) {
        return response.data;
      })
      .catch(function (error) {
        return error;
      });

    const findOrder = await prisma.cart.findFirst({
      where: {
        idPagarme: order_id,
      },
    });

    if (order.status === "paid") {
      await prisma.cart.update({
        where: { id: findOrder.id },
        data: { finished: true },
      });
    }

    const products = [];

    for (const item of JSON.parse(findOrder.products)) {
      const product = await prisma.product.findUnique({
        where: { id: Number(item.code) },
      });
      products.push({ ...product, quantity: item.quantity });
    }

    let productList = "<tr>";
    products.forEach((product, index) => {
      productList += `
      <td
                            class="column column-1"
                            width="33.333333333333336%"
                            style="
                              mso-table-lspace: 0;
                              mso-table-rspace: 0;
                              font-weight: 400;
                              text-align: left;
                              padding-bottom: 5px;
                              padding-top: 5px;
                              vertical-align: top;
                              border-top: 0;
                              border-right: 0;
                              border-bottom: 0;
                              border-left: 0;
                            "
                          >
                               <table
                              class="image_block block-1"
                              width="100%"
                              border="0"
                              cellpadding="0"
                              cellspacing="0"
                              role="presentation"
                              style="mso-table-lspace: 0; mso-table-rspace: 0"
                            >
                              <tr>
                                <td class="pad" style="width: 100%">
                                  <div
                                    class="alignment"
                                    align="center"
                                    style="line-height: 10px"
                                  >
                                    <div style="max-width: 100px">
                                      <img
                                        src="${product.image}"
                                        style="
                                          display: block;
                                          height: auto;
                                          border: 0;
                                          width: 100%;
                                        "
                                        width="100"
                                      />
                                    </div>
                                  </div>
                                </td>
                              </tr>
                            </table>
                            <table
                              class="text_block block-2"
                              width="100%"
                              border="0"
                              cellpadding="10"
                              cellspacing="0"
                              role="presentation"
                              style="
                                mso-table-lspace: 0;
                                mso-table-rspace: 0;
                                word-break: break-word;
                              "
                            >
                              <tr>
                                <td class="pad">
                                  <div style="font-family: sans-serif">
                                    <div
                                      class
                                      style="
                                        font-size: 14px;
                                        font-family: Arial, 'Helvetica Neue',
                                          Helvetica, sans-serif;
                                        mso-line-height-alt: 16.8px;
                                        color: #555;
                                        line-height: 1.2;
                                      "
                                    >
                                      <p
                                        style="
                                          margin: 0;
                                          font-size: 14px;
                                          text-align: center;
                                          mso-line-height-alt: 16.8px;
                                        "
                                      >
                                        <span style="font-size: 26px"
                                          ><strong>${
                                            product.name
                                          }</strong></span
                                        >
                                      </p>
                                    </div>
                                  </div>
                                </td>
                              </tr>
                            </table>
                            <table
                              class="text_block block-3"
                              width="100%"
                              border="0"
                              cellpadding="10"
                              cellspacing="0"
                              role="presentation"
                              style="
                                mso-table-lspace: 0;
                                mso-table-rspace: 0;
                                word-break: break-word;
                              "
                            >
                              <tr>
                                <td class="pad">
                                  <div style="font-family: sans-serif">
                                    <div
                                      class
                                      style="
                                        font-size: 14px;
                                        font-family: Arial, 'Helvetica Neue',
                                          Helvetica, sans-serif;
                                        mso-line-height-alt: 16.8px;
                                        color: #555;
                                        line-height: 1.2;
                                      "
                                    >
                                      <p
                                        style="
                                          margin: 0;
                                          font-size: 14px;
                                          text-align: center;
                                          mso-line-height-alt: 16.8px;
                                        "
                                      >
                                        <span style="font-size: 17px"
                                          >Quantidade: ${product.quantity}</span
                                        >
                                      </p>
                                    </div>
                                  </div>
                                </td>
                              </tr>
                            </table>
                            <table
                              class="text_block block-4"
                              width="100%"
                              border="0"
                              cellpadding="10"
                              cellspacing="0"
                              role="presentation"
                              style="
                                mso-table-lspace: 0;
                                mso-table-rspace: 0;
                                word-break: break-word;
                              "
                            >
                              <tr>
                                <td class="pad">
                                  <div style="font-family: sans-serif">
                                    <div
                                      class
                                      style="
                                        font-size: 14px;
                                        font-family: Arial, 'Helvetica Neue',
                                          Helvetica, sans-serif;
                                        mso-line-height-alt: 16.8px;
                                        color: #555;
                                        line-height: 1.2;
                                      "
                                    >
                                      <p
                                        style="
                                          margin: 0;
                                          font-size: 14px;
                                          text-align: center;
                                          mso-line-height-alt: 16.8px;
                                        "
                                      >
                                        <strong
                                          ><span style="font-size: 17px"
                                            >R$ ${(
                                              (product.price *
                                                product.quantity) /
                                              100
                                            ).toLocaleString("pt-BR", {
                                              style: "currency",
                                              currency: "BRL",
                                            })}</span
                                          ></strong
                                        >
                                      </p>
                                    </div>
                                  </div>
                                </td>
                              </tr>
                            </table>
                            `;
      if ((index + 1) % 3 === 0) {
        productList += "</td><td>";
      }
    });
    productList += "</td>";

    const keyMail = [
      {
        from: process.env.EMAIL,
        to: email,
        subject: "Seu pedido na Green Life foi finalizado!",
        html: `
<!DOCTYPE html>
<html
  xmlns:v="urn:schemas-microsoft-com:vml"
  xmlns:o="urn:schemas-microsoft-com:office:office"
  lang="en"
>
  <head>
    <title></title>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <!--[if mso
      ]><xml
        ><o:OfficeDocumentSettings
          ><o:PixelsPerInch>96</o:PixelsPerInch
          ><o:AllowPNG /></o:OfficeDocumentSettings></xml
    ><![endif]-->
    <style>
      * {
        box-sizing: border-box;
      }
      body {
        margin: 0;
        padding: 0;
      }
      a[x-apple-data-detectors] {
        color: inherit !important;
        text-decoration: inherit !important;
      }
      #MessageViewBody a {
        color: inherit;
        text-decoration: none;
      }
      p {
        line-height: inherit;
      }
      .desktop_hide,
      .desktop_hide table {
        mso-hide: all;
        display: none;
        max-height: 0;
        overflow: hidden;
      }
      .image_block img + div {
        display: none;
      }
      @media (max-width: 520px) {
        .mobile_hide {
          display: none;
        }
        .row-content {
          width: 100% !important;
        }
        .stack .column {
          width: 100%;
          display: block;
        }
        .mobile_hide {
          min-height: 0;
          max-height: 0;
          max-width: 0;
          overflow: hidden;
          font-size: 0;
        }
        .desktop_hide,
        .desktop_hide table {
          display: table !important;
          max-height: none !important;
        }
      }
    </style>
  </head>
  <body
    style="
      background-color: #fff;
      margin: 0;
      padding: 0;
      -webkit-text-size-adjust: none;
      text-size-adjust: none;
    "
  >
    <table
      class="nl-container"
      width="100%"
      border="0"
      cellpadding="0"
      cellspacing="0"
      role="presentation"
      style="mso-table-lspace: 0; mso-table-rspace: 0; background-color: #fff"
    >
      <tbody>
        <tr>
          <td>
            <table
              class="row row-1"
              align="center"
              width="100%"
              border="0"
              cellpadding="0"
              cellspacing="0"
              role="presentation"
              style="mso-table-lspace: 0; mso-table-rspace: 0"
            >
              <tbody>
                <tr>
                  <td>
                    <table
                      class="row-content stack"
                      align="center"
                      border="0"
                      cellpadding="0"
                      cellspacing="0"
                      role="presentation"
                      style="
                        mso-table-lspace: 0;
                        mso-table-rspace: 0;
                        border-radius: 0;
                        color: #000;
                        width: 500px;
                        margin: 0 auto;
                      "
                      width="500"
                    >
                      <tbody>
                        <tr>
                          <td
                            class="column column-1"
                            width="100%"
                            style="
                              mso-table-lspace: 0;
                              mso-table-rspace: 0;
                              font-weight: 400;
                              text-align: left;
                              padding-bottom: 5px;
                              padding-top: 5px;
                              vertical-align: top;
                              border-top: 0;
                              border-right: 0;
                              border-bottom: 0;
                              border-left: 0;
                            "
                          >
                            <table
                              class="text_block block-1"
                              width="100%"
                              border="0"
                              cellpadding="10"
                              cellspacing="0"
                              role="presentation"
                              style="
                                mso-table-lspace: 0;
                                mso-table-rspace: 0;
                                word-break: break-word;
                              "
                            >
                              <tr>
                                <td class="pad">
                                  <div style="font-family: sans-serif">
                                    <div
                                      class
                                      style="
                                        font-size: 14px;
                                        font-family: Arial, 'Helvetica Neue',
                                          Helvetica, sans-serif;
                                        mso-line-height-alt: 16.8px;
                                        color: #555;
                                        line-height: 1.2;
                                      "
                                    >
                                      <p
                                        style="
                                          margin: 0;
                                          font-size: 14px;
                                          text-align: center;
                                          mso-line-height-alt: 16.8px;
                                        "
                                      >
                                        <span style="font-size: 42px"
                                          >Confirmação de Pedido</span
                                        >
                                      </p>
                                    </div>
                                  </div>
                                </td>
                              </tr>
                            </table>
                            <table
                              class="text_block block-2"
                              width="100%"
                              border="0"
                              cellpadding="10"
                              cellspacing="0"
                              role="presentation"
                              style="
                                mso-table-lspace: 0;
                                mso-table-rspace: 0;
                                word-break: break-word;
                              "
                            >
                              <tr>
                                <td class="pad">
                                  <div style="font-family: sans-serif">
                                    <div
                                      class
                                      style="
                                        font-size: 14px;
                                        font-family: Arial, 'Helvetica Neue',
                                          Helvetica, sans-serif;
                                        mso-line-height-alt: 16.8px;
                                        color: #555;
                                        line-height: 1.2;
                                      "
                                    >
                                      <p
                                        style="
                                          margin: 0;
                                          font-size: 14px;
                                          text-align: center;
                                          mso-line-height-alt: 16.8px;
                                        "
                                      >
                                        <span style="font-size: 22px"
                                          >Olá, ${user.name}</span
                                        >
                                      </p>
                                    </div>
                                  </div>
                                </td>
                              </tr>
                            </table>
                            <table
                              class="text_block block-3"
                              width="100%"
                              border="0"
                              cellpadding="10"
                              cellspacing="0"
                              role="presentation"
                              style="
                                mso-table-lspace: 0;
                                mso-table-rspace: 0;
                                word-break: break-word;
                              "
                            >
                              <tr>
                                <td class="pad">
                                  <div style="font-family: sans-serif">
                                    <div
                                      class
                                      style="
                                        font-size: 14px;
                                        font-family: Arial, 'Helvetica Neue',
                                          Helvetica, sans-serif;
                                        mso-line-height-alt: 16.8px;
                                        color: #555;
                                        line-height: 1.2;
                                      "
                                    >
                                      <p
                                        style="
                                          margin: 0;
                                          font-size: 14px;
                                          text-align: center;
                                          mso-line-height-alt: 16.8px;
                                        "
                                      >
                                        <span style="font-size: 18px"
                                          >Seu pedido na Green Life foi
                                          finalizado!
                                        </span>
                                      </p>
                                      <p
                                        style="
                                          margin: 0;
                                          font-size: 14px;
                                          text-align: center;
                                          mso-line-height-alt: 16.8px;
                                        "
                                      >
                                        <span style="font-size: 18px"
                                          >Aqui estão os detalhes do seu
                                          pedido:</span
                                        >
                                      </p>
                                    </div>
                                  </div>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
              </tbody>
            </table>
            <table
              class="row row-2"
              align="center"
              width="100%"
              border="0"
              cellpadding="0"
              cellspacing="0"
              role="presentation"
              style="mso-table-lspace: 0; mso-table-rspace: 0"
            >
              <tbody>
                <tr>
                  <td>
                    <table
                      class="row-content stack"
                      align="center"
                      border="0"
                      cellpadding="0"
                      cellspacing="0"
                      role="presentation"
                      style="
                        mso-table-lspace: 0;
                        mso-table-rspace: 0;
                        border-radius: 0;
                        color: #000;
                        width: 500px;
                        margin: 0 auto;
                      "
                      width="500"
                    >
                      <tbody>
                        <tr>
                          ${productList}
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
      </tbody>
    </table>
    <!-- End -->
    <div style="background-color: transparent">
      <div
        style="
          margin: 0 auto;
          min-width: 320px;
          max-width: 500px;
          overflow-wrap: break-word;
          word-wrap: break-word;
          word-break: break-word;
          background-color: transparent;
        "
        class="block-grid"
      >
        <div
          style="
            border-collapse: collapse;
            display: table;
            width: 100%;
            background-color: transparent;
          "
        >
          <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="background-color:transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width: 500px;"><tr class="layout-full-width" style="background-color:transparent;"><![endif]-->
          <!--[if (mso)|(IE)]><td align="center" width="500" style=" width:500px; padding-right: 0px; padding-left: 0px; padding-top:15px; padding-bottom:15px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><![endif]-->
          <div
            class="col num12"
            style="
              min-width: 320px;
              max-width: 500px;
              display: table-cell;
              vertical-align: top;
            "
          >
            <div style="background-color: transparent; width: 100% !important">
              <!--[if (!mso)&(!IE)]><!-->
              <div
                style="
                  border-top: 0px solid transparent;
                  border-left: 0px solid transparent;
                  border-bottom: 0px solid transparent;
                  border-right: 0px solid transparent;
                  padding-top: 15px;
                  padding-bottom: 15px;
                  padding-right: 0px;
                  padding-left: 0px;
                "
              >
                <!--<![endif]-->

                <!--[if (!mso)&(!IE)]><!-->
              </div>
              <!--<![endif]-->
            </div>
          </div>
          <!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]-->
        </div>
      </div>
    </div>
  </body>
</html>

`,
      },
      {
        from: process.env.EMAIL,
        to: "contato@greenlifesaude.com.br, sergiobastosfisio@yahoo.com.br",
        subject: `Novo pedido de ${user.name} - ${email}`,
        html: `
<!DOCTYPE html>
<html
  xmlns:v="urn:schemas-microsoft-com:vml"
  xmlns:o="urn:schemas-microsoft-com:office:office"
  lang="en"
>
  <head>
    <title></title>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <!--[if mso
      ]><xml
        ><o:OfficeDocumentSettings
          ><o:PixelsPerInch>96</o:PixelsPerInch
          ><o:AllowPNG /></o:OfficeDocumentSettings></xml
    ><![endif]-->
    <style>
      * {
        box-sizing: border-box;
      }
      body {
        margin: 0;
        padding: 0;
      }
      a[x-apple-data-detectors] {
        color: inherit !important;
        text-decoration: inherit !important;
      }
      #MessageViewBody a {
        color: inherit;
        text-decoration: none;
      }
      p {
        line-height: inherit;
      }
      .desktop_hide,
      .desktop_hide table {
        mso-hide: all;
        display: none;
        max-height: 0;
        overflow: hidden;
      }
      .image_block img + div {
        display: none;
      }
      @media (max-width: 520px) {
        .mobile_hide {
          display: none;
        }
        .row-content {
          width: 100% !important;
        }
        .stack .column {
          width: 100%;
          display: block;
        }
        .mobile_hide {
          min-height: 0;
          max-height: 0;
          max-width: 0;
          overflow: hidden;
          font-size: 0;
        }
        .desktop_hide,
        .desktop_hide table {
          display: table !important;
          max-height: none !important;
        }
        .div {
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 100%;
          padding: 2rem;
        }

        .div h1 {
          text-align: center;
          font-size: 1.5rem;
          font-weight: bold;
        }

        .div h2 {
          text-align: center;
          font-size: 0.75rem;
          font-weight: normal;
        }
      }
    </style>
  </head>
  <body
    style="
      background-color: #fff;
      margin: 0;
      padding: 0;
      -webkit-text-size-adjust: none;
      text-size-adjust: none;
    "
  >
  <div class="div">
      <h1>Novo pedido de ${user.name} - ${email}</h1>
      <h2>ID: ${order_id}</h2>
  </div>
  </body>
</html>

`,
      },
    ];

    keyMail.forEach((key) => {
      transporter.sendMail(key, function (error: any, info: any) {
        if (error) {
          return error;
        } else {
          throw new CustomError(info.response, 400);
        }
      });
    });

    transporter.sendMail(
      {
        from: process.env.EMAIL,
        to: email,
        subject: "Seu pedido na Green Life foi finalizado!",
        html: `
<!DOCTYPE html>
<html
  xmlns:v="urn:schemas-microsoft-com:vml"
  xmlns:o="urn:schemas-microsoft-com:office:office"
  lang="en"
>
  <head>
    <title></title>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <!--[if mso
      ]><xml
        ><o:OfficeDocumentSettings
          ><o:PixelsPerInch>96</o:PixelsPerInch
          ><o:AllowPNG /></o:OfficeDocumentSettings></xml
    ><![endif]-->
    <style>
      * {
        box-sizing: border-box;
      }
      body {
        margin: 0;
        padding: 0;
      }
      a[x-apple-data-detectors] {
        color: inherit !important;
        text-decoration: inherit !important;
      }
      #MessageViewBody a {
        color: inherit;
        text-decoration: none;
      }
      p {
        line-height: inherit;
      }
      .desktop_hide,
      .desktop_hide table {
        mso-hide: all;
        display: none;
        max-height: 0;
        overflow: hidden;
      }
      .image_block img + div {
        display: none;
      }
      @media (max-width: 520px) {
        .mobile_hide {
          display: none;
        }
        .row-content {
          width: 100% !important;
        }
        .stack .column {
          width: 100%;
          display: block;
        }
        .mobile_hide {
          min-height: 0;
          max-height: 0;
          max-width: 0;
          overflow: hidden;
          font-size: 0;
        }
        .desktop_hide,
        .desktop_hide table {
          display: table !important;
          max-height: none !important;
        }
      }
    </style>
  </head>
  <body
    style="
      background-color: #fff;
      margin: 0;
      padding: 0;
      -webkit-text-size-adjust: none;
      text-size-adjust: none;
    "
  >
    <table
      class="nl-container"
      width="100%"
      border="0"
      cellpadding="0"
      cellspacing="0"
      role="presentation"
      style="mso-table-lspace: 0; mso-table-rspace: 0; background-color: #fff"
    >
      <tbody>
        <tr>
          <td>
            <table
              class="row row-1"
              align="center"
              width="100%"
              border="0"
              cellpadding="0"
              cellspacing="0"
              role="presentation"
              style="mso-table-lspace: 0; mso-table-rspace: 0"
            >
              <tbody>
                <tr>
                  <td>
                    <table
                      class="row-content stack"
                      align="center"
                      border="0"
                      cellpadding="0"
                      cellspacing="0"
                      role="presentation"
                      style="
                        mso-table-lspace: 0;
                        mso-table-rspace: 0;
                        border-radius: 0;
                        color: #000;
                        width: 500px;
                        margin: 0 auto;
                      "
                      width="500"
                    >
                      <tbody>
                        <tr>
                          <td
                            class="column column-1"
                            width="100%"
                            style="
                              mso-table-lspace: 0;
                              mso-table-rspace: 0;
                              font-weight: 400;
                              text-align: left;
                              padding-bottom: 5px;
                              padding-top: 5px;
                              vertical-align: top;
                              border-top: 0;
                              border-right: 0;
                              border-bottom: 0;
                              border-left: 0;
                            "
                          >
                            <table
                              class="text_block block-1"
                              width="100%"
                              border="0"
                              cellpadding="10"
                              cellspacing="0"
                              role="presentation"
                              style="
                                mso-table-lspace: 0;
                                mso-table-rspace: 0;
                                word-break: break-word;
                              "
                            >
                              <tr>
                                <td class="pad">
                                  <div style="font-family: sans-serif">
                                    <div
                                      class
                                      style="
                                        font-size: 14px;
                                        font-family: Arial, 'Helvetica Neue',
                                          Helvetica, sans-serif;
                                        mso-line-height-alt: 16.8px;
                                        color: #555;
                                        line-height: 1.2;
                                      "
                                    >
                                      <p
                                        style="
                                          margin: 0;
                                          font-size: 14px;
                                          text-align: center;
                                          mso-line-height-alt: 16.8px;
                                        "
                                      >
                                        <span style="font-size: 42px"
                                          >Confirmação de Pedido</span
                                        >
                                      </p>
                                    </div>
                                  </div>
                                </td>
                              </tr>
                            </table>
                            <table
                              class="text_block block-2"
                              width="100%"
                              border="0"
                              cellpadding="10"
                              cellspacing="0"
                              role="presentation"
                              style="
                                mso-table-lspace: 0;
                                mso-table-rspace: 0;
                                word-break: break-word;
                              "
                            >
                              <tr>
                                <td class="pad">
                                  <div style="font-family: sans-serif">
                                    <div
                                      class
                                      style="
                                        font-size: 14px;
                                        font-family: Arial, 'Helvetica Neue',
                                          Helvetica, sans-serif;
                                        mso-line-height-alt: 16.8px;
                                        color: #555;
                                        line-height: 1.2;
                                      "
                                    >
                                      <p
                                        style="
                                          margin: 0;
                                          font-size: 14px;
                                          text-align: center;
                                          mso-line-height-alt: 16.8px;
                                        "
                                      >
                                        <span style="font-size: 22px"
                                          >Olá, ${user.name}</span
                                        >
                                      </p>
                                    </div>
                                  </div>
                                </td>
                              </tr>
                            </table>
                            <table
                              class="text_block block-3"
                              width="100%"
                              border="0"
                              cellpadding="10"
                              cellspacing="0"
                              role="presentation"
                              style="
                                mso-table-lspace: 0;
                                mso-table-rspace: 0;
                                word-break: break-word;
                              "
                            >
                              <tr>
                                <td class="pad">
                                  <div style="font-family: sans-serif">
                                    <div
                                      class
                                      style="
                                        font-size: 14px;
                                        font-family: Arial, 'Helvetica Neue',
                                          Helvetica, sans-serif;
                                        mso-line-height-alt: 16.8px;
                                        color: #555;
                                        line-height: 1.2;
                                      "
                                    >
                                      <p
                                        style="
                                          margin: 0;
                                          font-size: 14px;
                                          text-align: center;
                                          mso-line-height-alt: 16.8px;
                                        "
                                      >
                                        <span style="font-size: 18px"
                                          >Seu pedido na Green Life foi
                                          finalizado!
                                        </span>
                                      </p>
                                      <p
                                        style="
                                          margin: 0;
                                          font-size: 14px;
                                          text-align: center;
                                          mso-line-height-alt: 16.8px;
                                        "
                                      >
                                        <span style="font-size: 18px"
                                          >Aqui estão os detalhes do seu
                                          pedido:</span
                                        >
                                      </p>
                                    </div>
                                  </div>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
              </tbody>
            </table>
            <table
              class="row row-2"
              align="center"
              width="100%"
              border="0"
              cellpadding="0"
              cellspacing="0"
              role="presentation"
              style="mso-table-lspace: 0; mso-table-rspace: 0"
            >
              <tbody>
                <tr>
                  <td>
                    <table
                      class="row-content stack"
                      align="center"
                      border="0"
                      cellpadding="0"
                      cellspacing="0"
                      role="presentation"
                      style="
                        mso-table-lspace: 0;
                        mso-table-rspace: 0;
                        border-radius: 0;
                        color: #000;
                        width: 500px;
                        margin: 0 auto;
                      "
                      width="500"
                    >
                      <tbody>
                        <tr>
                          ${productList}
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
      </tbody>
    </table>
    <!-- End -->
    <div style="background-color: transparent">
      <div
        style="
          margin: 0 auto;
          min-width: 320px;
          max-width: 500px;
          overflow-wrap: break-word;
          word-wrap: break-word;
          word-break: break-word;
          background-color: transparent;
        "
        class="block-grid"
      >
        <div
          style="
            border-collapse: collapse;
            display: table;
            width: 100%;
            background-color: transparent;
          "
        >
          <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="background-color:transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width: 500px;"><tr class="layout-full-width" style="background-color:transparent;"><![endif]-->
          <!--[if (mso)|(IE)]><td align="center" width="500" style=" width:500px; padding-right: 0px; padding-left: 0px; padding-top:15px; padding-bottom:15px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><![endif]-->
          <div
            class="col num12"
            style="
              min-width: 320px;
              max-width: 500px;
              display: table-cell;
              vertical-align: top;
            "
          >
            <div style="background-color: transparent; width: 100% !important">
              <!--[if (!mso)&(!IE)]><!-->
              <div
                style="
                  border-top: 0px solid transparent;
                  border-left: 0px solid transparent;
                  border-bottom: 0px solid transparent;
                  border-right: 0px solid transparent;
                  padding-top: 15px;
                  padding-bottom: 15px;
                  padding-right: 0px;
                  padding-left: 0px;
                "
              >
                <!--<![endif]-->

                <!--[if (!mso)&(!IE)]><!-->
              </div>
              <!--<![endif]-->
            </div>
          </div>
          <!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]-->
        </div>
      </div>
    </div>
  </body>
</html>

`,
      },
      function (error: any, info: any) {
        if (error) {
          return error;
        } else {
          throw new CustomError(info.response, 400);
        }
      }
    );

    res.send("ok");
  } catch (error: any) {
    console.log(error);
  }
}
