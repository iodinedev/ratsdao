import { prisma } from "../components/prisma";
import bcrypt from "bcryptjs";
import { PublicError } from "../components/sentry";
import nodemailer from "nodemailer";
import { ses } from "../components/aws";
import * as aws from "@aws-sdk/client-ses";

// create Nodemailer SES transporter
let transporter = nodemailer.createTransport({
  SES: { ses, aws },
});

export const contactService = {
  async makeHash(ip: string) {
    const salt = await bcrypt.genSalt(3);
    const hash = await bcrypt.hash(ip, salt);

    prisma.hashes
      .create({
        data: {
          hash: hash,
        },
      })
      .catch((err) => {
        throw new PublicError(err);
      });

    return hash;
  },

  async testHash(hash: string) {
    const record = await prisma.hashes
      .findUnique({
        where: {
          hash: hash,
        },
      })
      .catch((err) => {
        throw new PublicError(err);
      });

    if (!record) return false;

    return record;
  },

  async send(name, email, subject, message, hash, honeypot) {
    // Hidden value filled out is likely spam
    if (honeypot) return false;

    const timestamp = await this.testHash(hash);

    if (!timestamp) return false;

    const discrepency = Date.now() - new Date(timestamp.timestamp).getTime();

    // Form submitted in under five seconds is likely spam
    if (discrepency / 1000 < 5) return false;

    const body = `<p>New message via the contact form at [placeholder domamin].</p>\n<p>From Name: <span style="background: #ffeff0;padding: .1rem .3rem .2rem;border-radius: .2rem;">${name}</span></p>\n<p>From Email: <a href="mailto:${email}" target="_blank" rel="noopener noreferrer" style="background: #ffeff0;padding: .1rem .3rem .2rem;border-radius: .2rem;">${email}</a></p>\n<p>Subject: <span style="background: #ffeff0;padding: .1rem .3rem .2rem;border-radius: .2rem;">${subject}</span></p>\n<p>Message:\n<div style="background: #ffeff0;padding: .1rem .3rem .2rem;border-radius: .2rem;">${message}</div></p>`;

    transporter.sendMail(
      {
        from: "NPHA <noreply@codingprojects.org>",
        to: "zmontgo@pm.me",
        subject: `New Message - '${subject}'`,
        html: body,
      },
      (err, info) => {
        console.log(info);
        if (err) {
          throw new PublicError(err.message);
        }
      }
    );

    return true;
  },

  async sendFeedback(name, email, message, review, hash, honeypot) {
    // Hidden value filled out is likely spam
    if (honeypot) return false;

    const timestamp = await this.testHash(hash);

    if (!timestamp) return false;

    const discrepency = Date.now() - new Date(timestamp.timestamp).getTime();

    // Form submitted in under five seconds is likely spam
    if (discrepency / 1000 < 5) return false;

    const allow = review == "on" ? true : false;

    const body = `<p>New message via the feedback form at [placeholder domamin].</p>\n<p>From Name: <span style="background: #ffeff0;padding: .1rem .3rem .2rem;border-radius: .2rem;">${name}</span></p>\n<p>From Email: <a href="mailto:${email}" target="_blank" rel="noopener noreferrer" style="background: #ffeff0;padding: .1rem .3rem .2rem;border-radius: .2rem;">${email}</a></p>\n<p>Message:\n<div style="background: #ffeff0;padding: .1rem .3rem .2rem;border-radius: .2rem;">${message}</div></p>\n<p>Allows review to be posted: <span style="background: #ffeff0;padding: .1rem .3rem .2rem;border-radius: .2rem;">${
      allow ? "yes" : "no"
    }</span></p>`;

    transporter.sendMail(
      {
        from: "NPHA <noreply@codingprojects.org>",
        to: "zmontgo@pm.me",
        subject: `New Feedback`,
        html: body,
      },
      (err, info) => {
        console.log(info);
        if (err) {
          throw new PublicError(err.message);
        }
      }
    );

    return true;
  },
};
