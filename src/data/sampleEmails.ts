import { EmailSample } from '../types';

export const SAMPLE_EMAILS: EmailSample[] = [
  {
    id: 'sample-legit-1',
    title: 'Midterm Exam Schedule (Legitimate)',
    category: 'legitimate',
    description: 'Official academic schedule from college examination office with valid SPF, DKIM, and DMARC.',
    rawEmail: `Delivered-To: student@college.edu
Received: by 2002:a05:6e02:18c4:0:0:0:0 with SMTP id v4csp891012;
        Mon, 12 Oct 2026 09:15:22 -0700 (PDT)
Return-Path: <exams@college.edu>
Authentication-Results: mx.google.com;
       spf=pass (google.com: domain of exams@college.edu designates 198.51.100.14 as permitted sender) smtp.mailfrom=exams@college.edu;
       dkim=pass header.i=@college.edu header.s=campus2026 header.b=X9bK2L9;
       dmarc=pass (p=REJECT sp=REJECT dis=NONE) header.from=college.edu
Received-SPF: pass (google.com: domain of exams@college.edu designates 198.51.100.14 as permitted sender)
Message-ID: <20261012091522.academic-exams.91823@college.edu>
Date: Mon, 12 Oct 2026 09:15:22 -0700
From: "College Examination Office" <exams@college.edu>
Reply-To: <exams@college.edu>
To: "Enrolled Students" <all-students@college.edu>
Subject: Fall 2026 Midterm Examination Schedule & Room Allocations
Content-Type: text/plain; charset="UTF-8"

Dear Student,

The official Fall 2026 Midterm Examination timetable is now finalized and published for all undergraduate and graduate courses.

Examinations will commence on Monday, October 26, 2026, and run through Friday, November 6, 2026. Please check your personalized examination schedule, assigned seat numbers, and building locations by visiting your student academic portal:

https://portal.college.edu/exams/schedule-2026

Important Guidelines:
1. Please arrive at your allocated hall at least 15 minutes prior to the start time.
2. Carry your physical Student ID card; digital screenshots are not accepted by proctors.
3. If you have an exam conflict (two examinations scheduled simultaneously), submit an accommodation petition before October 19.

For exam room disability accommodations or approved rescheduling inquiries, please contact the Registrar's Office at accommodations@college.edu or visit Hall Building B, Room 204 during standard administrative hours (9:00 AM - 4:30 PM).

Sincerely,
Office of Academic Records & Examinations
State College Administration
https://portal.college.edu
`,
  },
  {
    id: 'sample-legit-2',
    title: 'Library Overdue Book Notice (Legitimate)',
    category: 'legitimate',
    description: 'Routine automated circulation notice from the campus library with verified domain and clear contact.',
    rawEmail: `Delivered-To: student@college.edu
Received: by 2002:a05:6e02:44d1:0:0:0:0 with SMTP id r17csp341991;
        Tue, 13 Oct 2026 14:02:10 -0700 (PDT)
Return-Path: <library-services@college.edu>
Authentication-Results: mx.google.com;
       spf=pass (google.com: domain of library-services@college.edu designates 198.51.100.22 as permitted sender) smtp.mailfrom=library-services@college.edu;
       dkim=pass header.i=@college.edu header.s=library2026 header.b=M8qV4N1;
       dmarc=pass (p=REJECT sp=REJECT dis=NONE) header.from=college.edu
Received-SPF: pass (google.com: domain of library-services@college.edu designates 198.51.100.22 as permitted sender)
Message-ID: <lib-circ-notice-874219@college.edu>
Date: Tue, 13 Oct 2026 14:02:10 -0700
From: "Campus Memorial Library" <library-services@college.edu>
Reply-To: <library-services@college.edu>
To: "Student Reader" <student@college.edu>
Subject: Courtesy Notice: Borrowed Course Reserve Books Due in 3 Days
Content-Type: text/plain; charset="UTF-8"

Hello Alex,

This is a courtesy reminder from the Campus Memorial Library Circulation Desk. 

The following loaned material checked out under your student ID is scheduled for return in 3 calendar days:

- Title: "Introduction to Algorithms, Fourth Edition" (Call No: QA76.6 .C662 2022)
- Due Date: Friday, October 16, 2026 by 5:00 PM
- Current Location: Main Circulation Desk, Level 1

Renewing Your Material:
If no other student has placed a hold on this item, you may renew it for an additional 14 days online through your library portal account:
https://library.college.edu/account/renew

If you have already returned this volume to the 24/7 book drop bin today, please disregard this automated notification as check-in batches are processed at 9:00 AM daily.

For research desk assistance, feel free to drop by the reference section or reach us via chat at https://library.college.edu/help.

Warm regards,
Circulation & Access Services
Memorial Library, State College
`,
  },
  {
    id: 'sample-legit-3',
    title: 'Annual Merit Scholarship Announcement (Legitimate)',
    category: 'legitimate',
    description: 'Campus financial aid announcement with institutional links, official office location, and full auth pass.',
    rawEmail: `Delivered-To: student@college.edu
Received: by 2002:a05:6e02:99a8:0:0:0:0 with SMTP id z8csp112903;
        Wed, 07 Oct 2026 11:30:45 -0700 (PDT)
Return-Path: <financialaid@college.edu>
Authentication-Results: mx.google.com;
       spf=pass (google.com: domain of financialaid@college.edu designates 198.51.100.18 as permitted sender) smtp.mailfrom=financialaid@college.edu;
       dkim=pass header.i=@college.edu header.s=finaid2026 header.b=W2cQ9K0;
       dmarc=pass (p=REJECT sp=REJECT dis=NONE) header.from=college.edu
Received-SPF: pass (google.com: domain of financialaid@college.edu designates 198.51.100.18 as permitted sender)
Message-ID: <finaid-merit-announcement-20261007@college.edu>
Date: Wed, 07 Oct 2026 11:30:45 -0700
From: "Office of Student Financial Aid" <financialaid@college.edu>
Reply-To: <financialaid@college.edu>
To: "Undergraduate Students" <undergraduates@college.edu>
Subject: Announcement: 2026-2027 Academic Merit Scholarship Applications Open
Content-Type: text/plain; charset="UTF-8"

Dear Undergraduate Students,

The College Endowment and Alumni Association are pleased to announce the opening of competitive applications for the 2026-2027 Academic Merit Scholarships.

Over forty endowed scholarships are available across STEM, Humanities, Business, and Health Sciences disciplines, ranging from $1,500 to $7,500 in direct tuition assistance.

Eligibility Criteria:
- Enrolled full-time in an accredited undergraduate degree program.
- Minimum cumulative GPA of 3.20 at the time of submission.
- One letter of recommendation from a college faculty member.

Application Deadline:
All application essays and supporting documents must be submitted through the official campus financial aid portal by Friday, November 20, 2026 at 11:59 PM:
https://finaid.college.edu/scholarships/merit-application

Workshops & Q&A Sessions:
Our financial aid advisors are conducting drop-in informational sessions every Tuesday and Thursday at Student Union Building Room 112 from 2:00 PM to 4:00 PM.

Please note: The College Financial Aid Office will never request your banking passwords or wire fees to apply for scholarships. Official notifications will always arrive from @college.edu addresses.

Sincerely,
Office of Student Financial Assistance
State College Campus Center, Suite 100
financialaid@college.edu | https://finaid.college.edu
`,
  },
  {
    id: 'sample-phish-1',
    title: 'Fake Principal Asking for Gift Cards (Phishing)',
    category: 'phishing',
    description: 'Impersonates college leadership from a free Gmail account with mismatched Reply-To, requesting urgent gift cards.',
    rawEmail: `Delivered-To: student@college.edu
Received: by 2002:a17:902:c205:0:0:0:0 with SMTP id t5csp982144;
        Wed, 14 Oct 2026 04:12:08 -0700 (PDT)
Return-Path: <principal.office2491@gmail.com>
Authentication-Results: mx.google.com;
       spf=pass (google.com: domain of principal.office2491@gmail.com designates 209.85.220.41 as permitted sender) smtp.mailfrom=principal.office2491@gmail.com;
       dkim=pass header.i=@gmail.com header.s=20230601 header.b=hK3P1L0;
       dmarc=fail (p=NONE sp=NONE dis=NONE) header.from=college.edu
Received-SPF: pass (google.com: domain of principal.office2491@gmail.com designates 209.85.220.41 as permitted sender)
Message-ID: <CAGv_9mK0L=82js912js019@mail.gmail.com>
Date: Wed, 14 Oct 2026 04:12:08 -0700
From: "Principal Arthur Vance" <principal.office2491@gmail.com>
Reply-To: <confidential-task@outlook.com>
To: "Student Council Member" <student@college.edu>
Subject: URGENT ASSISTANCE NEEDED - In a closed committee meeting
Content-Type: text/plain; charset="UTF-8"

Are you on campus right now?

I am currently in an all-day confidential executive board meeting and unable to take incoming calls or voice messages. I have an urgent and discreet assignment that requires immediate attention before 11:00 AM.

I need you to urgently help me purchase 4 Apple / Steam Gift Cards ($100 each, $400 total) for guest speakers and distinguished symposium presenters. The campus bookstore system is currently down for maintenance.

Please follow these exact instructions immediately:
1. Walk to the nearest store (Walmart, Target, or CVS pharmacy).
2. Purchase four $100 gift cards with cash or credit.
3. Gently scratch off the silver security panels on the back.
4. Take clear photos of the 16-digit card codes and PINs.
5. Email the pictures directly to this address right now.

Do not call my office line as my phone is on silent during proceedings. I will reimburse you with a college treasury check plus an honorarium stipend first thing tomorrow morning.

Treat this matter with the highest urgency and strict confidentiality.

Best regards,
Dr. Arthur Vance
Principal & Executive Dean of Students
State College Administration
`,
  },
  {
    id: 'sample-phish-2',
    title: 'Fake Password Expiry & Look-Alike Domain (Phishing)',
    category: 'phishing',
    description: 'Fake IT Helpdesk email warning of 24h password expiration with typosquatted "co11ege.edu" and hidden .xyz phishing URL.',
    rawEmail: `Delivered-To: student@college.edu
Received: by 2002:a25:8801:0:0:0:0 with SMTP id q1csp771092;
        Wed, 14 Oct 2026 02:45:19 -0700 (PDT)
Return-Path: <support@co11ege.edu>
Authentication-Results: mx.google.com;
       spf=softfail (google.com: domain of support@co11ege.edu does not designate 185.220.101.5 as permitted sender) smtp.mailfrom=support@co11ege.edu;
       dkim=none (no signature found);
       dmarc=fail (p=REJECT sp=REJECT dis=REJECT) header.from=co11ege.edu
Received-SPF: softfail (google.com: domain of support@co11ege.edu does not designate 185.220.101.5 as permitted sender)
Message-ID: <20261014024519.co11ege.auth.8812@mail-relay-server.ru>
Date: Wed, 14 Oct 2026 02:45:19 -0700
From: "IT Helpdesk Services" <support@co11ege.edu>
Reply-To: <verify-account@co11ege.edu>
To: <student@college.edu>
Subject: CRITICAL ACTION REQUIRED: Your College Email & Portal Password Expires in 24 Hours
Content-Type: text/html; charset="UTF-8"

<!DOCTYPE html>
<html>
<body style="font-family: Arial, sans-serif; color: #222;">
<p>Dear Student,</p>

<p><strong style="color: #c00;">FINAL WARNING:</strong> We detected that your State College Single Sign-On (SSO) email and student portal password is set to expire within <strong>24 hours</strong> due to campus annual security audit compliance.</p>

<p>Failure to verify your credentials immediately will result in your student account being <strong>permanently suspended</strong>, terminating your access to:</p>
<ul>
  <li>Campus Canvas course modules & homework submissions</li>
  <li>Student institutional email inbox</li>
  <li>Fall semester midterm grading and registration</li>
</ul>

<p>To keep your current password and prevent immediate suspension, you must verify your identity through our secure directory portal right now:</p>

<p style="margin: 24px 0;">
  <a href="http://login-verify-college.account-auth.xyz/portal/sso-login" style="background: #0056b3; color: white; padding: 12px 20px; text-decoration: none; border-radius: 4px; font-weight: bold;">
    https://portal.college.edu/reset-password
  </a>
</p>

<p>Note: Enter your current college username, password, and Duo 2FA push token when prompted to authenticate.</p>

<p>This is an automated security system message. Do not reply to this notification.</p>

<p>State College Information Technology Infrastructure<br>
Campus Cyber Operations Center</p>
</body>
</html>
`,
  },
  {
    id: 'sample-phish-3',
    title: 'Fake Scholarship with URL Shortener & Mismatched Reply (Phishing)',
    category: 'phishing',
    description: 'Look-alike "college-edu.com" sender, mismatched Yahoo Reply-To, urgency, money hook, and bit.ly URL shortener.',
    rawEmail: `Delivered-To: student@college.edu
Received: by 2002:a05:6402:110b:0:0:0:0 with SMTP id f11csp55431;
        Wed, 14 Oct 2026 03:20:10 -0700 (PDT)
Return-Path: <awards@college-edu.com>
Authentication-Results: mx.google.com;
       spf=none (google.com: college-edu.com does not designate permitted sender hosts);
       dkim=none (message not signed);
       dmarc=none (p=NONE sp=NONE dis=NONE) header.from=college-edu.com
Received-SPF: none
Message-ID: <awards-dispatch-99014@college-edu.com>
Date: Wed, 14 Oct 2026 03:20:10 -0700
From: "Scholarship Committee" <awards@college-edu.com>
Reply-To: <deansgrantclaim@yahoo.com>
To: <student@college.edu>
Subject: CONGRATULATIONS: You Have Been Awarded the $5,000 Dean's Emergency Grant - Claim Within 24 Hours
Content-Type: text/plain; charset="UTF-8"

Dear Student / Faculty,

CONGRATULATIONS! You have been selected by the College Special Review Board as a recipient of the 2026 Dean's Emergency Financial Relief Grant in the amount of $5,000.00 USD.

This scholarship fund was created to provide immediate economic assistance for enrolled students. Because this is a high-demand emergency allocation, your grant must be claimed within 24 hours of receiving this email or the funds will be permanently forfeited and redistributed to the next student on the waiting list.

To verify your recipient status and set up your direct deposit or wire transfer, claim your award at the official link below:

https://bit.ly/claim-grant-2026

You will be asked to confirm your student ID, portal credentials, and bank account routing information to expedite deposit processing.

Kindly act immediately to guarantee your $5,000 disbursement.

Sincerely,
Dean's Special Scholarship Board
State College Foundation
awards@college-edu.com
`,
  },
];
