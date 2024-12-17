const express = require("express");
const nodemailer = require("nodemailer");
const {
    upload
} = require("../config/cloudinary");
const Student = require("../models/Student");
// const Segment=require("../models/Segment");
const router = express.Router();
router.post("/sendEmail", async (req, res) => {
    try {
        const {
            students,
            segments
        } = req.body;

        // Validate the request
        if (!students || students.length === 0) {
            return res.status(400).send("Student details are required.");
        }

        if (!segments || segments.length === 0) {
            return res.status(400).send("Email segments are required.");
        }

        // Create transporter for sending the email
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: "megarajan55@gmail.com", // Replace with your email
                pass: "jrwg fhjo guri toat", // Replace with your app-specific password
            },
        });

        // Send emails to each student in the provided list
        for (const student of students) {
            const emailContent = segments.map((segment) => {
                if (segment.type === "segment-1") {
                    return `
            <div style="margin:0 auto;background: ${segment.content.backgroundColor || "#fff"};">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td style="width:70%;padding:15px;">
                    <div style="display: flex; align-items:center;">
                      <img src="${segment.content.icon}" alt="Icon" style="width: 50px; height: 50px;" />
                      <h1 style="font-size: 25px; color: #080404; font-weight: 600; margin-left:20px;padding-top:5px;">
                        ${segment.content.heading.replace("{name}", student.name)}
                      </h1>
                    </div>
                    <p style="color: #0a0404; font-size:16px;">
                      ${segment.content.text.replace("{phone}", student.phone)}
                    </p>
                  </td>
                  <td class="right-image" style="width:30%; padding:10px; text-align:right;">
                    <img src="${segment.content.image}" alt="Right Image" style="max-width: 100%; height: auto;" />
                  </td>
                </tr>
              </table>
            </div>
          `;
                } else if (segment.type === "segment-2") {
                    return `
            <div style="margin:30px;">
              <p style="font-weight:600">${segment.content.input} ${student.email}</p>
              <p>${segment.content.textEditor}</p>
            </div>
          `;
                }
          else if (segment.type === "segment-3") {
              return `
    <div style="margin:0px 30px; padding:10px; background: ${
      segment.content.backgroundColor || "#fff"
    }; font-family: Arial, sans-serif;">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-spacing: 0; border-collapse: collapse; table-layout: fixed;">
        <tr>
          <!-- Left Column: Text and Button -->
          <td style="width: 70%; padding:25px 15px; vertical-align:top;">
            <h1 style="font-size: 20px; color: #080404; font-weight: bold; margin: 0 0 10px;">
              ${segment.content.heading}
            </h1>
            <a href="${segment.content.input}" style="
              display: inline-block;
              text-decoration: none;
              background-color: #306aa3;
              border-radius: 5px;
              color: #ffffff;
              padding: 10px 15px;
              font-size: 14px;
              font-weight: bold;
              margin-top: 10px;">
              Click Here to Know More
            </a>
          </td>
          <!-- Right Column: Image -->
          <td style="width: 30%; padding: 15px; text-align: right; vertical-align: top;">
            <img src="${segment.content.image}" alt="Right Image" style="
              max-width: 100%;
              height: auto;
              display: block;
              border: none;"/>
          </td>
        </tr>
      </table>
    </div>`;
        
                }
                return "";
            });

            const mailOptions = {
                from: "megarajan55@gmail.com",
                to: student.email,
                subject: "Your Student Details",
                html: `
          <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; margin: 0; padding: 0; }
              h1 {font-size: 28px; color: #333;}
              p {font-size: 16px; color: #333;}
              @media(max-width:768px) {
                .right-image {
                  display:none!important;
                }
                h1 {
                  font-size: 20px!important;
                }
                p {
                  font-size: 15px!important;
                  margin-left: 0!important;
                }
              } 
            </style>
          </head>
          <body>
            <h1>Hello, ${student.name}!</h1>
            <div style="max-width:800px;background-color:#fff;">
              ${emailContent.join("")}
            </div>
          </body>
          </html>
        `,
            };

            // Send email to the student
            await transporter.sendMail(mailOptions);
            console.log("Email sent to:", student.email);
        }

        res.status(200).send("Emails sent successfully to the last 3 students!");
    } catch (err) {
        console.error("Error sending email:", err);
        res.status(500).send("Failed to send email.");
    }
});

router.post("/savestudent", async (req, res) => {
    try {
        const studentsList = req.body; // Expecting an array of students

        // Validate that the studentsList is an array and not empty
        if (!Array.isArray(studentsList) || studentsList.length === 0) {
            return res.status(400).send("No student data to save.");
        }

        // Iterate through each student in the array and save them individually
        const savedStudents = [];
        for (const student of studentsList) {
            const {
                name,
                email,
                phone,
                subject,
                message
            } = student;

            // Validate individual student data
            if (!name || !email || !phone || !subject || !message) {
                return res.status(400).send("All fields are required for each student.");
            }

            const newStudent = new Student({
                name,
                email,
                phone,
                subject,
                message
            });

            // Save the student and add to savedStudents array
            const savedStudent = await newStudent.save();
            savedStudents.push(savedStudent);
        }

        // Respond with the list of saved students
        res.status(201).json(savedStudents);
    } catch (err) {
        console.error("Error saving student:", err);
        res.status(500).send("Failed to save student details.");
    }
});

router.post('/upload', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({
            error: 'No file uploaded!'
        });
    }
    res.status(200).json({
        url: req.file.path
    });
});
module.exports = router;

