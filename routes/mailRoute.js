import express from "express";
import nodemailer from "nodemailer";
import multer from "multer";
import dotenv from "dotenv";

import { v4 as uuidv4 } from "uuid";


dotenv.config();

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/send-mail", upload.single("pdf"), async (req, res) => {
  try {
    const {
      employeeId,
      employeeName,
      assetType,
      make,
      location,
      approverName,
      toEmail,
      ccEmail,
    } = req.body;

    const pdfFile = req.file;

    if (
      !employeeId ||
      !employeeName ||
      !assetType ||
      !make ||
      !location ||
      !approverName ||
      !toEmail
    ) {
      return res.status(400).json({ error: "Missing required fields" });
    }

   
    const requestId = uuidv4();

    
    const approvalLink = `http://localhost:5173/approval/${requestId}`;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    });

    const htmlTemplate = `
      <div style="font-family: Arial, sans-serif; line-height:1.6;">
        
        <h2 style="color:#1e40af;">
          Asset Allocation Approval Request
        </h2>

        <p>Dear ${approverName},</p>

        <p>
          A new asset allocation request has been submitted.
          Kindly verify and complete the approval process.
        </p>

        <table 
          style="border-collapse: collapse; width: 100%; margin-top: 15px;"
          border="1"
        >
          <tr style="background-color:#2563eb; color:white;">
            <th style="padding:10px;">Employee ID</th>
            <th style="padding:10px;">Employee Name</th>
            <th style="padding:10px;">Asset Type</th>
            <th style="padding:10px;">Make</th>
            <th style="padding:10px;">Location</th>
          </tr>
          <tr>
            <td style="padding:10px;">${employeeId}</td>
            <td style="padding:10px;">${employeeName}</td>
            <td style="padding:10px;">${assetType}</td>
            <td style="padding:10px;">${make}</td>
            <td style="padding:10px;">${location}</td>
          </tr>
        </table>

        <br/>

        <div style="margin-top:20px;">
          <a 
            href="${approvalLink}"
            style="
              background-color:#16a34a;
              color:white;
              padding:10px 18px;
              text-decoration:none;
              border-radius:5px;
              display:inline-block;
            "
          >
            👉 Click here to review and approve the request
          </a>
        </div>

        <br/><br/>

        <p>Thanks and Regards,</p>
        <p><strong>NRL Asset Track</strong></p>

        <hr/>
      

      </div>
    `;

    const mailOptions = {
      from: `"NRL Asset Track" <${process.env.EMAIL}>`,
      to: toEmail,
      cc: ccEmail || "",
      subject: `Asset Allocation Approval – ${employeeName}`,
      html: htmlTemplate,
      attachments: pdfFile
        ? [
            {
              filename: pdfFile.originalname,
              content: pdfFile.buffer,
              contentType: "application/pdf",
            },
          ]
        : [],
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({
      message: "Email sent successfully!",
      requestId,
    });

  } catch (error) {
    console.error("Mail Error:", error);
    res.status(500).json({ error: "Failed to send email" });
  }
});

export default router;